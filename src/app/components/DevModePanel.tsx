import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bug,
  CheckCircle2,
  Clock3,
  Download,
  Gauge,
  Map,
  Play,
  Route,
  X,
} from "lucide-react";
import {
  getObservabilitySnapshot,
  refreshObservabilitySnapshot,
  subscribeObservability,
} from "../lib/observability/session";
import { aggregateClickPoints, rankedSections } from "../lib/observability/heatmap";
import {
  identifyBottlenecks,
  runRuntimeDiagnostics,
} from "../lib/observability/diagnostics";
import {
  buildSanitizedReport,
  DownloadTransport,
  LocalSessionTransport,
} from "../lib/observability/export";
import type {
  Bottleneck,
  DiagnosticResult,
  DiagnosticStatus,
  HeatmapCell,
  SessionSnapshot,
} from "../lib/observability/types";

type TabId = "overview" | "performance" | "journey" | "heatmap" | "bottlenecks" | "diagnostics";

const tabs: Array<{ id: TabId; label: string; Icon: typeof Activity }> = [
  { id: "overview", label: "Visão geral", Icon: Activity },
  { id: "performance", label: "Performance", Icon: Gauge },
  { id: "journey", label: "Jornada", Icon: Route },
  { id: "heatmap", label: "Heatmap", Icon: Map },
  { id: "bottlenecks", label: "Gargalos", Icon: AlertTriangle },
  { id: "diagnostics", label: "Diagnósticos", Icon: Bug },
];

const statusStyles: Record<DiagnosticStatus, string> = {
  good: "border-[#4A7FA7]/40 bg-[#4A7FA7]/10 text-[var(--foreground)]",
  attention: "border-[var(--terra)]/45 bg-[var(--terra)]/10 text-[var(--foreground)]",
  critical: "border-[var(--destructive)]/45 bg-[var(--destructive)]/10 text-[var(--foreground)]",
  unavailable: "border-[var(--border)] bg-[var(--muted)]/40 text-[var(--muted-foreground)]",
};

function formatDuration(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "Não disponível";
  }
  if (value < 1_000) return `${Math.round(value)}ms`;
  const seconds = value / 1_000;
  if (seconds < 60) return `${seconds.toFixed(seconds >= 10 ? 0 : 1)}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}min ${Math.round(seconds % 60)}s`;
}

function formatBytes(value: number | null): string {
  if (value === null) return "Cache/indisponível";
  if (value < 1_024) return `${value} B`;
  return `${(value / 1_024).toFixed(1)} kB`;
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-[var(--muted-foreground)]" style={{ fontSize: "0.72rem" }}>
        {label}
      </p>
      <strong className="mt-2 block text-xl text-[var(--foreground)]">{value}</strong>
      {detail && (
        <p className="mt-1 text-[var(--muted-foreground)]" style={{ fontSize: "0.7rem" }}>
          {detail}
        </p>
      )}
    </article>
  );
}

function StatusList({
  items,
}: {
  items: Array<DiagnosticResult | Bottleneck>;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--muted-foreground)]">
        Nenhum gargalo confirmado nesta sessão.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className={`rounded-2xl border p-4 ${statusStyles[item.status]}`}>
          <div className="flex items-start justify-between gap-4">
            <strong style={{ fontSize: "0.86rem" }}>{item.label}</strong>
            <span
              className="shrink-0 rounded-full border border-current/20 px-2 py-0.5"
              style={{ fontSize: "0.62rem", textTransform: "uppercase" }}
            >
              {item.status === "good"
                ? "bom"
                : item.status === "attention"
                  ? "atenção"
                  : item.status === "critical"
                    ? "crítico"
                    : "não disponível"}
            </span>
          </div>
          <p className="mt-2 opacity-80" style={{ fontSize: "0.76rem" }}>
            {item.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}

function HeatmapOverlay({
  cells,
  onClose,
}: {
  cells: HeatmapCell[];
  onClose: () => void;
}) {
  return (
    <div
      aria-label="Overlay do mapa da sessão atual"
      className="pointer-events-none fixed inset-0 z-[90] bg-[#0A1931]/25"
    >
      <div className="fixed left-3 top-3 rounded-lg border border-white/20 bg-[#0A1931]/95 px-3 py-2 text-xs text-white shadow-xl">
        Mapa da sessão atual
      </div>
      <button
        type="button"
        onClick={onClose}
        className="pointer-events-auto fixed right-3 top-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-[#0A1931] px-4 text-sm text-white shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <X className="h-4 w-4" /> Fechar mapa
      </button>
      {cells.map((cell) => (
        <span
          key={`${cell.x}-${cell.y}`}
          className="absolute rounded-full bg-[var(--terra)] shadow-[0_0_18px_rgba(205,118,93,0.55)]"
          style={{
            left: `${((cell.x + 0.5) / 28) * 100}%`,
            top: `${((cell.y + 0.5) / 48) * 100}%`,
            width: `${12 + cell.intensity * 22}px`,
            height: `${12 + cell.intensity * 22}px`,
            opacity: 0.22 + cell.intensity * 0.48,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

function SessionHeatmap({ snapshot }: { snapshot: SessionSnapshot }) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const cells = useMemo(
    () => aggregateClickPoints(snapshot.clickPoints),
    [snapshot.clickPoints],
  );
  const sections = rankedSections(snapshot.sections);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)]">
      <div>
        <div
          className="relative min-h-[420px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
          role="img"
          aria-label={`Miniatura do mapa com ${snapshot.clickPoints.length} ponto(s) agregado(s)`}
        >
          <div className="absolute inset-x-0 top-0 h-16 border-b border-[var(--border)] bg-[var(--surface-2)]/50" />
          {cells.map((cell) => (
            <span
              key={`${cell.x}-${cell.y}`}
              className="absolute rounded-full bg-[var(--terra)]"
              style={{
                left: `${((cell.x + 0.5) / 28) * 100}%`,
                top: `${((cell.y + 0.5) / 48) * 100}%`,
                width: `${8 + cell.intensity * 14}px`,
                height: `${8 + cell.intensity * 14}px`,
                opacity: 0.24 + cell.intensity * 0.55,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
          {cells.length === 0 && (
            <p className="absolute inset-0 grid place-items-center px-6 text-center text-[var(--muted-foreground)]">
              Interaja com a página para formar o mapa desta sessão.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOverlayOpen(true)}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--foreground)] transition-colors hover:border-[var(--ice-blue)]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60"
        >
          <Map className="h-4 w-4" /> Exibir overlay temporário
        </button>
        {overlayOpen && <HeatmapOverlay cells={cells} onClose={() => setOverlayOpen(false)} />}
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="text-[var(--foreground)]">Profundidade desta sessão</h3>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--ice-blue)]"
              style={{ width: `${Math.min(100, snapshot.maxScrollDepth)}%` }}
            />
          </div>
          <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: "0.76rem" }}>
            {snapshot.maxScrollDepth.toFixed(1)}% alcançado. Não representa taxa global.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="text-[var(--foreground)]">Intensidade por seção</h3>
          <ul className="mt-4 space-y-3">
            {sections.map((section) => {
              const maxTime = Math.max(1, ...sections.map((item) => item.timeMs));
              return (
                <li key={section.id}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span>#{section.id}</span>
                    <span className="text-[var(--muted-foreground)]">
                      {formatDuration(section.timeMs)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--ice-blue)]"
                      style={{ width: `${Math.max(4, (section.timeMs / maxTime) * 100)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4 text-[var(--muted-foreground)]" style={{ fontSize: "0.76rem" }}>
          Mapa da sessão atual. Pontos agrupados em grade 28 × 48, limite de 400 cliques ou toques.
          {snapshot.heatmapLimitReached ? " O limite de coleta foi alcançado." : ""}
        </p>
      </div>
    </div>
  );
}

export default function DevModePanel({
  onRequestClose,
}: {
  onRequestClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const titleId = useId();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [exportStatus, setExportStatus] = useState("");
  const snapshot = useSyncExternalStore(
    subscribeObservability,
    getObservabilitySnapshot,
    getObservabilitySnapshot,
  );
  const bottlenecks = useMemo(
    () => identifyBottlenecks(snapshot, diagnostics),
    [snapshot, diagnostics],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;
    const update = () => {
      if (cancelled) return;
      refreshObservabilitySnapshot();
      timer = window.setTimeout(update, 1_000);
    };
    timer = window.setTimeout(update, 1_000);
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "Enter" || event.key === " " || event.key === "Space") {
      event.preventDefault();
      setActiveTab(tabs[index].id);
      return;
    }
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    const next = tabs[nextIndex];
    setActiveTab(next.id);
    tabsRef.current[nextIndex]?.focus();
  };

  const executeDiagnostics = () => {
    setDiagnostics(runRuntimeDiagnostics());
  };

  const exportReport = () => {
    const currentDiagnostics = diagnostics.length > 0 ? diagnostics : runRuntimeDiagnostics();
    if (diagnostics.length === 0) setDiagnostics(currentDiagnostics);
    const currentBottlenecks = identifyBottlenecks(snapshot, currentDiagnostics);
    const report = buildSanitizedReport(snapshot, currentDiagnostics, currentBottlenecks);
    try {
      new LocalSessionTransport().send(report);
      new DownloadTransport().send(report);
      setExportStatus("Relatório sanitizado exportado.");
    } catch {
      setExportStatus("Não foi possível exportar neste navegador.");
    }
  };

  const visitedSections = Object.values(snapshot.sections).filter((section) => section.viewed);
  const ctaCount = snapshot.events.filter((event) => event.name === "cta_click").length;
  const resourcesByType = snapshot.performance.resources.reduce<Record<string, number>>(
    (accumulator, resource) => {
      accumulator[resource.initiatorType] = (accumulator[resource.initiatorType] ?? 0) + 1;
      return accumulator;
    },
    {},
  );
  const sortedResources = [...snapshot.performance.resources].sort(
    (a, b) => b.duration - a.duration,
  );
  const scriptCount = snapshot.performance.resources.filter(
    (resource) => resource.initiatorType === "script" || resource.name.endsWith(".js"),
  ).length;
  const styleCount = snapshot.performance.resources.filter(
    (resource) => resource.initiatorType === "link" || resource.name.endsWith(".css"),
  ).length;
  const imageCount = snapshot.performance.resources.filter(
    (resource) => resource.initiatorType === "img",
  ).length;
  const fontCount = snapshot.performance.resources.filter((resource) =>
    /\.(woff2?|ttf|otf)$/i.test(resource.name),
  ).length;
  const lateChunkCount = snapshot.performance.resources.filter((resource) =>
    /(?:session|DevModePanel|ExperienceCardSwap).+\.js$/i.test(resource.name),
  ).length;

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onRequestClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        onRequestClose();
      }}
      className="dev-mode-dialog m-auto max-w-none overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--background)] p-0 text-[var(--foreground)] shadow-[0_34px_100px_-32px_rgba(0,0,0,0.65)] backdrop:bg-[#0A1931]/70"
    >
      <div className="dev-mode-dialog__shell flex flex-col">
        <header className="flex items-start justify-between gap-5 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4 md:px-6">
          <div>
            <div className="flex items-center gap-2 text-[var(--ice-blue)]">
              <BarChart3 className="h-4 w-4" />
              <span
                className="font-mono"
                style={{ fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase" }}
              >
                Barthy observability
              </span>
            </div>
            <h2 id={titleId} className="mt-2 text-2xl">
              Modo desenvolvedor
            </h2>
            <p className="mt-1 text-[var(--muted-foreground)]" style={{ fontSize: "0.78rem" }}>
              Métricas reais e privadas desta sessão.
            </p>
          </div>
          <button
            type="button"
            autoFocus
            aria-label="Fechar modo desenvolvedor"
            onClick={onRequestClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div
          role="tablist"
          aria-label="Áreas do modo desenvolvedor"
          className="flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2 md:px-5"
        >
          {tabs.map(({ id, label, Icon }, index) => (
            <button
              key={id}
              ref={(node) => {
                tabsRef.current[index] = node;
              }}
              id={`dev-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`dev-panel-${id}`}
              tabIndex={activeTab === id ? 0 : -1}
              onClick={() => setActiveTab(id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm transition-[background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60 ${
                activeTab === id
                  ? "bg-[var(--royal)] text-white"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div
          id={`dev-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`dev-tab-${activeTab}`}
          tabIndex={0}
          className="min-h-0 flex-1 overflow-y-auto p-4 outline-none md:p-6"
        >
          {activeTab === "overview" && (
            <div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Duração da sessão" value={formatDuration(snapshot.durationMs)} />
                <MetricCard label="Tempo visível" value={formatDuration(snapshot.visibleMs)} />
                <MetricCard label="Tempo oculto" value={formatDuration(snapshot.hiddenMs)} />
                <MetricCard
                  label="Scroll máximo"
                  value={`${snapshot.maxScrollDepth.toFixed(1)}%`}
                  detail={
                    snapshot.deepestSection
                      ? `Seção mais profunda: #${snapshot.deepestSection}`
                      : "Nenhuma seção consolidada"
                  }
                />
                <MetricCard label="Seções visitadas" value={String(visitedSections.length)} />
                <MetricCard label="CTAs clicados" value={String(ctaCount)} />
                <MetricCard label="Erros sanitizados" value={String(snapshot.errors.length)} />
                <MetricCard label="LCP" value={formatDuration(snapshot.performance.lcp)} />
                <MetricCard
                  label="CLS"
                  value={
                    snapshot.performance.cls === null
                      ? "Não disponível"
                      : snapshot.performance.cls.toFixed(3)
                  }
                  detail={`${snapshot.performance.layoutShiftCount} shift(s) observado(s)`}
                />
                <MetricCard
                  label="TTFB"
                  value={formatDuration(snapshot.performance.navigation.ttfb)}
                />
                <MetricCard
                  label="Viewport"
                  value={`${snapshot.viewport.width} × ${snapshot.viewport.height}`}
                  detail={`${snapshot.viewport.orientation} · ponteiro ${snapshot.viewport.pointer}`}
                />
                <MetricCard label="Tema" value={snapshot.theme} />
                <MetricCard
                  label="Reduced motion"
                  value={snapshot.viewport.reducedMotion ? "Ativo" : "Inativo"}
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-[var(--foreground)]">Relatório da sessão</h3>
                  <p className="mt-1 text-[var(--muted-foreground)]" style={{ fontSize: "0.76rem" }}>
                    JSON local, sanitizado e sem valores do formulário.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportReport}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--terra)] px-4 text-sm text-white transition-[background-color,transform] hover:-translate-y-[1px] hover:bg-[var(--terra-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60"
                >
                  <Download className="h-4 w-4" /> Exportar relatório da sessão
                </button>
              </div>
              <p role="status" aria-live="polite" className="mt-2 text-sm text-[var(--muted-foreground)]">
                {exportStatus}
              </p>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                  label="TTFB"
                  value={formatDuration(snapshot.performance.navigation.ttfb)}
                  detail="Resposta inicial, não tempo total."
                />
                <MetricCard
                  label="DOMContentLoaded"
                  value={formatDuration(snapshot.performance.navigation.domContentLoaded)}
                />
                <MetricCard
                  label="Load"
                  value={formatDuration(snapshot.performance.navigation.load)}
                />
                <MetricCard
                  label="Navegação total"
                  value={formatDuration(snapshot.performance.navigation.total)}
                />
                <MetricCard
                  label="Resposta"
                  value={formatDuration(snapshot.performance.navigation.response)}
                />
                <MetricCard
                  label="Processamento DOM"
                  value={formatDuration(snapshot.performance.navigation.domProcessing)}
                />
                <MetricCard label="LCP" value={formatDuration(snapshot.performance.lcp)} />
                <MetricCard
                  label="CLS"
                  value={
                    snapshot.performance.cls === null
                      ? "Não disponível"
                      : snapshot.performance.cls.toFixed(3)
                  }
                />
                <MetricCard
                  label="Maior evento observado"
                  value={formatDuration(snapshot.performance.observedInp)}
                  detail="Observação da sessão, não CrUX oficial."
                />
                <MetricCard
                  label="Recursos"
                  value={String(snapshot.performance.resources.length)}
                  detail="Entradas Resource Timing"
                />
                <MetricCard label="Scripts" value={String(scriptCount)} />
                <MetricCard label="CSS" value={String(styleCount)} />
                <MetricCard label="Imagens" value={String(imageCount)} />
                <MetricCard label="Fontes" value={String(fontCount)} />
                <MetricCard
                  label="Chunks tardios"
                  value={String(lateChunkCount)}
                  detail="Session, painel e CardSwap observados"
                />
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <h3 className="text-[var(--foreground)]">Recursos por tipo</h3>
                  <ul className="mt-4 grid grid-cols-2 gap-3">
                    {Object.entries(resourcesByType).map(([type, count]) => (
                      <li key={type} className="rounded-xl border border-[var(--border)] p-3">
                        <span className="block text-[var(--muted-foreground)] text-xs">{type}</span>
                        <strong className="mt-1 block">{count}</strong>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <h3 className="text-[var(--foreground)]">Long tasks</h3>
                  <p className="mt-2 text-[var(--muted-foreground)] text-sm">
                    {snapshot.performance.longTasks.length === 0
                      ? "Nenhuma tarefa acima de 50ms observada."
                      : `${snapshot.performance.longTasks.length} tarefa(s); maior ${formatDuration(
                          Math.max(
                            ...snapshot.performance.longTasks.map((task) => task.duration),
                          ),
                        )}.`}
                  </p>
                  {snapshot.performance.longTasks.length > 0 && (
                    <ul className="mt-3 space-y-2 text-xs text-[var(--muted-foreground)]">
                      {snapshot.performance.longTasks.slice(-6).map((task, index) => (
                        <li key={`${task.startTime}-${index}`}>
                          {formatDuration(task.duration)} por volta de{" "}
                          {formatDuration(task.startTime)} após a navegação
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="border-b border-[var(--border)] px-5 py-4">
                  <h3 className="text-[var(--foreground)]">Recursos mais lentos</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="text-[var(--muted-foreground)]">
                      <tr>
                        <th className="px-5 py-3 font-medium">Recurso</th>
                        <th className="px-5 py-3 font-medium">Tipo</th>
                        <th className="px-5 py-3 font-medium">Duração</th>
                        <th className="px-5 py-3 font-medium">Transferência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedResources.slice(0, 12).map((resource, index) => (
                        <tr key={`${resource.name}-${index}`} className="border-t border-[var(--hairline)]">
                          <td className="max-w-[280px] truncate px-5 py-3">{resource.name}</td>
                          <td className="px-5 py-3 text-[var(--muted-foreground)]">
                            {resource.initiatorType}
                          </td>
                          <td className="px-5 py-3">{formatDuration(resource.duration)}</td>
                          <td className="px-5 py-3">{formatBytes(resource.transferSize)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {snapshot.performance.unsupportedApis.length > 0 && (
                <p className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4 text-sm text-[var(--muted-foreground)]">
                  Não disponível neste navegador:{" "}
                  {snapshot.performance.unsupportedApis.join(", ")}.
                </p>
              )}

              {snapshot.errors.length > 0 && (
                <section className="rounded-2xl border border-[var(--destructive)]/35 bg-[var(--destructive)]/8 p-5">
                  <h3 className="text-[var(--foreground)]">Erros sanitizados da sessão</h3>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--muted-foreground)]">
                    {snapshot.errors.map((error, index) => (
                      <li key={`${error.at}-${index}`}>
                        {error.kind} · {formatDuration(error.at)} · {error.message}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {activeTab === "journey" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="text-[var(--foreground)]">Tempo por seção</h3>
                <ol className="mt-4 space-y-3">
                  {Object.values(snapshot.sections)
                    .filter((section) => section.viewed)
                    .sort((a, b) => (a.firstSeenOrder ?? 99) - (b.firstSeenOrder ?? 99))
                    .map((section) => (
                      <li key={section.id} className="flex items-center justify-between gap-4 border-b border-[var(--hairline)] pb-3">
                        <span>#{section.id}</span>
                        <span className="text-[var(--muted-foreground)]">
                          {formatDuration(section.timeMs)} · {section.entries} entrada(s)
                        </span>
                      </li>
                    ))}
                </ol>
              </section>

              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="text-[var(--foreground)]">Eventos sanitizados</h3>
                <ol className="mt-4 max-h-[440px] space-y-3 overflow-y-auto">
                  {[...snapshot.events].reverse().slice(0, 80).map((event, index) => (
                    <li key={`${event.name}-${event.at}-${index}`} className="rounded-xl border border-[var(--border)] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <code className="text-[var(--ice-blue)] text-xs">{event.name}</code>
                        <span className="text-[var(--muted-foreground)] text-xs">
                          {formatDuration(event.at)}
                        </span>
                      </div>
                      {(event.source || event.destination || event.field) && (
                        <p className="mt-2 text-[var(--muted-foreground)] text-xs">
                          {[event.source, event.destination, event.field].filter(Boolean).join(" → ")}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          )}

          {activeTab === "heatmap" && <SessionHeatmap snapshot={snapshot} />}

          {activeTab === "bottlenecks" && (
            <div>
              <div className="mb-5 flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-[var(--ice-blue)]" />
                <p className="text-[var(--muted-foreground)] text-sm">
                  Limites documentados no código. Alertas usam somente evidência disponível.
                </p>
              </div>
              <StatusList items={bottlenecks} />
            </div>
          )}

          {activeTab === "diagnostics" && (
            <div>
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[var(--muted-foreground)] text-sm">
                  Verificações reais do DOM atual. Contraste não é estimado automaticamente.
                </p>
                <button
                  type="button"
                  onClick={executeDiagnostics}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--royal)] px-4 text-sm text-white transition-[background-color,transform] hover:-translate-y-[1px] hover:bg-[var(--ice-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60"
                >
                  <Play className="h-4 w-4" /> Executar diagnóstico
                </button>
              </div>
              {diagnostics.length > 0 ? (
                <StatusList items={diagnostics} />
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border-strong)] p-8 text-center text-[var(--muted-foreground)]">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--ice-blue)]" />
                  <p className="mt-3">O diagnóstico é executado somente sob demanda.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="flex shrink-0 flex-col gap-1 border-t border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <span style={{ fontSize: "0.7rem" }}>Sessão local · sem cookies · sem request de analytics</span>
          <span style={{ fontSize: "0.7rem" }}>
            Agregação entre visitantes depende de backend aprovado.
          </span>
        </footer>
      </div>
    </dialog>
  );
}

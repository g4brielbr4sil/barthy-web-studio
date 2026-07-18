import type {
  Bottleneck,
  DiagnosticResult,
  DiagnosticStatus,
  SessionSnapshot,
} from "./types";

const LCP_ATTENTION = 2_500;
const LCP_CRITICAL = 4_000;
const CLS_ATTENTION = 0.1;
const CLS_CRITICAL = 0.25;
const RESOURCE_SLOW = 700;
const RESOURCE_LARGE = 500_000;

function result(
  id: string,
  label: string,
  status: DiagnosticStatus,
  detail: string,
): DiagnosticResult {
  return { id, label, status, detail };
}

function accessibleName(element: Element): string {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.textContent?.trim() ||
    ""
  );
}

export function runRuntimeDiagnostics(): DiagnosticResult[] {
  const results: DiagnosticResult[] = [];
  const h1Count = document.querySelectorAll("h1").length;
  results.push(
    result(
      "h1",
      "H1 único",
      h1Count === 1 ? "good" : "critical",
      h1Count === 1 ? "Exatamente um H1 encontrado." : `${h1Count} elementos H1 encontrados.`,
    ),
  );

  const ids = [...document.querySelectorAll<HTMLElement>("[id]")].map((node) => node.id);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  results.push(
    result(
      "duplicate-ids",
      "IDs duplicados",
      duplicateIds.length === 0 ? "good" : "critical",
      duplicateIds.length === 0
        ? "Nenhum ID duplicado."
        : `IDs duplicados: ${duplicateIds.slice(0, 6).join(", ")}.`,
    ),
  );

  const links = [...document.querySelectorAll<HTMLAnchorElement>("a")];
  const emptyLinks = links.filter((link) => !link.getAttribute("href")?.trim());
  results.push(
    result(
      "empty-links",
      "Links vazios",
      emptyLinks.length === 0 ? "good" : "attention",
      emptyLinks.length === 0 ? "Nenhum link vazio." : `${emptyLinks.length} link(s) sem destino.`,
    ),
  );

  const brokenAnchors = links.filter((link) => {
    const href = link.getAttribute("href");
    if (!href?.startsWith("#") || href === "#") return false;
    return !document.getElementById(href.slice(1));
  });
  results.push(
    result(
      "anchors",
      "Âncoras internas",
      brokenAnchors.length === 0 ? "good" : "critical",
      brokenAnchors.length === 0
        ? "Todas as âncoras internas possuem destino."
        : `${brokenAnchors.length} âncora(s) sem destino.`,
    ),
  );

  const fields = [...document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    "input:not([type='hidden']), select, textarea",
  )];
  const unlabeledFields = fields.filter(
    (field) => field.labels?.length === 0 && !field.getAttribute("aria-label"),
  );
  results.push(
    result(
      "labels",
      "Labels de formulário",
      unlabeledFields.length === 0 ? "good" : "critical",
      unlabeledFields.length === 0
        ? "Todos os campos possuem label."
        : `${unlabeledFields.length} campo(s) sem label.`,
    ),
  );

  const controls = [...document.querySelectorAll("button, a[href], summary")];
  const unnamedControls = controls.filter((control) => !accessibleName(control));
  results.push(
    result(
      "accessible-names",
      "Nomes acessíveis",
      unnamedControls.length === 0 ? "good" : "critical",
      unnamedControls.length === 0
        ? "Controles verificados possuem nome acessível."
        : `${unnamedControls.length} controle(s) sem nome acessível.`,
    ),
  );

  const images = [...document.querySelectorAll<HTMLImageElement>("img")];
  const imagesWithoutAlt = images.filter((image) => !image.hasAttribute("alt"));
  results.push(
    result(
      "image-alt",
      "Texto alternativo",
      imagesWithoutAlt.length === 0 ? "good" : "critical",
      imagesWithoutAlt.length === 0
        ? "Imagens possuem atributo alt."
        : `${imagesWithoutAlt.length} imagem(ns) sem alt.`,
    ),
  );

  const hasOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
  results.push(
    result(
      "overflow",
      "Overflow horizontal",
      hasOverflow ? "critical" : "good",
      hasOverflow
        ? `Documento com ${document.documentElement.scrollWidth}px para viewport de ${window.innerWidth}px.`
        : "Nenhum overflow horizontal detectado.",
    ),
  );

  const visibleControls = controls.filter((control) => {
    const rect = control.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  const smallControls = visibleControls.filter((control) => {
    const rect = control.getBoundingClientRect();
    return rect.width < 44 || rect.height < 44;
  });
  results.push(
    result(
      "touch-targets",
      "Targets de toque",
      smallControls.length === 0 ? "good" : "attention",
      smallControls.length === 0
        ? "Controles visíveis atendem 44px."
        : `${smallControls.length} controle(s) visível(is) abaixo de 44px. Aviso contextual.`,
    ),
  );

  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  results.push(
    result(
      "canonical",
      "Canonical",
      canonical ? "good" : "critical",
      canonical ? "Canonical presente." : "Canonical ausente.",
    ),
  );

  const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content;
  results.push(
    result(
      "robots",
      "Robots",
      robots && !/noindex|nofollow/i.test(robots) ? "good" : "critical",
      robots
        ? `Diretiva encontrada: ${robots}.`
        : "Meta robots ausente.",
    ),
  );

  const title = document.title.trim();
  const description = document
    .querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.content.trim();
  results.push(
    result("title", "Title", title ? "good" : "critical", title ? "Title presente." : "Title vazio."),
    result(
      "description",
      "Description",
      description ? "good" : "critical",
      description ? "Description presente." : "Description ausente.",
    ),
  );

  const form = document.querySelector<HTMLFormElement>("#contato form");
  const successState = document.querySelector("#contato [data-form-success='true']");
  const requiredFields = form?.querySelectorAll("[required]").length ?? 0;
  results.push(
    result(
      "contact-form",
      "Formulário de contato",
      (form && requiredFields > 0) || successState ? "good" : "critical",
      form
        ? `Formulário presente com ${requiredFields} campo(s) obrigatório(s).`
        : successState
          ? "Envio concluído; estado de sucesso presente no lugar do formulário."
          : "Formulário não encontrado.",
    ),
  );

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  results.push(
    result(
      "reduced-motion",
      "Preferência de movimento",
      "good",
      reducedMotion ? "Movimento reduzido ativo nesta sessão." : "Movimento padrão ativo nesta sessão.",
    ),
  );

  return results;
}

export function identifyBottlenecks(
  snapshot: SessionSnapshot,
  diagnostics: DiagnosticResult[],
): Bottleneck[] {
  const bottlenecks: Bottleneck[] = [];
  const { performance: metrics } = snapshot;

  if (metrics.lcp === null) {
    bottlenecks.push({
      id: "lcp-unavailable",
      label: "LCP",
      status: "unavailable",
      detail: "Não disponível neste navegador.",
    });
  } else if (metrics.lcp > LCP_ATTENTION) {
    bottlenecks.push({
      id: "lcp",
      label: "LCP acima do objetivo",
      status: metrics.lcp > LCP_CRITICAL ? "critical" : "attention",
      detail: `${Math.round(metrics.lcp)}ms observados. Limites: atenção acima de 2500ms, crítico acima de 4000ms.`,
    });
  }

  if (metrics.cls === null) {
    bottlenecks.push({
      id: "cls-unavailable",
      label: "CLS",
      status: "unavailable",
      detail: "Não disponível neste navegador.",
    });
  } else if (metrics.cls > CLS_ATTENTION) {
    bottlenecks.push({
      id: "cls",
      label: "CLS acima do objetivo",
      status: metrics.cls > CLS_CRITICAL ? "critical" : "attention",
      detail: `${metrics.cls.toFixed(3)} observado. Limites: atenção acima de 0,10, crítico acima de 0,25.`,
    });
  }

  if (metrics.longTasks.length > 0) {
    const longest = Math.max(...metrics.longTasks.map((task) => task.duration));
    bottlenecks.push({
      id: "long-tasks",
      label: "Long tasks",
      status: longest > 200 ? "critical" : "attention",
      detail: `${metrics.longTasks.length} tarefa(s) acima de 50ms; maior com ${Math.round(longest)}ms.`,
    });
  }

  const slowResources = metrics.resources.filter((resource) => resource.duration > RESOURCE_SLOW);
  if (slowResources.length > 0) {
    bottlenecks.push({
      id: "slow-resources",
      label: "Recursos lentos",
      status: "attention",
      detail: `${slowResources.length} recurso(s) acima de ${RESOURCE_SLOW}ms.`,
    });
  }

  const largeResources = metrics.resources.filter(
    (resource) => resource.transferSize !== null && resource.transferSize > RESOURCE_LARGE,
  );
  if (largeResources.length > 0) {
    bottlenecks.push({
      id: "large-resources",
      label: "Recursos grandes",
      status: "attention",
      detail: `${largeResources.length} recurso(s) transferidos acima de 500kB.`,
    });
  }

  if (metrics.layoutShiftCount > 0 && (metrics.cls ?? 0) > 0) {
    bottlenecks.push({
      id: "layout-shifts",
      label: "Layout shifts",
      status: (metrics.cls ?? 0) > CLS_CRITICAL ? "critical" : "attention",
      detail: `${metrics.layoutShiftCount} mudança(s) de layout sem entrada recente.`,
    });
  }

  if (snapshot.errors.length > 0) {
    bottlenecks.push({
      id: "runtime-errors",
      label: "Erros observados",
      status: "critical",
      detail: `${snapshot.errors.length} falha(s) sanitizada(s) nesta sessão.`,
    });
  }

  const overflow = diagnostics.find((item) => item.id === "overflow" && item.status !== "good");
  if (overflow) {
    bottlenecks.push({
      id: "overflow",
      label: overflow.label,
      status: overflow.status === "critical" ? "critical" : "attention",
      detail: overflow.detail,
    });
  }

  return bottlenecks;
}

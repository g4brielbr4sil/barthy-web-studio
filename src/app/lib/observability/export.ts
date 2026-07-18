import { aggregateClickPoints, HEATMAP_COLUMNS, HEATMAP_ROWS } from "./heatmap";
import type {
  Bottleneck,
  DiagnosticResult,
  SanitizedSessionReport,
  SessionSnapshot,
} from "./types";

const REPORT_STORAGE_KEY = "barthy-observability-report-v1";

export interface ObservabilityTransport {
  send(report: SanitizedSessionReport): Promise<void> | void;
}

function browserFamily(): string {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return "Chromium";
  if (/Safari\//.test(ua)) return "Safari";
  return "Navegador não identificado";
}

export function buildSanitizedReport(
  snapshot: SessionSnapshot,
  diagnostics: DiagnosticResult[],
  bottlenecks: Bottleneck[],
): SanitizedSessionReport {
  const { clickPoints, ...sanitizedSession } = snapshot;

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    page: window.location.pathname || "/",
    browser: browserFamily(),
    session: {
      ...sanitizedSession,
      clickPointCount: clickPoints.length,
    },
    heatmap: {
      columns: HEATMAP_COLUMNS,
      rows: HEATMAP_ROWS,
      cells: aggregateClickPoints(clickPoints),
    },
    diagnostics,
    bottlenecks,
    aggregationNote:
      "Agregação entre visitantes depende de backend ou serviço de analytics aprovado.",
  };
}

export class LocalSessionTransport implements ObservabilityTransport {
  send(report: SanitizedSessionReport): void {
    sessionStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(report));
  }
}

export class DownloadTransport implements ObservabilityTransport {
  send(report: SanitizedSessionReport): void {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = `${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}`;
    const fileName = `barthy-session-report-${date}-${time}.json`;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export type Availability = "available" | "unavailable";
export type DiagnosticStatus = "good" | "attention" | "critical" | "unavailable";

export interface NavigationMetrics {
  ttfb: number | null;
  domContentLoaded: number | null;
  load: number | null;
  total: number | null;
  response: number | null;
  domProcessing: number | null;
}

export interface LongTaskMetric {
  duration: number;
  startTime: number;
}

export interface ResourceMetric {
  name: string;
  initiatorType: string;
  startTime: number;
  duration: number;
  transferSize: number | null;
}

export interface PerformanceMetrics {
  navigation: NavigationMetrics;
  lcp: number | null;
  cls: number | null;
  observedInp: number | null;
  layoutShiftCount: number;
  longTasks: LongTaskMetric[];
  resources: ResourceMetric[];
  unsupportedApis: string[];
}

export interface SectionMetric {
  id: string;
  viewed: boolean;
  entries: number;
  timeMs: number;
  maxRatio: number;
  firstSeenOrder: number | null;
}

export type SessionEventName =
  | "cta_click"
  | "disclosure_open"
  | "faq_open"
  | "form_started"
  | "form_error"
  | "form_submit_attempt"
  | "form_submit_success"
  | "form_submit_failure"
  | "theme_change"
  | "dev_mode_open";

export interface SessionEvent {
  name: SessionEventName;
  at: number;
  section?: string;
  source?: string;
  destination?: string;
  field?: string;
}

export type HeatmapTarget =
  | "button"
  | "link"
  | "card"
  | "disclosure"
  | "faq"
  | "form"
  | "navigation"
  | "other";

export interface ClickPoint {
  x: number;
  y: number;
  viewportWidth: number;
  pageHeight: number;
  section: string;
  at: number;
  targetType: HeatmapTarget;
}

export interface RuntimeError {
  kind: "error" | "promise" | "resource";
  message: string;
  at: number;
}

export interface ViewportSnapshot {
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  pointer: "fine" | "coarse" | "unknown";
  reducedMotion: boolean;
}

export interface SessionSnapshot {
  schemaVersion: 1;
  startedAt: string;
  durationMs: number;
  visibleMs: number;
  hiddenMs: number;
  maxScrollDepth: number;
  deepestSection: string | null;
  sections: Record<string, SectionMetric>;
  events: SessionEvent[];
  clickPoints: ClickPoint[];
  heatmapLimitReached: boolean;
  theme: "dark" | "light";
  themeChanges: number;
  viewport: ViewportSnapshot;
  devModeOpened: boolean;
  performance: PerformanceMetrics;
  errors: RuntimeError[];
}

export interface DiagnosticResult {
  id: string;
  label: string;
  status: DiagnosticStatus;
  detail: string;
}

export interface Bottleneck {
  id: string;
  label: string;
  status: Exclude<DiagnosticStatus, "good">;
  detail: string;
}

export interface HeatmapCell {
  x: number;
  y: number;
  count: number;
  intensity: number;
}

export interface SanitizedSessionReport {
  schemaVersion: 1;
  generatedAt: string;
  page: string;
  browser: string;
  privacyNote: string;
  limitations: string[];
  session: Omit<SessionSnapshot, "clickPoints" | "events"> & {
    clickPointCount: number;
    eventCount: number;
    eventCounts: Partial<Record<SessionEventName, number>>;
  };
  heatmap: {
    columns: number;
    rows: number;
    cells: HeatmapCell[];
  };
  diagnostics: DiagnosticResult[];
  bottlenecks: Bottleneck[];
  aggregationNote: string;
}

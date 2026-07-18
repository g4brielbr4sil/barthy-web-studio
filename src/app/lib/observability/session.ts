import type {
  ClickPoint,
  HeatmapTarget,
  PerformanceMetrics,
  ResourceMetric,
  RuntimeError,
  SectionMetric,
  SessionEvent,
  SessionEventName,
  SessionSnapshot,
} from "./types";

const STORAGE_KEY = "barthy-observability-v1";
const TRACKING_EVENT = "barthy:tracking";
const CLICK_POINT_LIMIT = 400;
const SECTION_THRESHOLD = 0.35;
const MAX_EVENTS = 250;
const MAX_ERRORS = 30;
const MAX_RESOURCES = 80;
const MAX_LONG_TASKS = 30;
const MAX_STORAGE_CHARS = 180_000;
const MAX_SESSION_AGE_MS = 4 * 60 * 60 * 1_000;

type SnapshotListener = () => void;

function createNavigationMetrics(): PerformanceMetrics["navigation"] {
  return {
    ttfb: null,
    domContentLoaded: null,
    load: null,
    total: null,
    response: null,
    domProcessing: null,
  };
}

function createPerformanceMetrics(): PerformanceMetrics {
  return {
    navigation: createNavigationMetrics(),
    lcp: null,
    cls: null,
    observedInp: null,
    layoutShiftCount: 0,
    longTasks: [],
    resources: [],
    unsupportedApis: [],
  };
}

function mediaMatches(query: string): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(query).matches;
}

function currentTheme(): "dark" | "light" {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function pointerType(): "fine" | "coarse" | "unknown" {
  if (mediaMatches("(pointer: fine)")) return "fine";
  if (mediaMatches("(pointer: coarse)")) return "coarse";
  return "unknown";
}

function createViewportSnapshot(): SessionSnapshot["viewport"] {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth >= window.innerHeight ? "landscape" : "portrait",
    pointer: pointerType(),
    reducedMotion: mediaMatches("(prefers-reduced-motion: reduce)"),
  };
}

function createSnapshot(): SessionSnapshot {
  return {
    schemaVersion: 1,
    startedAt: new Date().toISOString(),
    durationMs: 0,
    visibleMs: 0,
    hiddenMs: 0,
    maxScrollDepth: 0,
    deepestSection: null,
    sections: {},
    events: [],
    clickPoints: [],
    heatmapLimitReached: false,
    theme: currentTheme(),
    themeChanges: 0,
    viewport: createViewportSnapshot(),
    devModeOpened: false,
    performance: createPerformanceMetrics(),
    errors: [],
  };
}

let snapshot: SessionSnapshot | null = null;
let started = false;
let startEpoch = 0;
let visibilityStartedAt = 0;
let visibleBase = 0;
let hiddenBase = 0;
let activeSection: string | null = null;
let activeSectionStartedAt = 0;
let sectionOrder = 0;
let sectionRatios = new Map<string, number>();
let sectionDepth = new Map<string, number>();
let listeners = new Set<SnapshotListener>();
let cleanupCallbacks: Array<() => void> = [];
let persistTimer: number | null = null;
let scrollTimer: number | null = null;
let resizeTimer: number | null = null;
let performanceObservers: PerformanceObserver[] = [];

function ensureSnapshot(): SessionSnapshot {
  if (!snapshot) snapshot = createSnapshot();
  return snapshot;
}

function sanitizeText(value: unknown): string {
  const raw = typeof value === "string" ? value : "Falha observada";
  return raw
    .replace(/\b(?:bearer|token|api[_-]?key)\s*[:=]\s*\S+/gi, "[segredo]")
    .replace(/\b[A-Za-z]:\\(?:[^\\\s]+\\)*[^\\\s]*/g, "[caminho]")
    .replace(/file:\/\/\/?\S+/gi, "[caminho]")
    .replace(/https?:\/\/\S+/gi, "[url]")
    .replace(/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/gi, "[email]")
    .replace(/(?:\+?55\s*)?(?:\(?\d{2}\)?[\s.-]*)?\d{4,5}[\s.-]*\d{4}/g, "[telefone]")
    .replace(/[?#].*$/g, "")
    .slice(0, 160);
}

function sanitizeResourceName(value: string): string {
  try {
    const url = new URL(value, window.location.origin);
    return url.pathname.split("/").pop() || url.pathname || "/";
  } catch {
    return value.split(/[?#]/)[0].split("/").pop()?.slice(0, 100) || "resource";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isNullableMetric(value: unknown): value is number | null {
  return value === null || isFiniteNonNegative(value);
}

function isOptionalShortString(value: unknown): value is string | undefined {
  return value === undefined || (typeof value === "string" && value.length <= 64);
}

const sessionEventNames = new Set<string>([
  "cta_click",
  "disclosure_open",
  "faq_open",
  "form_started",
  "form_error",
  "form_submit_attempt",
  "form_submit_success",
  "form_submit_failure",
  "theme_change",
  "dev_mode_open",
]);

const heatmapTargets = new Set<string>([
  "button",
  "link",
  "card",
  "disclosure",
  "faq",
  "form",
  "navigation",
  "other",
]);

function isStoredEvent(value: unknown): value is SessionEvent {
  if (
    !isRecord(value) ||
    typeof value.name !== "string" ||
    !sessionEventNames.has(value.name)
  ) {
    return false;
  }
  return (
    isFiniteNonNegative(value.at) &&
    isOptionalShortString(value.section) &&
    isOptionalShortString(value.source) &&
    isOptionalShortString(value.destination) &&
    isOptionalShortString(value.field)
  );
}

function isStoredClickPoint(value: unknown): value is ClickPoint {
  return (
    isRecord(value) &&
    typeof value.x === "number" &&
    Number.isFinite(value.x) &&
    value.x >= 0 &&
    value.x <= 1 &&
    typeof value.y === "number" &&
    Number.isFinite(value.y) &&
    value.y >= 0 &&
    value.y <= 1 &&
    isFiniteNonNegative(value.viewportWidth) &&
    isFiniteNonNegative(value.pageHeight) &&
    typeof value.section === "string" &&
    value.section.length <= 64 &&
    isFiniteNonNegative(value.at) &&
    typeof value.targetType === "string" &&
    heatmapTargets.has(value.targetType)
  );
}

function isStoredError(value: unknown): value is RuntimeError {
  return (
    isRecord(value) &&
    (value.kind === "error" || value.kind === "promise" || value.kind === "resource") &&
    typeof value.message === "string" &&
    value.message.length <= 160 &&
    isFiniteNonNegative(value.at)
  );
}

function isStoredSection(value: unknown): value is SectionMetric {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length <= 64 &&
    typeof value.viewed === "boolean" &&
    isFiniteNonNegative(value.entries) &&
    isFiniteNonNegative(value.timeMs) &&
    isFiniteNonNegative(value.maxRatio) &&
    value.maxRatio <= 1 &&
    (value.firstSeenOrder === null || isFiniteNonNegative(value.firstSeenOrder))
  );
}

function isStoredResource(value: unknown): value is ResourceMetric {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    value.name.length <= 120 &&
    typeof value.initiatorType === "string" &&
    value.initiatorType.length <= 32 &&
    isFiniteNonNegative(value.startTime) &&
    isFiniteNonNegative(value.duration) &&
    (value.transferSize === null || isFiniteNonNegative(value.transferSize))
  );
}

function isStoredPerformance(value: unknown): value is PerformanceMetrics {
  if (!isRecord(value) || !isRecord(value.navigation)) return false;
  const navigation = value.navigation;
  return (
    isNullableMetric(navigation.ttfb) &&
    isNullableMetric(navigation.domContentLoaded) &&
    isNullableMetric(navigation.load) &&
    isNullableMetric(navigation.total) &&
    isNullableMetric(navigation.response) &&
    isNullableMetric(navigation.domProcessing) &&
    isNullableMetric(value.lcp) &&
    isNullableMetric(value.cls) &&
    isNullableMetric(value.observedInp) &&
    isFiniteNonNegative(value.layoutShiftCount) &&
    Array.isArray(value.longTasks) &&
    value.longTasks.length <= MAX_LONG_TASKS &&
    value.longTasks.every(
      (task) =>
        isRecord(task) &&
        isFiniteNonNegative(task.duration) &&
        isFiniteNonNegative(task.startTime),
    ) &&
    Array.isArray(value.resources) &&
    value.resources.length <= MAX_RESOURCES &&
    value.resources.every(isStoredResource) &&
    Array.isArray(value.unsupportedApis) &&
    value.unsupportedApis.length <= 32 &&
    value.unsupportedApis.every(
      (api) => typeof api === "string" && api.length <= 64,
    )
  );
}

function isStoredSnapshot(value: unknown): value is SessionSnapshot {
  if (
    !isRecord(value) ||
    value.schemaVersion !== 1 ||
    typeof value.startedAt !== "string" ||
    !isFiniteNonNegative(value.durationMs) ||
    !isFiniteNonNegative(value.visibleMs) ||
    !isFiniteNonNegative(value.hiddenMs) ||
    !isFiniteNonNegative(value.maxScrollDepth) ||
    value.maxScrollDepth > 100 ||
    !(
      value.deepestSection === null ||
      (typeof value.deepestSection === "string" && value.deepestSection.length <= 64)
    ) ||
    !isRecord(value.sections) ||
    Object.keys(value.sections).length > 64 ||
    !Object.entries(value.sections).every(
      ([id, metric]) =>
        /^[a-z0-9-]{1,64}$/i.test(id) &&
        isStoredSection(metric) &&
        metric.id === id,
    ) ||
    !Array.isArray(value.events) ||
    value.events.length > MAX_EVENTS ||
    !value.events.every(isStoredEvent) ||
    !Array.isArray(value.clickPoints) ||
    value.clickPoints.length > CLICK_POINT_LIMIT ||
    !value.clickPoints.every(isStoredClickPoint) ||
    typeof value.heatmapLimitReached !== "boolean" ||
    (value.theme !== "dark" && value.theme !== "light") ||
    !isFiniteNonNegative(value.themeChanges) ||
    typeof value.devModeOpened !== "boolean" ||
    !isStoredPerformance(value.performance) ||
    !Array.isArray(value.errors) ||
    value.errors.length > MAX_ERRORS ||
    !value.errors.every(isStoredError) ||
    !isRecord(value.viewport)
  ) {
    return false;
  }

  const viewport = value.viewport;
  return (
    isFiniteNonNegative(viewport.width) &&
    isFiniteNonNegative(viewport.height) &&
    (viewport.orientation === "portrait" || viewport.orientation === "landscape") &&
    (viewport.pointer === "fine" ||
      viewport.pointer === "coarse" ||
      viewport.pointer === "unknown") &&
    typeof viewport.reducedMotion === "boolean"
  );
}

function removeStoredSnapshot(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage pode estar bloqueado; a sessão em memória segue normalmente.
  }
}

function readStoredSnapshot(): SessionSnapshot | null {
  try {
    const serialized = sessionStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    if (serialized.length > MAX_STORAGE_CHARS) {
      removeStoredSnapshot();
      return null;
    }

    const parsed: unknown = JSON.parse(serialized);
    if (!isStoredSnapshot(parsed)) {
      removeStoredSnapshot();
      return null;
    }

    const startedAt = Date.parse(parsed.startedAt);
    const age = Date.now() - startedAt;
    if (!Number.isFinite(startedAt) || age < 0 || age > MAX_SESSION_AGE_MS) {
      removeStoredSnapshot();
      return null;
    }

    return parsed;
  } catch {
    removeStoredSnapshot();
    return null;
  }
}

function cloneSnapshot(): void {
  const current = ensureSnapshot();
  const now = Date.now();
  current.durationMs = Math.max(0, now - startEpoch);
  if (document.visibilityState === "visible") {
    current.visibleMs = visibleBase + Math.max(0, now - visibilityStartedAt);
    current.hiddenMs = hiddenBase;
  } else {
    current.hiddenMs = hiddenBase + Math.max(0, now - visibilityStartedAt);
    current.visibleMs = visibleBase;
  }

  snapshot = {
    ...current,
    viewport: { ...current.viewport },
    performance: {
      ...current.performance,
      navigation: { ...current.performance.navigation },
      longTasks: [...current.performance.longTasks],
      resources: [...current.performance.resources],
      unsupportedApis: [...current.performance.unsupportedApis],
    },
    sections: Object.fromEntries(
      Object.entries(current.sections).map(([id, metric]) => [id, { ...metric }]),
    ),
    events: [...current.events],
    clickPoints: [...current.clickPoints],
    errors: [...current.errors],
  };

  listeners.forEach((listener) => listener());
  schedulePersist();
}

function schedulePersist(): void {
  if (persistTimer !== null) return;
  persistTimer = window.setTimeout(() => {
    persistTimer = null;
    persistSnapshot();
  }, 5_000);
}

function persistSnapshot(): void {
  try {
    const current = ensureSnapshot();
    let serialized = JSON.stringify(current);

    if (serialized.length > MAX_STORAGE_CHARS) {
      serialized = JSON.stringify({
        ...current,
        events: current.events.slice(-Math.floor(MAX_EVENTS / 2)),
        clickPoints: current.clickPoints.slice(-Math.floor(CLICK_POINT_LIMIT / 2)),
        performance: {
          ...current.performance,
          longTasks: current.performance.longTasks.slice(-Math.floor(MAX_LONG_TASKS / 2)),
          resources: current.performance.resources.slice(-Math.floor(MAX_RESOURCES / 2)),
        },
      } satisfies SessionSnapshot);
    }

    if (serialized.length <= MAX_STORAGE_CHARS) {
      sessionStorage.setItem(STORAGE_KEY, serialized);
    }
  } catch {
    // A sessão continua em memória quando o storage estiver indisponível.
  }
}

function handlePageHide(): void {
  finishActiveSection();
  cloneSnapshot();
  if (persistTimer !== null) {
    window.clearTimeout(persistTimer);
    persistTimer = null;
  }
  persistSnapshot();
}

function recordEvent(event: Omit<SessionEvent, "at">): void {
  const current = ensureSnapshot();
  current.events.push({
    ...event,
    at: Math.max(0, Date.now() - startEpoch),
  });
  if (current.events.length > MAX_EVENTS) current.events.splice(0, current.events.length - MAX_EVENTS);
  cloneSnapshot();
}

function recordError(kind: RuntimeError["kind"], rawMessage: unknown): void {
  const current = ensureSnapshot();
  current.errors.push({
    kind,
    message: sanitizeText(rawMessage),
    at: Math.max(0, Date.now() - startEpoch),
  });
  if (current.errors.length > MAX_ERRORS) current.errors.shift();
  cloneSnapshot();
}

function fieldName(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const allowed = ["nome", "whatsapp", "email", "cidadeUf", "tipoServico", "mensagem"];
  return allowed.includes(value) ? value : undefined;
}

function trackingDimension(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return /^[a-z0-9-]{1,48}$/i.test(value) ? value : undefined;
}

function handleTracking(event: Event): void {
  if (!(event instanceof CustomEvent) || !isRecord(event.detail)) return;
  const name = event.detail.name;
  const payload = isRecord(event.detail.payload) ? event.detail.payload : {};
  let sessionEvent: Omit<SessionEvent, "at"> | null = null;

  if (name === "cta_click") {
    sessionEvent = {
      name: "cta_click",
      source: trackingDimension(payload.source),
      destination: trackingDimension(payload.destination),
    };
  } else if (name === "toggle_experience_details" || name === "toggle_disclosure") {
    sessionEvent = {
      name: "disclosure_open",
      source: trackingDimension(payload.source) ?? "experience",
    };
  } else if (name === "toggle_faq") {
    sessionEvent = {
      name: "faq_open",
      source: typeof payload.index === "number" ? `faq-${payload.index + 1}` : "faq",
    };
  } else if (name === "form_started") {
    sessionEvent = { name: "form_started", section: "contato" };
  } else if (name === "form_error") {
    sessionEvent = { name: "form_error", section: "contato", field: fieldName(payload.field) };
  } else if (name === "submit_quote_form") {
    sessionEvent = { name: "form_submit_attempt", section: "contato" };
  } else if (name === "submit_quote_success") {
    sessionEvent = { name: "form_submit_success", section: "contato" };
  } else if (name === "submit_quote_error") {
    sessionEvent = { name: "form_submit_failure", section: "contato" };
  } else if (name === "theme_change") {
    const current = ensureSnapshot();
    current.theme = currentTheme();
    current.themeChanges += 1;
    sessionEvent = { name: "theme_change", source: current.theme };
  } else if (name === "dev_mode_open") {
    ensureSnapshot().devModeOpened = true;
    sessionEvent = { name: "dev_mode_open" };
  }

  if (sessionEvent) recordEvent(sessionEvent);
}

function sectionIdFromTarget(target: Element): string {
  const region = target.closest<HTMLElement>("section[id], header, footer");
  if (!region) return "page";
  if (region.id) return region.id;
  return region.tagName.toLowerCase();
}

function targetType(target: Element): HeatmapTarget {
  if (target.closest("#faq")) return "faq";
  if (target.closest("nav")) return "navigation";
  if (target.closest("summary,[aria-expanded='true'],[aria-expanded='false']")) return "disclosure";
  if (target.closest("form")) return "form";
  if (target.closest("button")) return "button";
  if (target.closest("a")) return "link";
  if (target.closest("article,[data-heatmap-type='card']")) return "card";
  return "other";
}

function handleClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest(".dev-mode-dialog")) return;

  const current = ensureSnapshot();
  if (current.clickPoints.length >= CLICK_POINT_LIMIT) {
    if (!current.heatmapLimitReached) {
      current.heatmapLimitReached = true;
      cloneSnapshot();
    }
    return;
  }

  const pageHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
  const point: ClickPoint = {
    x: Math.min(1, Math.max(0, event.clientX / Math.max(1, window.innerWidth))),
    y: Math.min(1, Math.max(0, (event.clientY + window.scrollY) / pageHeight)),
    viewportWidth: window.innerWidth,
    pageHeight,
    section: sectionIdFromTarget(target),
    at: Math.max(0, Date.now() - startEpoch),
    targetType: targetType(target),
  };

  current.clickPoints.push(point);
  cloneSnapshot();
}

function updateScrollDepth(): void {
  scrollTimer = null;
  const current = ensureSnapshot();
  const scrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const depth = scrollable === 0 ? 100 : Math.min(100, (window.scrollY / scrollable) * 100);
  if (depth <= current.maxScrollDepth) return;
  current.maxScrollDepth = Math.round(depth * 10) / 10;
  cloneSnapshot();
}

function handleScroll(): void {
  if (scrollTimer !== null) return;
  scrollTimer = window.setTimeout(updateScrollDepth, 160);
}

function markUnsupported(api: string): void {
  const unsupported = ensureSnapshot().performance.unsupportedApis;
  if (!unsupported.includes(api)) unsupported.push(api);
}

function finishActiveSection(now = performance.now()): void {
  if (!activeSection || !activeSectionStartedAt) return;
  const metric = ensureSnapshot().sections[activeSection];
  if (metric) metric.timeMs += Math.max(0, now - activeSectionStartedAt);
  activeSectionStartedAt = 0;
}

function selectActiveSection(): void {
  if (document.visibilityState !== "visible") {
    finishActiveSection();
    activeSection = null;
    return;
  }

  const candidate = [...sectionRatios.entries()]
    .filter(([, ratio]) => ratio >= SECTION_THRESHOLD)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  if (candidate === activeSection) return;

  finishActiveSection();
  activeSection = candidate;
  if (candidate) {
    activeSectionStartedAt = performance.now();
    const metric = ensureSnapshot().sections[candidate];
    if (metric) metric.entries += 1;
  }
}

function initializeSections(): void {
  const current = ensureSnapshot();
  const nodes = [...document.querySelectorAll<HTMLElement>("main section[id]")];
  const restoredSections = current.sections;
  const activeSections: Record<string, SectionMetric> = {};

  for (const [index, node] of nodes.entries()) {
    sectionDepth.set(node.id, index);
    activeSections[node.id] = restoredSections[node.id] ?? {
        id: node.id,
        viewed: false,
        entries: 0,
        timeMs: 0,
        maxRatio: 0,
        firstSeenOrder: null,
      };
  }
  current.sections = activeSections;
  sectionOrder = Math.max(
    0,
    ...Object.values(activeSections).map((metric) => metric.firstSeenOrder ?? 0),
  );
  if (current.deepestSection && !(current.deepestSection in activeSections)) {
    current.deepestSection = null;
  }

  if (!("IntersectionObserver" in window)) {
    markUnsupported("IntersectionObserver");
    return;
  }

  let observer: IntersectionObserver;
  try {
    observer = new IntersectionObserver(
      (entries) => {
        const currentSnapshot = ensureSnapshot();
        let changed = false;
        for (const entry of entries) {
          const node = entry.target;
          if (!(node instanceof HTMLElement)) continue;
          const ratio = entry.intersectionRatio;
          sectionRatios.set(node.id, ratio);
          const metric = currentSnapshot.sections[node.id];
          if (!metric) continue;

          metric.maxRatio = Math.max(metric.maxRatio, ratio);
          if (ratio >= SECTION_THRESHOLD && !metric.viewed) {
            metric.viewed = true;
            metric.firstSeenOrder = ++sectionOrder;
            const currentDeepest = currentSnapshot.deepestSection;
            if (
              !currentDeepest ||
              (sectionDepth.get(node.id) ?? 0) >
                (sectionDepth.get(currentDeepest) ?? -1)
            ) {
              currentSnapshot.deepestSection = node.id;
            }
            changed = true;
          }
        }
        selectActiveSection();
        if (changed) cloneSnapshot();
      },
      { threshold: [0, SECTION_THRESHOLD, 0.5, 0.75, 1] },
    );
  } catch {
    markUnsupported("IntersectionObserver");
    return;
  }

  nodes.forEach((node) => observer.observe(node));
  cleanupCallbacks.push(() => observer.disconnect());
}

function updateViewport(): void {
  resizeTimer = null;
  ensureSnapshot().viewport = createViewportSnapshot();
  cloneSnapshot();
}

function handleResize(): void {
  if (resizeTimer !== null) window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(updateViewport, 280);
}

function handleVisibility(): void {
  const now = Date.now();
  if (document.visibilityState === "visible") {
    hiddenBase += Math.max(0, now - visibilityStartedAt);
    visibilityStartedAt = now;
    selectActiveSection();
  } else {
    visibleBase += Math.max(0, now - visibilityStartedAt);
    visibilityStartedAt = now;
    finishActiveSection();
    activeSection = null;
  }
  cloneSnapshot();
}

function navigationMetrics(): PerformanceMetrics["navigation"] {
  const navigation = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (!navigation) return createNavigationMetrics();

  return {
    ttfb: Math.max(0, navigation.responseStart - navigation.requestStart),
    domContentLoaded:
      navigation.domContentLoadedEventEnd > 0
        ? navigation.domContentLoadedEventEnd - navigation.startTime
        : null,
    load: navigation.loadEventEnd > 0 ? navigation.loadEventEnd - navigation.startTime : null,
    total: navigation.duration > 0 ? navigation.duration : null,
    response:
      navigation.responseEnd > 0
        ? Math.max(0, navigation.responseEnd - navigation.requestStart)
        : null,
    domProcessing:
      navigation.domComplete > 0
        ? Math.max(0, navigation.domComplete - navigation.responseEnd)
        : null,
  };
}

function resourceMetric(entry: PerformanceEntry): ResourceMetric {
  const initiatorType =
    "initiatorType" in entry && typeof entry.initiatorType === "string"
      ? entry.initiatorType
      : "other";
  const rawTransferSize =
    "transferSize" in entry && typeof entry.transferSize === "number"
      ? entry.transferSize
      : null;
  const transferSize =
    rawTransferSize !== null && rawTransferSize > 0
      ? rawTransferSize
      : null;
  return {
    name: sanitizeResourceName(entry.name),
    initiatorType,
    startTime: entry.startTime,
    duration: entry.duration,
    transferSize,
  };
}

function addResources(entries: PerformanceEntryList): void {
  const current = ensureSnapshot();
  const existing = new Set(
    current.performance.resources.map(
      (resource) => `${resource.name}:${Math.round(resource.duration * 10)}`,
    ),
  );
  for (const entry of entries) {
    const resource = resourceMetric(entry);
    const key = `${resource.name}:${Math.round(resource.duration * 10)}`;
    if (existing.has(key)) continue;
    current.performance.resources.push(resource);
    existing.add(key);
  }
  if (current.performance.resources.length > MAX_RESOURCES) {
    current.performance.resources.splice(0, current.performance.resources.length - MAX_RESOURCES);
  }
}

function observePerformance(): void {
  const current = ensureSnapshot();
  current.performance.navigation = navigationMetrics();
  addResources(performance.getEntriesByType("resource"));

  if (!("PerformanceObserver" in window)) {
    markUnsupported("PerformanceObserver");
    return;
  }

  const supported = PerformanceObserver.supportedEntryTypes ?? [];
  const observe = (type: string, handler: (entries: PerformanceEntryList) => void) => {
    if (supported.length > 0 && !supported.includes(type)) {
      markUnsupported(type);
      return false;
    }

    const createObserver = () =>
      new PerformanceObserver((list) => {
        handler(list.getEntries());
        cloneSnapshot();
      });
    let observer = createObserver();

    try {
      observer.observe({ type, buffered: true });
      performanceObservers.push(observer);
      return true;
    } catch {
      observer.disconnect();
      observer = createObserver();
      try {
        observer.observe({ type });
        performanceObservers.push(observer);
        return true;
      } catch {
        observer.disconnect();
        markUnsupported(type);
        return false;
      }
    }
  };

  observe("largest-contentful-paint", (entries) => {
    const last = entries.at(-1);
    if (last) ensureSnapshot().performance.lcp = last.startTime;
  });

  const observesLayoutShift = observe("layout-shift", (entries) => {
    const performanceMetrics = ensureSnapshot().performance;
    for (const entry of entries) {
      const hadRecentInput =
        "hadRecentInput" in entry && entry.hadRecentInput === true;
      const value =
        "value" in entry && typeof entry.value === "number" ? entry.value : 0;
      if (hadRecentInput) continue;
      performanceMetrics.cls = (performanceMetrics.cls ?? 0) + value;
      performanceMetrics.layoutShiftCount += 1;
    }
  });
  if (observesLayoutShift && current.performance.cls === null) {
    current.performance.cls = 0;
  }

  observe("event", (entries) => {
    const performanceMetrics = ensureSnapshot().performance;
    for (const entry of entries) {
      performanceMetrics.observedInp = Math.max(
        performanceMetrics.observedInp ?? 0,
        entry.duration,
      );
    }
  });

  observe("longtask", (entries) => {
    const performanceMetrics = ensureSnapshot().performance;
    for (const entry of entries) {
      if (entry.duration <= 50) continue;
      performanceMetrics.longTasks.push({
        duration: entry.duration,
        startTime: entry.startTime,
      });
    }
    if (performanceMetrics.longTasks.length > MAX_LONG_TASKS) {
      performanceMetrics.longTasks.splice(
        0,
        performanceMetrics.longTasks.length - MAX_LONG_TASKS,
      );
    }
  });

  observe("resource", addResources);
  cleanupCallbacks.push(() => {
    performanceObservers.forEach((observer) => observer.disconnect());
    performanceObservers = [];
  });
}

function handleWindowError(event: ErrorEvent): void {
  recordError("error", event.message);
}

function handleResourceError(event: Event): void {
  if (event instanceof ErrorEvent) return;
  const target = event.target;
  if (
    target instanceof HTMLImageElement ||
    target instanceof HTMLScriptElement ||
    target instanceof HTMLLinkElement
  ) {
    recordError("resource", `Falha ao carregar ${target.tagName.toLowerCase()}`);
  }
}

function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  const reason =
    event.reason instanceof Error ? event.reason.message : "Promise rejeitada sem tratamento";
  recordError("promise", reason);
}

export function startObservability(): () => void {
  if (started) return stopObservability;
  started = true;
  const storedSnapshot = readStoredSnapshot();
  const navigationEpoch = Math.round(performance.timeOrigin || Date.now());
  startEpoch = storedSnapshot ? Date.parse(storedSnapshot.startedAt) : navigationEpoch;
  const elapsedBeforeCollector = Math.max(0, Date.now() - navigationEpoch);
  visibleBase =
    storedSnapshot?.visibleMs ??
    (document.visibilityState === "visible" ? elapsedBeforeCollector : 0);
  hiddenBase =
    storedSnapshot?.hiddenMs ??
    (document.visibilityState === "visible" ? 0 : elapsedBeforeCollector);
  visibilityStartedAt = Date.now();
  activeSection = null;
  activeSectionStartedAt = 0;
  sectionOrder = 0;
  sectionRatios = new Map<string, number>();
  sectionDepth = new Map<string, number>();
  snapshot = storedSnapshot
    ? {
        ...storedSnapshot,
        sections: Object.fromEntries(
          Object.entries(storedSnapshot.sections).map(([id, metric]) => [id, { ...metric }]),
        ),
        events: [...storedSnapshot.events],
        clickPoints: [...storedSnapshot.clickPoints],
        errors: [...storedSnapshot.errors],
        theme: currentTheme(),
        viewport: createViewportSnapshot(),
        performance: createPerformanceMetrics(),
      }
    : createSnapshot();
  snapshot.startedAt = new Date(startEpoch).toISOString();

  initializeSections();
  observePerformance();
  updateScrollDepth();

  window.addEventListener(TRACKING_EVENT, handleTracking);
  window.addEventListener("click", handleClick, { passive: true, capture: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  window.addEventListener("orientationchange", handleResize, { passive: true });
  window.addEventListener("error", handleWindowError);
  window.addEventListener("error", handleResourceError, true);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("pagehide", handlePageHide);

  cleanupCallbacks.push(() => {
    window.removeEventListener(TRACKING_EVENT, handleTracking);
    window.removeEventListener("click", handleClick, true);
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", handleResize);
    window.removeEventListener("error", handleWindowError);
    window.removeEventListener("error", handleResourceError, true);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("pagehide", handlePageHide);
  });

  cloneSnapshot();
  return stopObservability;
}

export function stopObservability(): void {
  if (!started) return;
  finishActiveSection();
  cloneSnapshot();
  persistSnapshot();
  cleanupCallbacks.forEach((cleanup) => cleanup());
  cleanupCallbacks = [];
  if (persistTimer !== null) window.clearTimeout(persistTimer);
  if (scrollTimer !== null) window.clearTimeout(scrollTimer);
  if (resizeTimer !== null) window.clearTimeout(resizeTimer);
  persistTimer = null;
  scrollTimer = null;
  resizeTimer = null;
  started = false;
}

export function subscribeObservability(listener: SnapshotListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getObservabilitySnapshot(): SessionSnapshot {
  return ensureSnapshot();
}

export function refreshObservabilitySnapshot(): void {
  finishActiveSection();
  if (activeSection) activeSectionStartedAt = performance.now();
  cloneSnapshot();
}

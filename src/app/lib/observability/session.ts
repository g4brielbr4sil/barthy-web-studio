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

interface TrackingDetail {
  name?: string;
  payload?: Record<string, unknown>;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value?: number;
  hadRecentInput?: boolean;
}

interface ResourceTimingLike extends PerformanceEntry {
  initiatorType?: string;
  transferSize?: number;
}

type SnapshotListener = () => void;

const zeroNavigation = {
  ttfb: null,
  domContentLoaded: null,
  load: null,
  total: null,
  response: null,
  domProcessing: null,
};

const initialPerformance: PerformanceMetrics = {
  navigation: zeroNavigation,
  lcp: null,
  cls: null,
  observedInp: null,
  layoutShiftCount: 0,
  longTasks: [],
  resources: [],
  unsupportedApis: [],
};

function currentTheme(): "dark" | "light" {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function pointerType(): "fine" | "coarse" | "unknown" {
  if (window.matchMedia("(pointer: fine)").matches) return "fine";
  if (window.matchMedia("(pointer: coarse)").matches) return "coarse";
  return "unknown";
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
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerWidth >= window.innerHeight ? "landscape" : "portrait",
      pointer: pointerType(),
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    },
    devModeOpened: false,
    performance: initialPerformance,
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
    .replace(/https?:\/\/\S+/gi, "[url]")
    .replace(/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/gi, "[email]")
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
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ensureSnapshot()));
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
  const allowed = ["name", "nome", "whatsapp", "email", "cidadeUf", "tipoServico"];
  return allowed.includes(value) ? value : undefined;
}

function handleTracking(event: Event): void {
  const customEvent = event as CustomEvent<TrackingDetail>;
  const name = customEvent.detail?.name;
  const payload = customEvent.detail?.payload ?? {};
  let sessionEvent: Omit<SessionEvent, "at"> | null = null;

  if (name === "cta_click") {
    sessionEvent = {
      name: "cta_click",
      source: typeof payload.source === "string" ? payload.source.slice(0, 48) : undefined,
      destination:
        typeof payload.destination === "string" ? payload.destination.slice(0, 48) : undefined,
    };
  } else if (name === "toggle_experience_details" || name === "toggle_disclosure") {
    sessionEvent = {
      name: "disclosure_open",
      source: typeof payload.source === "string" ? payload.source.slice(0, 48) : "experience",
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
  for (const node of nodes) {
    current.sections[node.id] = {
      id: node.id,
      viewed: false,
      entries: 0,
      timeMs: 0,
      maxRatio: 0,
      firstSeenOrder: null,
    };
  }

  if (!("IntersectionObserver" in window)) {
    current.performance.unsupportedApis.push("IntersectionObserver");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const currentSnapshot = ensureSnapshot();
      let changed = false;
      for (const entry of entries) {
        const node = entry.target as HTMLElement;
        const ratio = entry.intersectionRatio;
        sectionRatios.set(node.id, ratio);
        const metric = currentSnapshot.sections[node.id];
        if (!metric) continue;

        metric.maxRatio = Math.max(metric.maxRatio, ratio);
        if (ratio >= SECTION_THRESHOLD && !metric.viewed) {
          metric.viewed = true;
          metric.firstSeenOrder = ++sectionOrder;
          current.deepestSection = node.id;
          changed = true;
        }
      }
      selectActiveSection();
      if (changed) cloneSnapshot();
    },
    { threshold: [0, SECTION_THRESHOLD, 0.5, 0.75, 1] },
  );

  nodes.forEach((node) => observer.observe(node));
  cleanupCallbacks.push(() => observer.disconnect());
}

function updateViewport(): void {
  resizeTimer = null;
  const current = ensureSnapshot();
  current.viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth >= window.innerHeight ? "landscape" : "portrait",
    pointer: pointerType(),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
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
  if (!navigation) return zeroNavigation;

  return {
    ttfb: navigation.responseStart - navigation.startTime,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
    load: navigation.loadEventEnd > 0 ? navigation.loadEventEnd - navigation.startTime : null,
    total: navigation.duration > 0 ? navigation.duration : null,
    response: navigation.responseEnd - navigation.requestStart,
    domProcessing: navigation.domComplete - navigation.responseEnd,
  };
}

function resourceMetric(entry: PerformanceEntry): ResourceMetric {
  const resource = entry as ResourceTimingLike;
  const transferSize =
    typeof resource.transferSize === "number" && resource.transferSize > 0
      ? resource.transferSize
      : null;
  return {
    name: sanitizeResourceName(entry.name),
    initiatorType: resource.initiatorType || "other",
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
    current.performance.unsupportedApis.push("PerformanceObserver");
    return;
  }

  const supported = PerformanceObserver.supportedEntryTypes ?? [];
  const observe = (type: string, handler: (entries: PerformanceEntryList) => void) => {
    if (!supported.includes(type)) {
      current.performance.unsupportedApis.push(type);
      return;
    }
    const observer = new PerformanceObserver((list) => {
      handler(list.getEntries());
      cloneSnapshot();
    });
    observer.observe({ type, buffered: true });
    performanceObservers.push(observer);
  };

  observe("largest-contentful-paint", (entries) => {
    const last = entries.at(-1);
    if (last) ensureSnapshot().performance.lcp = last.startTime;
  });

  observe("layout-shift", (entries) => {
    const performanceMetrics = ensureSnapshot().performance;
    for (const entry of entries as LayoutShiftEntry[]) {
      if (entry.hadRecentInput) continue;
      performanceMetrics.cls = (performanceMetrics.cls ?? 0) + (entry.value ?? 0);
      performanceMetrics.layoutShiftCount += 1;
    }
  });

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
    if (performanceMetrics.longTasks.length > 30) performanceMetrics.longTasks.shift();
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
  if (target instanceof HTMLImageElement || target instanceof HTMLScriptElement) {
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
  startEpoch = Math.round(performance.timeOrigin || Date.now());
  const elapsedBeforeCollector = Math.max(0, Date.now() - startEpoch);
  visibleBase = document.visibilityState === "visible" ? elapsedBeforeCollector : 0;
  hiddenBase = document.visibilityState === "visible" ? 0 : elapsedBeforeCollector;
  visibilityStartedAt = Date.now();
  activeSection = null;
  activeSectionStartedAt = 0;
  sectionOrder = 0;
  sectionRatios = new Map<string, number>();
  snapshot = createSnapshot();
  snapshot.startedAt = new Date(startEpoch).toISOString();

  initializeSections();
  observePerformance();
  updateScrollDepth();

  window.addEventListener(TRACKING_EVENT, handleTracking as EventListener);
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
    window.removeEventListener(TRACKING_EVENT, handleTracking as EventListener);
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

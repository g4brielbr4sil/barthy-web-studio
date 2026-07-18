import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { trackEvent } from "../lib/track";

const LazyDevModePanel = lazy(() => import("./DevModePanel"));

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export function DevModeLauncher() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    let stop: (() => void) | undefined;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const loadCollector = () => {
      void import("../lib/observability/session").then((module) => {
        if (cancelled) return;
        stop = module.startObservability();
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(loadCollector, { timeout: 1_200 });
    } else {
      timeoutId = globalThis.setTimeout(loadCollector, 120);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      stop?.();
    };
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    void import("../lib/observability/session").then((module) => {
      module.startObservability();
      trackEvent("dev_mode_open");
    });
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    let sequenceIndex = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const normalizedKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = KONAMI_SEQUENCE[sequenceIndex];

      if (normalizedKey === expected) {
        sequenceIndex += 1;
        if (sequenceIndex === KONAMI_SEQUENCE.length) {
          sequenceIndex = 0;
          openPanel();
        }
        return;
      }

      sequenceIndex = normalizedKey === KONAMI_SEQUENCE[0] ? 1 : 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openPanel]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Abrir modo desenvolvedor"
        onClick={openPanel}
        className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-mono text-[var(--muted-foreground)] transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-[1px] hover:border-[var(--ice-blue)]/55 hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60"
        title="Modo desenvolvedor"
      >
        &lt;/&gt;
      </button>

      {open && (
        <Suspense
          fallback={
            <div
              role="status"
              className="fixed bottom-5 right-5 z-[70] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] shadow-xl"
            >
              Carregando auditoria…
            </div>
          }
        >
          <LazyDevModePanel onRequestClose={closePanel} />
        </Suspense>
      )}
    </>
  );
}

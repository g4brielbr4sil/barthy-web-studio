export interface PlasmaProps {
  className?: string;
}

/**
 * Fundo ambiente da Hero com três camadas SVG animadas apenas por CSS.
 * Não usa canvas, WebGL, listeners, timers ou atualização de frames via JavaScript.
 */
export function PlasmaBackground({ className = "" }: PlasmaProps) {
  return (
    <div
      aria-hidden="true"
      className={`hero-background pointer-events-none absolute inset-0 ${className}`}
    >
      <svg
        className="hero-background__svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        role="presentation"
      >
        <defs>
          <linearGradient id="hero-wave-royal" x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0" stopColor="var(--royal)" stopOpacity="0" />
            <stop offset="0.42" stopColor="var(--royal)" stopOpacity="0.72" />
            <stop offset="1" stopColor="var(--ice-blue)" stopOpacity="0.26" />
          </linearGradient>
          <linearGradient id="hero-wave-ice" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="var(--ice-blue)" stopOpacity="0" />
            <stop offset="0.58" stopColor="var(--ice-blue)" stopOpacity="0.52" />
            <stop offset="1" stopColor="var(--soft-ice)" stopOpacity="0.12" />
          </linearGradient>
          <radialGradient id="hero-wave-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="var(--soft-ice)" stopOpacity="0.32" />
            <stop offset="0.46" stopColor="var(--ice-blue)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--royal)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="hero-wave hero-wave--primary">
          <path
            d="M-180 742C134 596 380 770 690 694C1008 616 1238 476 1774 568V966H-180Z"
            fill="url(#hero-wave-royal)"
          />
        </g>

        <g className="hero-wave hero-wave--secondary">
          <path
            d="M-218 618C124 452 412 662 736 594C1054 526 1284 368 1788 450V926H-218Z"
            fill="url(#hero-wave-ice)"
          />
        </g>

        <g className="hero-wave hero-wave--glow">
          <ellipse cx="1378" cy="650" rx="430" ry="268" fill="url(#hero-wave-glow)" />
        </g>
      </svg>
    </div>
  );
}

export default PlasmaBackground;

export interface PlasmaProps {
  className?: string;
}

/**
 * Camada visual estática da Hero. A aparência muda apenas por tokens CSS,
 * sem canvas, WebGL, listeners, timers ou animação contínua.
 */
export function PlasmaBackground({ className = "" }: PlasmaProps) {
  return (
    <div
      aria-hidden="true"
      className={`hero-background pointer-events-none absolute inset-0 ${className}`}
    />
  );
}

export default PlasmaBackground;

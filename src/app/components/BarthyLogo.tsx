export function BarthyMonogram({
  className = "",
  size = 36,
  filled = false,
}: {
  className?: string;
  size?: number;
  filled?: boolean;
}) {
  if (filled) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
      >
        <rect width="64" height="64" rx="16" fill="var(--terra)" />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={800}
          fontSize="22"
          letterSpacing="0.5"
          fill="#ffffff"
        >
          BWS
        </text>
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="16"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.25"
      />
      <text
        x="50%"
        y="56%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight={700}
        fontSize="20"
        letterSpacing="0.5"
        fill="currentColor"
      >
        BWS
      </text>
    </svg>
  );
}

export function BarthyLogo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const fontSize = size === "lg" ? "1.45rem" : size === "sm" ? "1rem" : "1.18rem";
  return (
    <span
      className={`inline-flex items-baseline text-[var(--foreground)] select-none ${className}`}
      style={{
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        fontSize,
        fontWeight: 700,
        letterSpacing: "-0.018em",
        lineHeight: 1,
      }}
      aria-label="Barthy Web Studio"
    >
      <span style={{ fontWeight: 700 }}>Barthy</span>
      <span
        className="ml-1.5 inline text-[var(--muted-foreground)]"
        style={{ fontWeight: 400, letterSpacing: "-0.01em" }}
      >
        Web Studio
      </span>
    </span>
  );
}

export default BarthyLogo;

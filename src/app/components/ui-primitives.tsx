import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { motion, useReducedMotion } from "motion/react";

type Variant = "primary" | "outline" | "ghost" | "soft";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] px-5 py-2.5 text-[0.95rem] transition-[background-color,color,border-color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60 focus-visible:ring-offset-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--terra)] text-white shadow-[0_10px_30px_-12px_rgba(205,118,93,0.6)] hover:bg-[var(--terra-soft)] hover:-translate-y-[1px]",
  outline:
    "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--ice-blue)]/70 hover:bg-[var(--muted)]",
  ghost: "text-[var(--foreground)] hover:bg-[var(--muted)]",
  soft:
    "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--accent)]/30",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignCls} mb-12 md:mb-16`}>
      {eyebrow && (
        <div
          className={`flex items-center gap-2 mb-4 text-[var(--text-accent)] ${align === "center" ? "justify-center" : ""}`}
          style={{ fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
        >
          <span className="inline-block w-4 h-px bg-[var(--terra)]" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance text-[var(--foreground)]">{title}</h2>
      {description && (
        <p className="mt-5 text-[var(--muted-foreground)] text-pretty" style={{ fontSize: "1.05rem" }}>
          {description}
        </p>
      )}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl glass p-6 md:p-7 transition-[border-color,transform] duration-200 hover:border-[var(--ice-blue)]/40 hover:-translate-y-[2px] ${className}`}
    >
      {children}
    </div>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-5 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={`relative scroll-mt-[64px] py-20 md:scroll-mt-[72px] md:py-28 ${className}`}
    >
      {children}
    </motion.section>
  );
}

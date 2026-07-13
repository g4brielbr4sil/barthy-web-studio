import { Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "../lib/theme";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      aria-pressed={isDark}
      title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="relative inline-flex h-11 w-[58px] shrink-0 items-center rounded-full border border-[var(--border-strong)] bg-[var(--muted)] p-[5px] transition-colors hover:border-[var(--ice-blue)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60"
    >
      <motion.span
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] shadow-sm"
        animate={{ x: isDark ? 0 : 14 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 34 }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-[var(--ice-blue)]" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-[var(--terra)]" />
        )}
      </motion.span>
    </button>
  );
}

export default ThemeToggle;

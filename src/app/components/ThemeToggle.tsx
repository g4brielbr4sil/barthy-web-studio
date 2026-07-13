import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../lib/theme";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      aria-pressed={isDark}
      title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="relative inline-flex shrink-0 items-center w-[52px] h-[28px] rounded-full border border-[var(--border-strong)] bg-[var(--muted)] p-[3px] transition-colors hover:border-[var(--ice-blue)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60"
    >
      <motion.span
        className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[var(--surface)] shadow-sm border border-[var(--border)]"
        animate={{ x: isDark ? 0 : 24 }}
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
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

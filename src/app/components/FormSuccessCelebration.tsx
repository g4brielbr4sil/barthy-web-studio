import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const particles = [
  { x: -42, y: -26, delay: 0.03 },
  { x: -20, y: -48, delay: 0.08 },
  { x: 10, y: -52, delay: 0.12 },
  { x: 38, y: -32, delay: 0.05 },
  { x: 48, y: 2, delay: 0.1 },
  { x: 30, y: 38, delay: 0.14 },
  { x: -4, y: 48, delay: 0.07 },
  { x: -38, y: 32, delay: 0.11 },
] as const;

export function FormSuccessCelebration() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="relative isolate flex h-20 w-20 items-center justify-center">
      {!reduceMotion &&
        particles.map((particle, index) => (
          <motion.span
            key={`${particle.x}-${particle.y}`}
            className={`absolute h-2 w-2 rounded-full ${
              index % 3 === 0 ? "bg-[var(--terra)]" : "bg-[var(--ice-blue)]"
            }`}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.7],
            }}
            transition={{
              duration: 0.72,
              delay: particle.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

      {!reduceMotion && (
        <motion.span
          className="absolute inset-1 rounded-full border border-[var(--ice-blue)]/45"
          initial={{ opacity: 0.8, scale: 0.55 }}
          animate={{ opacity: 0, scale: 1.55 }}
          transition={{ duration: 0.72, ease: "easeOut" }}
        />
      )}

      <motion.span
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--ice-blue)]/35 bg-[var(--ice-blue)]/15 text-[var(--ice-blue)] shadow-[0_16px_44px_-20px_rgba(74,127,167,0.9)]"
        initial={reduceMotion ? false : { scale: 0.62, opacity: 0, rotate: -10 }}
        animate={reduceMotion ? undefined : { scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 19 }}
      >
        <Check className="h-7 w-7" strokeWidth={2.4} />
      </motion.span>
    </div>
  );
}

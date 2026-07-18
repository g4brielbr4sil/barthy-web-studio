import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const terminalSequence = [
  {
    command: "hermes status",
    responses: ["CRM: disponível", "Rotina: sincronizada", "Financeiro: módulo ativo"],
  },
  {
    command: "hermes leads --today",
    responses: ["CRM: disponível"],
  },
  {
    command: "hermes next-actions",
    responses: ["Próximas ações: organizadas"],
  },
  {
    command: "hermes report --daily",
    responses: ["Relatório diário: pronto"],
  },
] as const;

const terminalVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

export function HermesTerminal() {
  const reduceMotion = useReducedMotion();
  const [sequenceRunning, setSequenceRunning] = useState(!reduceMotion);

  return (
    <section
      aria-labelledby="hermes-terminal-title"
      className="hermes-terminal overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[#0A1931] text-[#F6FAFD]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[var(--terra)]" />
          <span className="h-2 w-2 rounded-full bg-[#4A7FA7]" />
          <span className="h-2 w-2 rounded-full bg-[#B3CFE5]" />
        </div>
        <p
          id="hermes-terminal-title"
          className="text-white/60"
          style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
        >
          Simulação visual
        </p>
      </div>

      <motion.div
        aria-hidden="true"
        className="space-y-4 px-4 py-5 font-mono sm:px-5"
        variants={reduceMotion ? undefined : terminalVariants}
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.45 }}
        onAnimationComplete={() => setSequenceRunning(false)}
      >
        {terminalSequence.map((entry) => (
          <motion.div key={entry.command} variants={reduceMotion ? undefined : lineVariants}>
            <p className="break-words text-[#B3CFE5]" style={{ fontSize: "0.78rem" }}>
              <span className="text-[var(--terra)]">$</span> {entry.command}
            </p>
            {entry.responses.map((response) => (
              <p key={response} className="mt-1 text-white/78" style={{ fontSize: "0.76rem" }}>
                <span className="mr-2 text-[#4A7FA7]">✓</span>
                {response}
              </p>
            ))}
          </motion.div>
        ))}
        <span
          className={`inline-block h-4 w-1.5 bg-[#B3CFE5] align-middle ${
            sequenceRunning && !reduceMotion ? "terminal-cursor" : ""
          }`}
        />
      </motion.div>

      <div className="sr-only">
        Simulação visual do Hermes. Comando hermes status: CRM disponível, rotina sincronizada e
        financeiro com módulo ativo. Comando hermes leads today: CRM disponível. Comando hermes
        next-actions: próximas ações organizadas. Comando hermes report daily: relatório diário
        pronto.
      </div>
    </section>
  );
}

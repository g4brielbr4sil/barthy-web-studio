import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { faq } from "../data/content";
import { Container, Section, SectionHeading } from "./ui-primitives";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <Section id="faq">
      <Container>
        <SectionHeading
          eyebrow="Perguntas frequentes"
          title="O que você precisa saber antes de começar."
          description="Informações sobre escopo, valores, prazos, atendimento e tipos de projeto."
        />

        <div className="mx-auto max-w-3xl divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] overflow-hidden">
          {faq.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <div key={item.q} className="bg-[var(--card-solid)]">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60"
                    style={{ fontSize: "1rem", fontWeight: 500 }}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-[var(--ice-blue)] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  aria-hidden={!isOpen}
                  className={`grid ${
                    reduceMotion
                      ? "transition-none"
                      : "transition-[grid-template-rows,opacity] duration-300"
                  } ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className="px-5 pb-5 -mt-1 text-[var(--muted-foreground)] text-pretty"
                      style={{ fontSize: "0.93rem" }}
                    >
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

export default FAQ;

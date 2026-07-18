import { ArrowRight } from "lucide-react";
import { organizeOutcomes, organizePoints } from "../data/content";
import { Container, LinkButton, Section, SectionHeading } from "./ui-primitives";
import { trackEvent } from "../lib/track";

export function WhatWeOrganize() {
  return (
    <Section id="organizamos" className="bg-[var(--surface)]">
      <Container>
        <SectionHeading
          eyebrow="Onde ajudamos"
          title="Quando informações, atendimento e ferramentas não trabalham juntos, a operação perde clareza."
          description="Contatos ficam espalhados, tarefas dependem da memória, propostas não são acompanhadas e ferramentas acabam sendo usadas sem uma estrutura definida. A Barthy organiza essas partes em um fluxo mais claro, conectado e funcional."
        />

        {/* Lista editorial em duas colunas, numerada e com divisores */}
        <ol className="grid gap-x-12 gap-y-0 sm:grid-cols-2">
          {organizePoints.map((point, i) => (
            <li
              key={point}
              className="flex items-baseline gap-4 border-b border-[var(--hairline)] py-4"
            >
              <span
                className="text-[var(--text-accent)] tabular-nums shrink-0"
                style={{ fontSize: "0.85rem", letterSpacing: "0.05em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[var(--foreground)]" style={{ fontSize: "0.98rem" }}>
                {point}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-7">
          <h3 className="text-[var(--foreground)]">O que muda com uma estrutura conectada</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {organizeOutcomes.map((outcome) => (
              <div
                key={outcome}
                className="rounded-xl border border-[var(--hairline)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)]"
                style={{ fontSize: "0.9rem" }}
              >
                {outcome}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <LinkButton
            href="#contato"
            variant="primary"
            className="w-full sm:w-auto"
            onClick={() => trackEvent("click_problem_cta")}
          >
            Quero organizar esses pontos <ArrowRight className="w-4 h-4" />
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}

export default WhatWeOrganize;

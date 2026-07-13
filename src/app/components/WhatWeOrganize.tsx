import { ArrowRight } from "lucide-react";
import { organizePoints } from "../data/content";
import { Container, LinkButton, Section, SectionHeading } from "./ui-primitives";
import { trackEvent } from "../lib/track";

export function WhatWeOrganize() {
  return (
    <Section id="organizamos" className="bg-[var(--surface)]">
      <Container>
        <SectionHeading
          eyebrow="Onde ajudamos"
          title="Menos ruído na apresentação. Mais clareza para vender e operar."
          description="Quando apresentação, atendimento e processos não acompanham a qualidade do trabalho, a empresa perde clareza, tempo e oportunidades. A Barthy organiza esses pontos em uma estrutura digital coerente."
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

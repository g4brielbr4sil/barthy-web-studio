import { steps, definedBeforeStart } from "../data/content";
import { Container, Section, SectionHeading } from "./ui-primitives";

export function HowItWorks() {
  return (
    <Section id="como-trabalhamos" className="bg-[var(--surface)]">
      <Container>
        <SectionHeading
          eyebrow="Como trabalhamos"
          title="Direção clara do diagnóstico à continuidade."
          description="A necessidade vem antes da ferramenta. O processo mantém escopo, prazo, responsabilidades e próximos passos visíveis."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-2xl border border-[var(--border)] bg-[var(--card-solid)] p-7 transition-colors hover:border-[var(--ice-blue)]/40"
            >
              <div
                className="text-[var(--text-accent)] mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.n}
              </div>
              <h3 className="text-[var(--foreground)]">{s.title}</h3>
              <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: "0.95rem" }}>
                {s.text}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden xl:block absolute top-1/2 -right-3 w-6 h-px bg-[var(--border-strong)]" />
              )}
            </div>
          ))}
        </div>

        {/* O que fica definido antes de começar */}
        <div className="mt-8 rounded-2xl border border-[var(--border)] p-6 md:p-7">
          <h3 className="text-[var(--foreground)]">O que fica definido antes de começar</h3>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {definedBeforeStart.map((d) => (
              <span
                key={d}
                className="inline-flex items-center rounded-full border border-[var(--border)] px-3.5 py-1.5 text-[var(--muted-foreground)]"
                style={{ fontSize: "0.85rem" }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default HowItWorks;

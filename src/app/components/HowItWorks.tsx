import { steps } from "../data/content";
import { Container, Section, SectionHeading } from "./ui-primitives";

export function HowItWorks() {
  return (
    <Section id="como-trabalhamos" className="bg-[var(--surface)]">
      <Container>
        <SectionHeading
          eyebrow="Como trabalhamos"
          title="Do diagnóstico à continuidade."
          description="Cada etapa mantém decisões e responsabilidades visíveis."
        />

        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {steps.map((s) => (
            <li
              key={s.n}
              className="border-t border-[var(--border-strong)] pt-5"
            >
              <div
                className="text-[var(--text-accent)]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                }}
              >
                {s.n}
              </div>
              <h3 className="mt-4 text-[var(--foreground)]">{s.title}</h3>
              <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: "0.9rem" }}>
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

export default HowItWorks;

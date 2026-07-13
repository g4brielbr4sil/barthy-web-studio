import { Check } from "lucide-react";
import { solutions, complements } from "../data/content";
import { Container, Section, SectionHeading } from "./ui-primitives";

export function Solutions() {
  return (
    <Section id="solucoes" className="bg-[var(--surface)]">
      <Container>
        <SectionHeading
          eyebrow="Soluções"
          title="Comece pelo que sua empresa precisa agora."
          description="Da presença digital aos processos internos, a Barthy estrutura soluções que podem começar simples e evoluir conforme a operação."
        />

        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" }}
        >
          {solutions.map((g) => {
            const Icon = g.icon;
            return (
              <article
                key={g.title}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card-solid)] p-6 md:p-7 transition-colors hover:border-[var(--ice-blue)]/40"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--ice-blue)] shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-[var(--foreground)]">{g.title}</h3>
                </div>
                <p className="text-[var(--muted-foreground)]" style={{ fontSize: "0.92rem" }}>
                  {g.description}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2.5 text-[var(--muted-foreground)]"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <Check className="mt-0.5 w-3.5 h-3.5 text-[var(--ice-blue)] shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Complementos comerciais — bloco menor, editorial (não card por item) */}
        <div className="mt-10 rounded-2xl border border-[var(--border)] p-6 md:p-7">
          <h3 className="text-[var(--foreground)]">Complementos comerciais</h3>
          <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: "0.92rem" }}>
            Materiais e ajustes que fortalecem a apresentação e completam a estrutura do projeto.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {complements.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full border border-[var(--border)] px-3.5 py-1.5 text-[var(--muted-foreground)]"
                style={{ fontSize: "0.85rem" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default Solutions;

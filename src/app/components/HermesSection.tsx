import { Workflow } from "lucide-react";
import { hermesFunctions } from "../data/content";
import { Container, Section } from "./ui-primitives";

export function HermesSection() {
  return (
    <Section id="hermes" className="overflow-hidden">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(700px 380px at 100% 0%, rgba(74,127,167,0.14), transparent 60%)",
            }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="min-w-0">
              <div
                className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full border border-[var(--border)] text-[var(--ice-blue)]"
                style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
              >
                <Workflow className="w-3.5 h-3.5 shrink-0" />
                Operação interna
              </div>
              <h2 className="text-balance break-words text-[var(--foreground)]">
                O Hermes organiza cada oportunidade do primeiro contato ao acompanhamento.
              </h2>
              <p
                className="mt-5 text-[var(--muted-foreground)] text-pretty"
                style={{ fontSize: "clamp(0.98rem, 1.4vw, 1.05rem)" }}
              >
                Sistema interno da Barthy para centralizar contatos, prioridades e próximas ações
                comerciais.
              </p>
            </div>

            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {hermesFunctions.map((item, index) => (
                <li
                  key={item.title}
                  className="flex min-h-14 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                >
                  <span
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--ice-blue)] tabular-nums"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {index + 1}
                  </span>
                  <strong className="text-[var(--foreground)]" style={{ fontSize: "0.88rem" }}>
                    {item.title}
                  </strong>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default HermesSection;

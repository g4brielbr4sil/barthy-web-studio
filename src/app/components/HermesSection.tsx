import { Check, Workflow, ArrowRight } from "lucide-react";
import { hermesPoints, hermesFlow } from "../data/content";
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
              <h2 className="text-balance text-[var(--foreground)]">
                Leads organizados desde o primeiro contato.
              </h2>
              <p
                className="mt-5 text-[var(--muted-foreground)] text-pretty"
                style={{ fontSize: "clamp(0.98rem, 1.4vw, 1.05rem)" }}
              >
                As solicitações do site entram no Hermes com origem, cidade, serviço de interesse e
                próxima ação. Isso dá continuidade ao atendimento e reduz o risco de perder
                oportunidades.
              </p>

              {/* Fluxo interno */}
              <ol className="mt-7 flex flex-col gap-2">
                {hermesFlow.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 text-[var(--foreground)]"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[var(--border)] text-[var(--ice-blue)] shrink-0 tabular-nums" style={{ fontSize: "0.72rem" }}>
                      {i + 1}
                    </span>
                    {step}
                    {i < hermesFlow.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--border-strong)] ml-auto sm:ml-0" />
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hermesPoints.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)]"
                  style={{ fontSize: "0.9rem" }}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--terra)]/15 text-[var(--terra)] shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default HermesSection;

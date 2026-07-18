import { ArrowRight } from "lucide-react";
import { systemDetails, systemFronts } from "../data/content";
import { Container, Disclosure, LinkButton, Section } from "./ui-primitives";
import { prefillQuote } from "../lib/prefill";
import { trackEvent } from "../lib/track";

export function SystemsCRM() {
  return (
    <Section id="sistemas" className="overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(800px 460px at 80% 0%, rgba(74,127,167,0.10), transparent 60%)",
        }}
      />
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:items-start">
          {/* Coluna editorial */}
          <div className="lg:sticky lg:top-28">
            <p
              className="text-[var(--text-accent)] mb-4"
              style={{ fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              Sistemas e operação
            </p>
            <h2 className="text-balance text-[var(--foreground)]">
              Sistemas para acompanhar a operação.
            </h2>
            <p
              className="mt-5 text-[var(--muted-foreground)] text-pretty"
              style={{ fontSize: "1.05rem" }}
            >
              Centralize dados, etapas e responsabilidades em um fluxo próprio.
            </p>

            <div className="mt-8">
              <LinkButton
                href="#contato"
                variant="primary"
                className="w-full sm:w-auto"
                onClick={() => {
                  prefillQuote({
                    service: "CRM e gestão comercial",
                    note: "Tenho interesse em sistemas, CRM ou automação para organizar a operação.",
                  });
                  trackEvent("click_crm_cta");
                }}
              >
                Conversar sobre um sistema <ArrowRight className="w-4 h-4" />
              </LinkButton>
            </div>
          </div>

          {/* Seis frentes estruturadas */}
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
            {systemFronts.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="bg-[var(--card-solid)] p-6">
                  <Icon className="w-5 h-5 text-[var(--ice-blue)]" />
                  <h3 className="mt-4 text-[var(--foreground)]">{c.title}</h3>
                  <p
                    className="mt-2 text-[var(--muted-foreground)]"
                    style={{ fontSize: "0.92rem" }}
                  >
                    {c.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <Disclosure label="Ver como os sistemas funcionam" className="mt-8">
          <div className="grid gap-6 text-[var(--muted-foreground)] md:grid-cols-2">
            <div>
              <h3 className="text-[var(--foreground)]">Como funciona</h3>
              <p className="mt-2" style={{ fontSize: "0.9rem" }}>
                {systemDetails.howItWorks}
              </p>
            </div>
            <div>
              <h3 className="text-[var(--foreground)]">Exemplos de fluxo</h3>
              <ul className="mt-2 space-y-1.5" style={{ fontSize: "0.88rem" }}>
                {systemDetails.flows.map((flow) => (
                  <li key={flow}>{flow}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[var(--foreground)]">Tecnologias possíveis</h3>
              <ul className="mt-2 space-y-1.5" style={{ fontSize: "0.88rem" }}>
                {systemDetails.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[var(--foreground)]">Observação técnica</h3>
              <p className="mt-2" style={{ fontSize: "0.9rem" }}>
                {systemDetails.note}
              </p>
            </div>
          </div>
        </Disclosure>
      </Container>
    </Section>
  );
}

export default SystemsCRM;

import { ArrowRight } from "lucide-react";
import { systemFronts } from "../data/content";
import { Container, LinkButton, Section } from "./ui-primitives";
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
              Sistemas para centralizar informações e dar visibilidade à operação.
            </h2>
            <p
              className="mt-5 text-[var(--muted-foreground)] text-pretty"
              style={{ fontSize: "1.05rem" }}
            >
              Quando planilhas, mensagens e tarefas deixam de ser suficientes, a Barthy estrutura
              sistemas que centralizam informações, organizam processos e dão mais visibilidade à
              operação.
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
                Conversar sobre uma solução <ArrowRight className="w-4 h-4" />
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
      </Container>
    </Section>
  );
}

export default SystemsCRM;

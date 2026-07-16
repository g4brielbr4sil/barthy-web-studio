import { ArrowRight, Info } from "lucide-react";
import { digitalProducts } from "../data/content";
import { Container, LinkButton, Section, SectionHeading } from "./ui-primitives";
import { prefillQuote } from "../lib/prefill";
import { trackEvent } from "../lib/track";

export function ProductsSystems() {
  return (
    <Section id="produtos" className="overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(820px 460px at 12% 0%, rgba(74,127,167,0.10), transparent 60%)",
        }}
      />
      <Container>
        <SectionHeading
          eyebrow="Produtos e integrações"
          title="Estruturas reutilizáveis para conectar canais e reduzir tarefas manuais."
          description="Algumas necessidades podem ser resolvidas com produtos digitais, templates e integrações que melhoram a continuidade da operação."
        />

        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))" }}
        >
          {digitalProducts.map((p) => {
            const Icon = p.icon;
            return (
              <article
                key={p.title}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card-solid)] p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--ice-blue)] shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-[var(--foreground)]">{p.title}</h3>
                </div>
                <p className="text-[var(--muted-foreground)]" style={{ fontSize: "0.9rem" }}>
                  {p.text}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.items.map((it) => (
                    <span
                      key={it}
                      className="inline-flex items-center rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-2.5 py-1 text-[var(--muted-foreground)]"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {it}
                    </span>
                  ))}
                </div>
                {p.note && (
                  <p
                    className="mt-4 flex items-start gap-1.5 text-[var(--muted-foreground)]"
                    style={{ fontSize: "0.78rem" }}
                  >
                    <Info className="mt-0.5 w-3.5 h-3.5 text-[var(--ice-blue)] shrink-0" />
                    <span>{p.note}</span>
                  </p>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-10">
          <LinkButton
            href="#contato"
            variant="primary"
            className="w-full sm:w-auto"
            onClick={() => {
              prefillQuote({
                service: "Sistema sob medida",
                note: "Sistema, CRM, automação ou integração — quero organizar minha operação.",
              });
              trackEvent("click_products_cta");
            }}
          >
            Quero organizar minha operação <ArrowRight className="w-4 h-4" />
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}

export default ProductsSystems;

import { ArrowRight } from "lucide-react";
import { digitalProducts } from "../data/content";
import {
  Container,
  Disclosure,
  LinkButton,
  Section,
  SectionHeading,
} from "./ui-primitives";
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
          eyebrow="Produtos e automações"
          title="Bases reutilizáveis para acelerar rotinas digitais."
          description="Produtos, templates e conexões adaptados ao contexto de uso."
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
                <Disclosure label="Ver detalhes" className="mt-5">
                  <ul
                    className="space-y-2 text-[var(--muted-foreground)]"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {p.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  {p.note && (
                    <p
                      className="mt-4 border-t border-[var(--hairline)] pt-4 text-[var(--muted-foreground)]"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {p.note}
                    </p>
                  )}
                </Disclosure>
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

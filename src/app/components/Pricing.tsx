import { Check, Sparkles, Rocket, Briefcase, Star, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { packages, type Pkg } from "../data/content";
import { Button, Container, LinkButton, Section, SectionHeading } from "./ui-primitives";
import { prefillQuote } from "../lib/prefill";
import { trackEvent } from "../lib/track";

const icons = [Rocket, Briefcase, Sparkles];

export function Pricing() {
  return (
    <Section id="pacotes" className="overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 500px at 50% 0%, rgba(74,127,167,0.18), transparent 60%), radial-gradient(600px 400px at 100% 100%, rgba(205,118,93,0.12), transparent 60%)",
        }}
      />

      <Container>
        <SectionHeading
          align="center"
          eyebrow="Pacotes"
          title="Escolha a estrutura que faz sentido agora."
          description="Escopo definido para começar com uma entrega objetiva."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {packages.map((p, i) => (
            <PriceCard key={p.name} plan={p} index={i} Icon={icons[i] ?? Rocket} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function PriceCard({
  plan,
  index,
  Icon,
}: {
  plan: Pkg;
  index: number;
  Icon: React.ElementType;
}) {
  const highlight = !!plan.highlight;
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06 + 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col rounded-3xl p-8 backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-200 ${
        highlight
          ? "bg-gradient-to-b from-[var(--surface)] to-[var(--background)] border border-[var(--terra)]/50 ring-1 ring-[var(--terra)]/25 shadow-[0_30px_80px_-30px_rgba(205,118,93,0.45)] lg:-mt-4 lg:mb-4 lg:z-10"
          : "glass hover:-translate-y-[2px] hover:border-[var(--ice-blue)]/40"
      }`}
    >
      {highlight && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-[var(--terra)] px-3 py-1 text-white shadow-lg"
          style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
        >
          <Star className="w-3 h-3" /> Mais escolhido
        </div>
      )}

      <div className="mb-6">
        <div
          className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
            highlight
              ? "bg-[var(--terra)] text-white"
              : "bg-[var(--surface)]/60 border border-[var(--border)] text-[var(--ice-blue)]"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-[var(--foreground)]" style={{ fontSize: "1.2rem" }}>
          {plan.name}
        </h3>
        <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: "0.9rem" }}>
          {plan.tagline}
        </p>
      </div>

      <div className="mb-7 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          className="text-[var(--terra)] break-words"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            letterSpacing: "-0.01em",
          }}
        >
          {plan.price}
        </span>
        <span
          className="text-[var(--muted-foreground)]"
          style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          Pacote fechado
        </span>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-[var(--foreground)]"
            style={{ fontSize: "0.93rem" }}
          >
            <span
              className={`mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full shrink-0 ${
                highlight ? "bg-[var(--terra)]/15 text-[var(--terra)]" : "bg-[var(--ice-blue)]/15 text-[var(--ice-blue)]"
              }`}
            >
              <Check className="w-3 h-3" />
            </span>
            <span className="leading-5 text-[var(--muted-foreground)]">{f}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2.5">
        <Button
          type="button"
          variant={highlight ? "primary" : "outline"}
          className="w-full group"
          onClick={() => {
            trackEvent("click_package_cta", { pacote: plan.name });
            prefillQuote({
              service: `Pacote ${plan.name}`,
              note: `Tenho interesse no pacote ${plan.name}.`,
            });
            document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {plan.cta}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
        <LinkButton href="#contato" variant="ghost" className="w-full">
          Tirar uma dúvida
        </LinkButton>
      </div>
    </motion.article>
  );
}

export default Pricing;

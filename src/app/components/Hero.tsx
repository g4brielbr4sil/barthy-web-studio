import { ArrowRight, Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PlasmaBackground } from "./PlasmaBackground";
import { LinkButton } from "./ui-primitives";
import { trackEvent } from "../lib/track";

const trust = [
  "Diagnóstico antes da solução",
  "Escopo e prazo definidos",
  "Entrega pronta para uso",
];

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="inicio"
      className="hero-section relative isolate overflow-hidden pt-[112px] pb-20 md:pt-[160px] md:pb-28"
    >
      <div className="absolute inset-0 -z-10">
        <PlasmaBackground />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-8 relative">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[760px]"
        >
          <p
            className="text-[var(--text-accent)] mb-4"
            style={{ fontSize: "0.85rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            Tecnologia organizada para operações reais
          </p>

          <h1
            className="text-balance text-[var(--foreground)] max-w-[740px]"
            style={{ fontSize: "clamp(2rem, 5.4vw, 4rem)" }}
          >
            Transformamos necessidades reais em páginas, sistemas e fluxos que fazem a operação
            avançar.
          </h1>

          <p
            className="mt-6 max-w-[620px] text-[var(--muted-foreground)] text-pretty"
            style={{ fontSize: "clamp(0.98rem, 1.4vw, 1.1rem)" }}
          >
            A Barthy organiza presença digital, captação, atendimento e processos internos em
            soluções claras, funcionais e preparadas para evoluir.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
            <LinkButton
              href="#contato"
              variant="primary"
              className="w-full sm:w-auto"
              onClick={() => trackEvent("click_hero_cta", { target: "contato" })}
            >
              Falar sobre meu projeto <ArrowRight className="w-4 h-4" />
            </LinkButton>
            <LinkButton
              href="#solucoes"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => trackEvent("click_hero_cta", { target: "solucoes" })}
            >
              Conhecer soluções
            </LinkButton>
          </div>

          <ul
            className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[var(--muted-foreground)]"
            style={{ fontSize: "0.85rem" }}
          >
            {trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[var(--ice-blue)] shrink-0" />
                {t}
              </li>
            ))}
          </ul>

        </motion.div>
      </div>
    </section>
  );
}

export default Hero;

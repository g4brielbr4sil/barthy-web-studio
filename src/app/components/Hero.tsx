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

const HERO_TITLE =
  "Transformamos necessidades reais em soluções digitais claras e funcionais.";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const words = HERO_TITLE.split(" ");
  let characterIndex = 0;

  return (
    <section
      id="inicio"
      className="hero-section relative isolate overflow-hidden pt-[112px] pb-20 md:pt-[160px] md:pb-28"
    >
      <div className="absolute inset-0 -z-10">
        <PlasmaBackground />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-8 relative">
        <div className="max-w-[760px]">
          <p
            className="text-[var(--text-accent)] mb-4"
            style={{ fontSize: "0.85rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            Páginas, sistemas e operação digital
          </p>

          <h1
            aria-label={HERO_TITLE}
            className="text-balance text-[var(--foreground)] max-w-[740px]"
            style={{ fontSize: "clamp(2rem, 5.4vw, 4rem)" }}
          >
            <span aria-hidden="true">
              {words.map((word, wordIndex) => (
                <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
                  {Array.from(word).map((character, index) => {
                    const delay = characterIndex * 0.02;
                    characterIndex += 1;
                    return (
                      <motion.span
                        key={`${character}-${index}`}
                        aria-hidden="true"
                        className="inline-block"
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0.5, y: 8, filter: "blur(5px)" }
                        }
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : {
                                duration: 0.45,
                                delay,
                                ease: [0.22, 1, 0.36, 1],
                              }
                        }
                      >
                        {character}
                      </motion.span>
                    );
                  })}
                  {wordIndex < words.length - 1 && (
                    <span aria-hidden="true" className="inline-block w-[0.24em]">
                      {" "}
                    </span>
                  )}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="mt-6 max-w-[620px] text-[var(--muted-foreground)] text-pretty"
            style={{ fontSize: "clamp(0.98rem, 1.4vw, 1.1rem)" }}
          >
            Criamos páginas, sistemas e fluxos que ajudam empresas a apresentar serviços, captar
            oportunidades e organizar a operação.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
            <LinkButton
              href="#contato"
              variant="primary"
              className="w-full sm:w-auto"
              data-cta-source="hero-primary"
              onClick={() =>
                trackEvent("cta_click", {
                  source: "hero-primary",
                  destination: "contato",
                })
              }
            >
              Falar sobre meu projeto <ArrowRight className="w-4 h-4" />
            </LinkButton>
            <LinkButton
              href="#solucoes"
              variant="outline"
              className="w-full sm:w-auto"
              data-cta-source="hero-secondary"
              onClick={() =>
                trackEvent("cta_click", {
                  source: "hero-secondary",
                  destination: "solucoes",
                })
              }
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

        </div>
      </div>
    </section>
  );
}

export default Hero;

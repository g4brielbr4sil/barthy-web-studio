import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import { PlasmaBackground } from "./PlasmaBackground";
import { LinkButton } from "./ui-primitives";
import { useTheme } from "../lib/theme";
import { trackEvent } from "../lib/track";

const trust = [
  "Escopo bem definido",
  "Prazo combinado",
  "Entrega objetiva",
  "Atendimento organizado",
];

const flow = [
  "Página ou formulário",
  "Hermes",
  "Diagnóstico",
  "Proposta",
  "Acompanhamento",
];

export function Hero() {
  const { isDark } = useTheme();

  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  // Plasma muito sutil — mais discreto no light para não estourar.
  const plasmaOpacity = isDark ? (isMobile ? 0.1 : 0.16) : isMobile ? 0.05 : 0.08;

  const overlay = isDark
    ? "radial-gradient(1100px 560px at 18% 8%, rgba(26,61,99,0.5), transparent 60%), radial-gradient(820px 460px at 96% 92%, rgba(74,127,167,0.22), transparent 60%)"
    : "radial-gradient(1000px 520px at 16% 4%, rgba(74,127,167,0.16), transparent 62%), radial-gradient(760px 420px at 98% 96%, rgba(26,61,99,0.08), transparent 60%)";

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden pt-[112px] pb-20 md:pt-[160px] md:pb-28"
    >
      <div className="absolute inset-0 -z-10">
        <PlasmaBackground
          color={isDark ? "#4A7FA7" : "#1A3D63"}
          speed={0.2}
          opacity={plasmaOpacity}
          scale={1.2}
          mouseInteractive={!isMobile}
        />
      </div>

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0" style={{ background: overlay }} />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-5 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[760px]"
        >
          <p
            className="text-[var(--text-accent)] mb-4"
            style={{ fontSize: "0.85rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
          >
            Páginas, sistemas e automações
          </p>

          <h1
            className="text-balance text-[var(--foreground)] max-w-[740px]"
            style={{ fontSize: "clamp(2rem, 5.4vw, 4rem)" }}
          >
            Páginas, sistemas e atendimento organizados para sua empresa vender melhor.
          </h1>

          <p
            className="mt-6 max-w-[620px] text-[var(--muted-foreground)] text-pretty"
            style={{ fontSize: "clamp(0.98rem, 1.4vw, 1.1rem)" }}
          >
            Criamos landing pages, portfólios, CRMs, dashboards e automações que tornam sua
            apresentação mais clara, a captação mais simples e o atendimento mais organizado.
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

          {/* Fluxo discreto da operação */}
          <div className="mt-10 -mx-4 px-4 overflow-x-auto sm:overflow-visible sm:mx-0 sm:px-0">
            <ol
              className="flex items-center gap-2 sm:gap-3 whitespace-nowrap text-[var(--muted-foreground)]"
              style={{ fontSize: "0.78rem" }}
            >
              {flow.map((step, i) => (
                <li key={step} className="inline-flex items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[var(--ice-blue)]" />
                    {step}
                  </span>
                  {i < flow.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-[var(--border-strong)] shrink-0" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;

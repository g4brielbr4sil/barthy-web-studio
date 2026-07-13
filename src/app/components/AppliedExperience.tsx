import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CardSwap, Card } from "./CardSwap";
import { appliedExperience, type Experience } from "../data/content";
import { Container, Section } from "./ui-primitives";
import { trackEvent } from "../lib/track";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

// Cards de experiência permanecem escuros nos dois temas (base Deep Navy/Royal),
// por isso o texto branco é sempre legível.
function ExperienceFace({ e }: { e: Experience }) {
  return (
    <div className="relative w-full h-full p-7 flex flex-col overflow-hidden rounded-2xl min-h-[220px]">
      <div className={`absolute inset-0 opacity-70 bg-gradient-to-br ${e.accent}`} aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.16), transparent 60%), linear-gradient(180deg, transparent 35%, rgba(10,25,49,0.72) 100%)",
        }}
        aria-hidden
      />
      <div className="relative flex-1 flex flex-col justify-between text-white gap-5">
        <div
          style={{ fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
          className="text-white/80"
        >
          {e.category}
        </div>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.2rem, 2.2vw, 1.45rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            {e.title}
          </h3>
          <p className="mt-2 text-white/85 text-pretty" style={{ fontSize: "0.82rem" }}>
            {e.description}
          </p>
          {e.link && (
            <a
              href={e.link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("click_experience_link", { title: e.title })}
              className="relative z-10 mt-4 inline-flex items-center gap-1 text-white/90 underline decoration-white/30 underline-offset-4 hover:decoration-white"
              style={{ fontSize: "0.78rem" }}
            >
              {e.link.label} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function AppliedExperience() {
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return (
    <Section id="experiencia" className="bg-[var(--surface)]">
      <Container>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-12 items-center">
          <div className="max-w-xl min-w-0">
            <p
              className="text-[var(--text-accent)] mb-4"
              style={{ fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              Experiência aplicada
            </p>
            <h2 className="text-[var(--foreground)] text-balance">
              Experiência que sustenta o que entregamos.
            </h2>
            <p
              className="mt-5 text-[var(--muted-foreground)] text-pretty"
              style={{ fontSize: "clamp(0.98rem, 1.4vw, 1.05rem)", maxWidth: "60ch" }}
            >
              A atuação em portais, plataformas educacionais, CRM, dashboards, automações e fluxos
              internos orienta cada projeto desenvolvido pela Barthy.
            </p>
            <ul
              className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[var(--muted-foreground)]"
              style={{ fontSize: "0.9rem" }}
            >
              {appliedExperience.map((e) => (
                <li key={e.title} className="flex items-start gap-2 min-w-0">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--ice-blue)] shrink-0" />
                  <span>
                    {e.title} <span className="opacity-60">· {e.category}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[var(--muted-foreground)]" style={{ fontSize: "0.78rem" }}>
              Experiências profissionais e projetos próprios que compõem a capacidade técnica da
              Barthy Web Studio.
            </p>
          </div>

          {isDesktop ? (
            <div className="relative w-full h-[440px] flex items-center justify-center xl:justify-end overflow-visible">
              <CardSwap
                width={380}
                height={280}
                cardDistance={36}
                verticalDistance={32}
                delay={4800}
                pauseOnHover
                skewAmount={2}
                easing="linear"
              >
                {appliedExperience.map((e) => (
                  <Card key={e.title}>
                    <ExperienceFace e={e} />
                  </Card>
                ))}
              </CardSwap>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {appliedExperience.map((e) => (
                <div
                  key={e.title}
                  className="relative rounded-2xl border border-[var(--border-strong)] overflow-hidden"
                >
                  <ExperienceFace e={e} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

export default AppliedExperience;

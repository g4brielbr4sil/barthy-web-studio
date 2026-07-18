import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { appliedExperience, type Experience } from "../data/content";
import { Container, Section, SectionHeading } from "./ui-primitives";
import { trackEvent } from "../lib/track";
import { useMediaQuery } from "../lib/useMediaQuery";
import { HermesTerminal } from "./HermesTerminal";
import { TechnicalFlow } from "./TechnicalFlow";

const LazyExperienceCardSwap = lazy(() => import("./ExperienceCardSwap"));

function TechnologyBadges({ badges }: { badges: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tecnologias principais">
      {badges.map((badge) => (
        <li
          key={badge}
          className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-white/90"
          style={{ fontSize: "0.72rem" }}
        >
          {badge}
        </li>
      ))}
    </ul>
  );
}

function ExperienceFace({ experience }: { experience: Experience }) {
  return (
    <div className="relative flex h-full w-full min-h-[300px] flex-col overflow-hidden rounded-2xl p-7">
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-75 ${experience.accent}`}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.16), transparent 60%), linear-gradient(180deg, transparent 25%, rgba(10,25,49,0.82) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-1 flex-col justify-between gap-6 text-white">
        <p
          className="text-white/80"
          style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          {experience.category}
        </p>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.35rem, 2.2vw, 1.65rem)",
              letterSpacing: "-0.01em",
            }}
          >
            {experience.title}
          </h3>
          <p className="mt-2 text-white/88" style={{ fontSize: "0.86rem", lineHeight: 1.55 }}>
            {experience.summary}
          </p>
          <p className="mt-3 text-white" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
            {experience.result}
          </p>
          <TechnologyBadges badges={experience.badges} />
        </div>
      </div>
    </div>
  );
}

function CardSwapFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-[320px] w-full max-w-[410px] rounded-2xl border border-[var(--border)] bg-[var(--card-solid)]"
    />
  );
}

function DetailButton({
  experience,
  selected,
  onSelect,
  compact = false,
}: {
  experience: Experience;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      aria-expanded={selected}
      aria-controls="experience-technical-details"
      onClick={onSelect}
      className={`flex w-full items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card-solid)] text-left text-[var(--foreground)] transition-[background-color,border-color,transform] duration-200 hover:-translate-y-[1px] hover:border-[var(--ice-blue)]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/60 ${
        compact ? "px-4 py-3" : "mt-5 px-4 py-3"
      }`}
    >
      <span>
        {compact && (
          <strong className="block" style={{ fontSize: "0.9rem" }}>
            {experience.title}
          </strong>
        )}
        <span
          className={compact ? "text-[var(--muted-foreground)]" : ""}
          style={{ fontSize: "0.82rem" }}
        >
          Ver detalhes técnicos
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 text-[var(--ice-blue)] transition-transform duration-200 ${
          selected ? "rotate-90" : ""
        }`}
      />
    </button>
  );
}

function TechnicalDetails({ experience }: { experience: Experience }) {
  const groups = [
    {
      title: "Minha atuação",
      items: experience.details.role,
    },
    {
      title: "Desafios resolvidos",
      items: experience.details.challenges,
    },
    {
      title: "Regras de negócio",
      items: experience.details.businessRules,
    },
  ];

  return (
    <article
      id="experience-technical-details"
      className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card-solid)] p-6 md:p-8"
    >
      <p
        className="text-[var(--text-accent)]"
        style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
      >
        Detalhes técnicos
      </p>
      <h3 className="mt-2 text-[var(--foreground)]">{experience.title}</h3>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h4 className="text-[var(--foreground)]">Como funciona</h4>
          <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: "0.9rem" }}>
            {experience.details.howItWorks}
          </p>
        </div>
        <div>
          <h4 className="text-[var(--foreground)]">Arquitetura resumida</h4>
          <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: "0.9rem" }}>
            {experience.details.architecture}
          </p>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <h4 className="text-[var(--foreground)]">{group.title}</h4>
            <ul
              className="mt-2 space-y-1.5 text-[var(--muted-foreground)]"
              style={{ fontSize: "0.88rem" }}
            >
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-[var(--foreground)]">Deploy</h4>
          <p className="mt-2 text-[var(--muted-foreground)]" style={{ fontSize: "0.9rem" }}>
            {experience.details.deployment}
          </p>
        </div>
      </div>

      {experience.title === "PNQC" && <TechnicalFlow />}
      {experience.title === "Hermes" && (
        <div className="mt-8">
          <HermesTerminal />
        </div>
      )}

      {experience.context && (
        <p
          className="mt-6 border-t border-[var(--hairline)] pt-5 text-[var(--muted-foreground)]"
          style={{ fontSize: "0.8rem" }}
        >
          {experience.context}
        </p>
      )}

      {experience.link && (
        <a
          href={experience.link.url}
          target="_blank"
          rel="noopener noreferrer"
          data-cta-source="experience"
          onClick={() =>
            trackEvent("cta_click", {
              source: "experience",
              destination: "experience",
            })
          }
          className="mt-5 inline-flex min-h-11 items-center gap-1 text-[var(--foreground)] underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-[var(--ice-blue)]"
          style={{ fontSize: "0.84rem" }}
        >
          {experience.link.label} <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
    </article>
  );
}

export function AppliedExperience() {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const canUseCardSwap = isDesktop && !reduceMotion;
  const experienceDisplayRef = useRef<HTMLDivElement>(null);
  const [shouldLoadCardSwap, setShouldLoadCardSwap] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const selectedExperience =
    appliedExperience.find((experience) => experience.title === selectedTitle) ?? null;

  useEffect(() => {
    if (!canUseCardSwap) {
      setShouldLoadCardSwap(false);
      return;
    }

    const node = experienceDisplayRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setShouldLoadCardSwap(true);
      return;
    }

    let observer: IntersectionObserver;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setShouldLoadCardSwap(true);
          observer.disconnect();
        },
        { rootMargin: "500px 0px" },
      );
    } catch {
      setShouldLoadCardSwap(true);
      return;
    }

    observer.observe(node);
    return () => observer.disconnect();
  }, [canUseCardSwap]);

  const toggleDetails = (experience: Experience) => {
    setSelectedTitle((current) => (current === experience.title ? null : experience.title));
    trackEvent("toggle_experience_details", {
      title: experience.title,
    });
  };

  return (
    <Section id="experiencia" className="bg-[var(--surface)]">
      <Container>
        <SectionHeading
          eyebrow="Experiência aplicada"
          title="Projetos reais, stack e atuação técnica."
          description="Abra cada case para ver arquitetura, responsabilidades e regras."
        />

        {canUseCardSwap ? (
          <div
            ref={experienceDisplayRef}
            className="grid items-center gap-14 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]"
          >
            <div className="space-y-3">
              {appliedExperience.map((experience) => (
                <DetailButton
                  key={experience.title}
                  experience={experience}
                  selected={selectedTitle === experience.title}
                  onSelect={() => toggleDetails(experience)}
                  compact
                />
              ))}
            </div>

            <div className="relative flex h-[470px] w-full items-center justify-end overflow-visible">
              {shouldLoadCardSwap ? (
                <Suspense fallback={<CardSwapFallback />}>
                  <LazyExperienceCardSwap
                    experiences={appliedExperience}
                    renderFace={(experience) => <ExperienceFace experience={experience} />}
                  />
                </Suspense>
              ) : (
                <CardSwapFallback />
              )}
            </div>
          </div>
        ) : (
          <div
            ref={experienceDisplayRef}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {appliedExperience.map((experience) => (
              <article
                key={experience.title}
                className="surface-night overflow-hidden rounded-2xl p-6"
              >
                <h3 className="text-white">{experience.title}</h3>
                <p className="mt-2 text-white/82" style={{ fontSize: "0.88rem" }}>
                  {experience.summary}
                </p>
                <p className="mt-3 text-white" style={{ fontSize: "0.84rem" }}>
                  {experience.result}
                </p>
                <TechnologyBadges badges={experience.badges} />
                <DetailButton
                  experience={experience}
                  selected={selectedTitle === experience.title}
                  onSelect={() => toggleDetails(experience)}
                />
              </article>
            ))}
          </div>
        )}

        {selectedExperience && <TechnicalDetails experience={selectedExperience} />}
      </Container>
    </Section>
  );
}

export default AppliedExperience;

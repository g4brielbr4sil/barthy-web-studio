import { serviceFronts } from "../data/content";
import { Container, Section, SectionHeading } from "./ui-primitives";

export function WhatWeOrganize() {
  return (
    <Section id="organizamos" className="bg-[var(--surface)]">
      <Container>
        <SectionHeading
          eyebrow="Onde ajudamos"
          title="Três frentes para apresentar, captar e operar melhor."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {serviceFronts.map((front) => {
            const Icon = front.icon;
            return (
              <article
                key={front.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card-solid)] p-6 transition-[border-color,transform] duration-200 hover:-translate-y-[2px] hover:border-[var(--ice-blue)]/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--ice-blue)]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[var(--foreground)]">{front.title}</h3>
                <p
                  className="mt-2 text-[var(--muted-foreground)]"
                  style={{ fontSize: "0.92rem" }}
                >
                  {front.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {front.examples.map((example) => (
                    <li
                      key={example}
                      className="rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-3 py-1 text-[var(--muted-foreground)]"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

export default WhatWeOrganize;

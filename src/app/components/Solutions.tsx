import { Check } from "lucide-react";
import { solutions } from "../data/content";
import { Container, Section, SectionHeading } from "./ui-primitives";
import { MotionGroup, TactileCard } from "./motion-primitives";

const cardLayouts = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
] as const;

export function Solutions() {
  return (
    <Section id="solucoes" className="bg-[var(--surface)]">
      <Container>
        <SectionHeading
          eyebrow="Soluções"
          title="Soluções prontas para contratar."
          description="Quatro frentes para apresentar, captar e vender melhor."
        />

        <MotionGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {solutions.map((g, index) => {
            const Icon = g.icon;
            return (
              <TactileCard
                key={g.title}
                className={`group flex min-h-[290px] flex-col rounded-2xl border border-[var(--border)] bg-[var(--card-solid)] p-6 shadow-[0_22px_60px_-44px_var(--shadow-color)] transition-[background-color,border-color,box-shadow] duration-200 hover:border-[var(--ice-blue)]/45 hover:shadow-[0_28px_64px_-42px_var(--shadow-color)] md:p-7 ${cardLayouts[index]}`}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--ice-blue)] transition-[border-color,transform] duration-200 group-hover:-translate-y-[1px] group-hover:border-[var(--ice-blue)]/50">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span
                    className="text-[var(--muted-foreground)]"
                    style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="max-w-[24ch] text-[var(--foreground)]">{g.title}</h3>
                <p className="text-[var(--muted-foreground)]" style={{ fontSize: "0.92rem" }}>
                  {g.description}
                </p>
                <p
                  className="mt-3 text-[var(--foreground)]"
                  style={{ fontSize: "0.9rem", lineHeight: 1.55 }}
                >
                  {g.benefit}
                </p>
                <ul className="mt-auto space-y-2.5 pt-6">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2.5 text-[var(--muted-foreground)]"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <Check className="mt-0.5 w-3.5 h-3.5 text-[var(--ice-blue)] shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </TactileCard>
            );
          })}
        </MotionGroup>
      </Container>
    </Section>
  );
}

export default Solutions;

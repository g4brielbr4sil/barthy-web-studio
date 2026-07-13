import { audiences, audiencesIntro } from "../data/content";
import { Container, Section, SectionHeading } from "./ui-primitives";

export function ForWhom() {
  return (
    <Section id="para-quem" className="overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="Para quem"
          title="Para quem é a Barthy?"
          description={audiencesIntro}
        />

        <div className="flex flex-wrap gap-2.5">
          {audiences.map((a) => (
            <span
              key={a}
              className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[var(--foreground)]"
              style={{ fontSize: "0.9rem" }}
            >
              {a}
            </span>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default ForWhom;

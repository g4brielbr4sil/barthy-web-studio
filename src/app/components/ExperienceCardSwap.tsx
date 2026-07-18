import type { ReactNode } from "react";
import { CardSwap, Card } from "./CardSwap";
import type { Experience } from "../data/content";

export interface ExperienceCardSwapProps {
  experiences: Experience[];
  renderFace: (experience: Experience) => ReactNode;
}

export default function ExperienceCardSwap({
  experiences,
  renderFace,
}: ExperienceCardSwapProps) {
  return (
    <CardSwap
      width={410}
      height={320}
      cardDistance={36}
      verticalDistance={32}
      delay={4800}
      pauseOnHover
      skewAmount={2}
      easing="linear"
    >
      {experiences.map((experience) => (
        <Card key={experience.title}>{renderFace(experience)}</Card>
      ))}
    </CardSwap>
  );
}

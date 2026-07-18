import type { ClickPoint, HeatmapCell, SectionMetric } from "./types";

export const HEATMAP_COLUMNS = 28;
export const HEATMAP_ROWS = 48;

export function aggregateClickPoints(
  points: ClickPoint[],
  columns = HEATMAP_COLUMNS,
  rows = HEATMAP_ROWS,
): HeatmapCell[] {
  const cells = new Map<string, { x: number; y: number; count: number }>();
  let maxCount = 0;

  for (const point of points) {
    const x = Math.min(columns - 1, Math.max(0, Math.floor(point.x * columns)));
    const y = Math.min(rows - 1, Math.max(0, Math.floor(point.y * rows)));
    const key = `${x}:${y}`;
    const current = cells.get(key) ?? { x, y, count: 0 };
    current.count += 1;
    maxCount = Math.max(maxCount, current.count);
    cells.set(key, current);
  }

  return [...cells.values()].map((cell) => ({
    ...cell,
    intensity: maxCount > 0 ? cell.count / maxCount : 0,
  }));
}

export function rankedSections(sections: Record<string, SectionMetric>): SectionMetric[] {
  return Object.values(sections)
    .filter((section) => section.viewed)
    .sort((a, b) => b.timeMs - a.timeMs);
}

import type { Project } from "../types/project";
import { TechBadge } from "./TechBadge";

interface TechLegendProps {
  projects: Project[];
}

export function TechLegend({ projects }: TechLegendProps) {
  const techs = [...new Set(projects.flatMap((p) => p.tech))].sort();
  if (techs.length === 0) return null;

  return (
    <div style={{ width: "100%" }}>
      <div style={label}>Stacks</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {techs.map((t) => (
          <TechBadge key={t} tech={t} size="sm" />
        ))}
      </div>
    </div>
  );
}

const label: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: "#888",
  textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6,
};

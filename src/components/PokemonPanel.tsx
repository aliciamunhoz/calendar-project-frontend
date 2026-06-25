import { usePokemon } from "../hooks/usePokemon";
import { TYPE_COLORS } from "../utils/month-pokemon";
import type { Project } from "../types/project";
import { TechLegend } from "./TechLegend";

interface PokemonPanelProps {
  pokemonId: number;
  monthLabel: string;
  allProjects: Project[];
  editMode: boolean;
  onNewProject: () => void;
}

export function PokemonPanel({ pokemonId, monthLabel, allProjects, editMode, onNewProject }: PokemonPanelProps) {
  const { data, loading } = usePokemon(pokemonId);

  return (
    <aside style={aside}>
      <div style={badge}>{monthLabel}</div>

      <div style={spriteWrap}>
        {loading ? (
          <div style={spritePlaceholder}>
            <span style={{ fontSize: 36, opacity: 0.3 }}>?</span>
          </div>
        ) : data ? (
          <img src={data.sprite} alt={data.name} style={sprite} />
        ) : null}
      </div>

      {data && (
        <>
          <div style={monName}>
            <span style={{ color: "#888", fontSize: 11, marginRight: 4 }}>
              #{String(data.id).padStart(3, "0")}
            </span>
            {data.name}
          </div>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
            {data.types.map((t) => (
              <span key={t} style={{ ...typeBadge, background: TYPE_COLORS[t] ?? "#888" }}>
                {t}
              </span>
            ))}
          </div>
          <div style={divider} />
          <p style={flavorText}>{data.flavorText}</p>
        </>
      )}

      <div style={divider} />
      <TechLegend projects={allProjects} />

      <div style={{ flex: 1 }} />

      {editMode && (
        <button onClick={onNewProject} style={newBtn}>
          + Novo projeto
        </button>
      )}
    </aside>
  );
}

const aside: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
  padding: "16px 12px", overflowY: "auto", borderRight: "2px solid #e8e8e8",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};
const badge: React.CSSProperties = {
  background: "#e3350d", color: "#fff", fontSize: 11, fontWeight: 700,
  padding: "3px 12px", borderRadius: 20,
};
const spriteWrap: React.CSSProperties = {
  width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center",
  background: "#f4f4f4", borderRadius: "50%", border: "3px solid #ffcb05",
};
const spritePlaceholder: React.CSSProperties = {
  width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center",
  background: "#f4f4f4", borderRadius: "50%", border: "3px solid #ffcb05",
};
const sprite: React.CSSProperties = { width: 110, height: 110, objectFit: "contain" };
const monName: React.CSSProperties = {
  fontSize: 14, fontWeight: 700, color: "#222", textAlign: "center",
};
const typeBadge: React.CSSProperties = {
  color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 12,
  textTransform: "capitalize" as const,
};
const divider: React.CSSProperties = {
  width: "100%", height: 2, background: "#ffcb05", borderRadius: 2, flexShrink: 0,
};
const flavorText: React.CSSProperties = {
  fontSize: 11, color: "#555", textAlign: "center", lineHeight: 1.5, margin: 0, padding: "0 2px",
};
const newBtn: React.CSSProperties = {
  width: "100%", background: "#ffcb05", color: "#222", border: "none",
  borderRadius: 8, padding: "9px 0", fontSize: 12, fontWeight: 700,
  cursor: "pointer", fontFamily: "'Segoe UI', system-ui, sans-serif", flexShrink: 0,
};

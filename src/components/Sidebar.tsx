import type { Project, ProjectStatus } from "../types/project";
import { STATUS_LABEL } from "./ProjectForm";

interface SidebarProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  onNew: () => void;
}

const STATUS_ORDER: ProjectStatus[] = ["in_progress", "planning", "paused", "completed"];

const STATUS_DOT: Record<ProjectStatus, string> = {
  in_progress: "#6366f1",
  planning: "#94a3b8",
  completed: "#10b981",
  paused: "#f59e0b",
};

export function Sidebar({ projects, onSelect, onNew }: SidebarProps) {
  const grouped = STATUS_ORDER.reduce<Record<ProjectStatus, Project[]>>(
    (acc, s) => ({ ...acc, [s]: projects.filter((p) => p.status === s) }),
    {} as Record<ProjectStatus, Project[]>
  );

  return (
    <aside style={aside}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#1e293b" }}>Project Calendar</h1>
        <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>{projects.length} projeto{projects.length !== 1 ? "s" : ""}</p>
      </div>

      <button onClick={onNew} style={newBtn}>+ Novo projeto</button>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
        {STATUS_ORDER.map((status) => {
          const list = grouped[status];
          if (list.length === 0) return null;
          return (
            <div key={status}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_DOT[status] }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {STATUS_LABEL[status]}
                </span>
              </div>
              {list.map((p) => (
                <div key={p.id} onClick={() => onSelect(p)} style={projectItem}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                    {p.tech.length > 0 && (
                      <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.tech.slice(0, 3).join(" · ")}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

const aside: React.CSSProperties = {
  width: 220, flexShrink: 0, background: "#f8fafc", borderRight: "1px solid #e2e8f0",
  padding: "24px 16px", display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif",
  overflowY: "auto",
};
const newBtn: React.CSSProperties = {
  width: "100%", background: "#6366f1", color: "#fff", border: "none", borderRadius: 10,
  padding: "10px 0", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "Inter, sans-serif",
};
const projectItem: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8,
  cursor: "pointer", marginBottom: 2, transition: "background 0.15s",
};

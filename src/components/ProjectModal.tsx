import type { Project } from "../types/project";
import { STATUS_LABEL } from "./ProjectForm";
import { TechBadge } from "./TechBadge";

interface ProjectModalProps {
  project: Project;
  editMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ProjectModal({ project, editMode, onEdit, onDelete, onClose }: ProjectModalProps) {
  const sortedPeriods = [...project.periods].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div style={backdrop} onClick={onClose}>
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: project.color, flexShrink: 0 }} />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" }}>{project.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>×</button>
        </div>

        <span style={{
          display: "inline-block", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: `${project.color}22`, color: project.color, marginBottom: 14,
        }}>
          {STATUS_LABEL[project.status]}
        </span>

        {project.description && (
          <p style={{ margin: "0 0 16px", color: "#475569", fontSize: 14, lineHeight: 1.6 }}>{project.description}</p>
        )}

        {project.tech.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {project.tech.map((t) => (
              <TechBadge key={t} tech={t} />
            ))}
          </div>
        )}

        {sortedPeriods.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              Períodos de atuação
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sortedPeriods.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: project.color }} />
                    {i < sortedPeriods.length - 1 && (
                      <div style={{ width: 2, height: 20, background: "#e2e8f0", margin: "2px 0" }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                      {formatDate(p.startDate)}{p.endDate ? ` → ${formatDate(p.endDate)}` : " → em andamento"}
                    </div>
                    {p.note && <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>{p.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" style={linkBtn}>GitHub →</a>
          )}
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer" style={{ ...linkBtn, background: "#f0fdf4", color: "#16a34a" }}>Ver projeto →</a>
          )}
        </div>

        {editMode && (
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
            <button onClick={onDelete} style={deleteBtn}>Excluir</button>
            <button onClick={onEdit} style={editBtn}>Editar</button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const backdrop: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex",
  alignItems: "center", justifyContent: "center", zIndex: 100,
};
const card: React.CSSProperties = {
  background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 480,
  fontFamily: "'Segoe UI', system-ui, sans-serif", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  maxHeight: "90vh", overflowY: "auto", border: "3px solid #c12d0b",
};
const linkBtn: React.CSSProperties = {
  padding: "5px 14px", borderRadius: 8, background: "#f8fafc", color: "#475569",
  textDecoration: "none", fontSize: 13, fontWeight: 500, border: "1px solid #e2e8f0",
};
const editBtn: React.CSSProperties = {
  background: "#e3350d", color: "#fff", border: "none", borderRadius: 8,
  padding: "8px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Segoe UI', system-ui, sans-serif",
};
const deleteBtn: React.CSSProperties = {
  background: "#fff", color: "#e3350d", border: "1px solid #e3350d", borderRadius: 8,
  padding: "8px 18px", fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "'Segoe UI', system-ui, sans-serif",
};

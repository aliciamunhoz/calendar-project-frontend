import { useState } from "react";
import type { Period, PeriodFormData, Project, ProjectFormData, ProjectStatus } from "../types/project";
import { PeriodsEditor } from "./PeriodsEditor";
import { TechBadge } from "./TechBadge";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: "Planejando",
  in_progress: "Em andamento",
  completed: "Concluído",
  paused: "Pausado",
};

const STATUS_COLOR: Record<ProjectStatus, string> = {
  planning: "#94a3b8",
  in_progress: "#6366f1",
  completed: "#10b981",
  paused: "#f59e0b",
};

const PRESET_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];

interface ProjectFormProps {
  initial?: Project;
  onSave: (data: ProjectFormData) => void;
  onCancel: () => void;
  onAddPeriod?: (data: PeriodFormData) => void;
  onUpdatePeriod?: (periodId: string, data: Partial<PeriodFormData>) => void;
  onRemovePeriod?: (periodId: string) => void;
}

export function ProjectForm({ initial, onSave, onCancel, onAddPeriod, onUpdatePeriod, onRemovePeriod }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    status: initial?.status ?? "planning",
    tech: initial?.tech ?? [],
    url: initial?.url ?? "",
    repoUrl: initial?.repoUrl ?? "",
    color: initial?.color ?? "#6366f1",
  });
  const [techInput, setTechInput] = useState("");
  const [localPeriods, setLocalPeriods] = useState<Period[]>(initial?.periods ?? []);

  function set<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addTech(e: React.KeyboardEvent) {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      set("tech", [...form.tech, techInput.trim()]);
      setTechInput("");
    }
  }

  function removeTech(t: string) {
    set("tech", form.tech.filter((x) => x !== t));
  }

  // When no projectId yet (create mode), manage periods locally
  function handleAddPeriod(data: PeriodFormData) {
    if (onAddPeriod) {
      onAddPeriod(data);
    } else {
      const fake: Period = {
        id: `local-${Date.now()}`,
        projectId: "",
        startDate: new Date(data.startDate + "T00:00:00").toISOString(),
        endDate: data.endDate ? new Date(data.endDate + "T23:59:59").toISOString() : null,
        note: data.note ?? null,
        createdAt: new Date().toISOString(),
      };
      setLocalPeriods((ps) => [...ps, fake]);
    }
  }

  function handleUpdatePeriod(periodId: string, data: Partial<PeriodFormData>) {
    if (onUpdatePeriod) {
      onUpdatePeriod(periodId, data);
    } else {
      setLocalPeriods((ps) =>
        ps.map((p) =>
          p.id === periodId
            ? {
                ...p,
                startDate: data.startDate ? new Date(data.startDate + "T00:00:00").toISOString() : p.startDate,
                endDate: data.endDate ? new Date(data.endDate + "T23:59:59").toISOString() : p.endDate,
                note: data.note ?? p.note,
              }
            : p
        )
      );
    }
  }

  function handleRemovePeriod(periodId: string) {
    if (onRemovePeriod) {
      onRemovePeriod(periodId);
    } else {
      setLocalPeriods((ps) => ps.filter((p) => p.id !== periodId));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...form,
      description: form.description || undefined,
      url: form.url || undefined,
      repoUrl: form.repoUrl || undefined,
      // In create mode, pass local periods to be created along with the project
      ...((!initial && localPeriods.length > 0) ? {
        periods: localPeriods.map((p) => ({
          startDate: p.startDate,
          endDate: p.endDate ?? undefined,
          note: p.note ?? undefined,
        })),
      } : {}),
    } as ProjectFormData & { periods?: any[] });
  }

  const periodsToShow = onAddPeriod ? (initial?.periods ?? []) : localPeriods;

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={fieldGroup}>
        <label style={labelStyle}>Título *</label>
        <input style={inputStyle} required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Nome do projeto" />
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Descrição</label>
        <textarea style={{ ...inputStyle, height: 72, resize: "vertical" }} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Breve descrição..." />
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Status</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("status", s)}
              style={{
                padding: "4px 12px", borderRadius: 20, border: "2px solid",
                borderColor: form.status === s ? STATUS_COLOR[s] : "#ddd",
                background: form.status === s ? STATUS_COLOR[s] : "#fff",
                color: form.status === s ? "#fff" : "#555",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
              }}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Tecnologias (Enter para adicionar)</label>
        <input
          style={inputStyle}
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={addTech}
          placeholder="TypeScript, React, Prisma..."
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
          {form.tech.map((t) => (
            <TechBadge key={t} tech={t} onRemove={() => removeTech(t)} />
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
        <PeriodsEditor
          periods={periodsToShow}
          onAdd={handleAddPeriod}
          onUpdate={handleUpdatePeriod}
          onRemove={handleRemovePeriod}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={fieldGroup}>
          <label style={labelStyle}>URL do projeto</label>
          <input style={inputStyle} type="url" value={form.url ?? ""} onChange={(e) => set("url", e.target.value)} placeholder="https://..." />
        </div>
        <div style={fieldGroup}>
          <label style={labelStyle}>Repositório</label>
          <input style={inputStyle} type="url" value={form.repoUrl ?? ""} onChange={(e) => set("repoUrl", e.target.value)} placeholder="https://github.com/..." />
        </div>
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Cor no calendário</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set("color", c)}
              style={{
                width: 28, height: 28, borderRadius: "50%", background: c,
                border: form.color === c ? "3px solid #1e293b" : "3px solid transparent", cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
        <button type="button" onClick={onCancel} style={cancelBtn}>Cancelar</button>
        <button type="submit" style={saveBtn}>Salvar</button>
      </div>
    </form>
  );
}

const fieldGroup: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: "#475569" };
const inputStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 14,
  fontFamily: "Inter, sans-serif", outline: "none", color: "#1e293b", background: "#fff",
};
const saveBtn: React.CSSProperties = {
  background: "#e3350d", color: "#fff", border: "none", borderRadius: 8,
  padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Segoe UI', system-ui, sans-serif",
};
const cancelBtn: React.CSSProperties = {
  background: "#fff", color: "#555", border: "1px solid #ddd", borderRadius: 8,
  padding: "9px 20px", fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "'Segoe UI', system-ui, sans-serif",
};

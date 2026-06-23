import { useState } from "react";
import type { Period, PeriodFormData } from "../types/project";

interface PeriodsEditorProps {
  periods: Period[];
  projectId?: string;
  onAdd: (data: PeriodFormData) => void;
  onUpdate: (periodId: string, data: Partial<PeriodFormData>) => void;
  onRemove: (periodId: string) => void;
}

const EMPTY: PeriodFormData = { startDate: "", endDate: "", note: "" };

export function PeriodsEditor({ periods, onAdd, onUpdate, onRemove }: PeriodsEditorProps) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<PeriodFormData>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<PeriodFormData>(EMPTY);

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.startDate) return;
    onAdd({ startDate: form.startDate, endDate: form.endDate || undefined, note: form.note || undefined });
    setForm(EMPTY);
    setAdding(false);
  }

  function startEdit(p: Period) {
    setEditingId(p.id);
    setEditForm({
      startDate: p.startDate.slice(0, 10),
      endDate: p.endDate ? p.endDate.slice(0, 10) : "",
      note: p.note ?? "",
    });
  }

  function submitEdit(e: React.FormEvent, periodId: string) {
    e.preventDefault();
    onUpdate(periodId, {
      startDate: editForm.startDate,
      endDate: editForm.endDate || undefined,
      note: editForm.note || undefined,
    });
    setEditingId(null);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <label style={labelStyle}>Períodos de atuação</label>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} style={addBtn}>
            + Adicionar período
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {periods.map((p, i) => (
          <div key={p.id}>
            {editingId === p.id ? (
              <form onSubmit={(e) => submitEdit(e, p.id)} style={periodCard}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={miniLabel}>Início *</div>
                    <input
                      type="date"
                      required
                      style={inputStyle}
                      value={editForm.startDate}
                      onChange={(e) => setEditForm((f) => ({ ...f, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div style={miniLabel}>Fim</div>
                    <input
                      type="date"
                      style={inputStyle}
                      value={editForm.endDate}
                      onChange={(e) => setEditForm((f) => ({ ...f, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={miniLabel}>Nota (opcional)</div>
                  <input
                    style={inputStyle}
                    placeholder="ex: adicionei autenticação"
                    value={editForm.note}
                    onChange={(e) => setEditForm((f) => ({ ...f, note: e.target.value }))}
                  />
                </div>
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setEditingId(null)} style={cancelSmall}>Cancelar</button>
                  <button type="submit" style={saveSmall}>Salvar</button>
                </div>
              </form>
            ) : (
              <div style={{ ...periodCard, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                    {formatDate(p.startDate)}{p.endDate ? ` → ${formatDate(p.endDate)}` : " → em andamento"}
                  </div>
                  {p.note && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{p.note}</div>}
                  <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 2 }}>Período {i + 1}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button type="button" onClick={() => startEdit(p)} style={iconBtn}>✏️</button>
                  <button type="button" onClick={() => onRemove(p.id)} style={{ ...iconBtn, color: "#ef4444" }}>×</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {periods.length === 0 && !adding && (
          <div style={{ fontSize: 13, color: "#94a3b8", padding: "10px 0", textAlign: "center" }}>
            Nenhum período ainda. Adicione um para aparecer no calendário.
          </div>
        )}

        {adding && (
          <form onSubmit={submitAdd} style={periodCard}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div>
                <div style={miniLabel}>Início *</div>
                <input
                  type="date"
                  required
                  style={inputStyle}
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div>
                <div style={miniLabel}>Fim</div>
                <input
                  type="date"
                  style={inputStyle}
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={miniLabel}>Nota (opcional)</div>
              <input
                style={inputStyle}
                placeholder="ex: versão inicial, refatoração, novo feature..."
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              />
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => { setAdding(false); setForm(EMPTY); }} style={cancelSmall}>Cancelar</button>
              <button type="submit" style={saveSmall}>Adicionar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: "#475569" };
const miniLabel: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: "#64748b", marginBottom: 3 };
const periodCard: React.CSSProperties = {
  border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 12px", background: "#f8fafc",
};
const inputStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 10px", fontSize: 13,
  fontFamily: "Inter, sans-serif", color: "#1e293b", background: "#fff", width: "100%", boxSizing: "border-box",
};
const addBtn: React.CSSProperties = {
  background: "none", border: "1px solid #6366f1", color: "#6366f1", borderRadius: 6,
  padding: "3px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif",
};
const saveSmall: React.CSSProperties = {
  background: "#6366f1", color: "#fff", border: "none", borderRadius: 6,
  padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif",
};
const cancelSmall: React.CSSProperties = {
  background: "#fff", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 6,
  padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "Inter, sans-serif",
};
const iconBtn: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: "2px 4px",
};

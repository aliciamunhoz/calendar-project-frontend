import { useEffect, useRef, useState } from "react";
import type { Period, PeriodFormData, Project, ProjectFormData } from "./types/project";
import { api } from "./services/api";
import { Calendar } from "./components/Calendar";
import { PokemonPanel } from "./components/PokemonPanel";
import { ProjectModal } from "./components/ProjectModal";
import { ProjectForm } from "./components/ProjectForm";
import { getPokemonId } from "./utils/month-pokemon";

type Modal =
  | { type: "view"; project: Project }
  | { type: "create" }
  | { type: "edit"; project: Project }
  | null;

const MONTHS_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

export function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [editMode, setEditMode] = useState(
    () => sessionStorage.getItem("edit_mode") === "true"
  );
  const [lockPrompt, setLockPrompt] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const pwRef = useRef<HTMLInputElement>(null);

  function toggleLock() {
    if (editMode) {
      sessionStorage.removeItem("edit_mode");
      setEditMode(false);
    } else {
      setPwInput("");
      setPwError(false);
      setLockPrompt(true);
      setTimeout(() => pwRef.current?.focus(), 50);
    }
  }

  function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwInput === import.meta.env.VITE_EDIT_PASSWORD) {
      sessionStorage.setItem("edit_mode", "true");
      setEditMode(true);
      setLockPrompt(false);
    } else {
      setPwError(true);
    }
  }

  useEffect(() => {
    api.list().then(setProjects).finally(() => setLoading(false));
  }, []);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function updateProjectInList(updated: Project) {
    setProjects(ps => ps.map(p => p.id === updated.id ? updated : p));
  }

  async function handleSave(data: ProjectFormData & { periods?: any[] }) {
    if (modal?.type === "edit") {
      const { periods: _p, ...rest } = data;
      const updated = await api.update(modal.project.id, rest);
      updateProjectInList({ ...updated, periods: modal.project.periods });
    } else {
      const created = await api.create(data);
      setProjects(ps => [...ps, created]);
    }
    setModal(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este projeto?")) return;
    await api.remove(id);
    setProjects(ps => ps.filter(p => p.id !== id));
    setModal(null);
  }

  async function handleAddPeriod(projectId: string, data: PeriodFormData) {
    const newPeriod = await api.periods.add(projectId, data);
    const patch = (p: Project) => p.id === projectId ? { ...p, periods: [...p.periods, newPeriod] } : p;
    setProjects(ps => ps.map(patch));
    if (modal?.type === "edit" && modal.project.id === projectId)
      setModal({ type: "edit", project: { ...modal.project, periods: [...modal.project.periods, newPeriod] } });
  }

  async function handleUpdatePeriod(projectId: string, periodId: string, data: Partial<PeriodFormData>) {
    const updated = await api.periods.update(projectId, periodId, data);
    const patchPeriod = (pd: Period) => pd.id === periodId ? updated : pd;
    setProjects(ps => ps.map(p => p.id === projectId ? { ...p, periods: p.periods.map(patchPeriod) } : p));
    if (modal?.type === "edit" && modal.project.id === projectId)
      setModal({ type: "edit", project: { ...modal.project, periods: modal.project.periods.map(patchPeriod) } });
  }

  async function handleRemovePeriod(projectId: string, periodId: string) {
    await api.periods.remove(projectId, periodId);
    setProjects(ps => ps.map(p => p.id === projectId ? { ...p, periods: p.periods.filter(pd => pd.id !== periodId) } : p));
    if (modal?.type === "edit" && modal.project.id === projectId)
      setModal({ type: "edit", project: { ...modal.project, periods: modal.project.periods.filter(pd => pd.id !== periodId) } });
  }

  const pokemonId = getPokemonId(year, month);
  const monthLabel = `${MONTHS_PT[month]} ${year}`;

  // projects that have any period touching this month
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const monthProjects = projects.filter(p =>
    p.periods.some(pd => {
      const s = new Date(pd.startDate);
      const e = pd.endDate ? new Date(pd.endDate) : s;
      return s <= monthEnd && e >= monthStart;
    })
  );

  return (
    <div style={appWrap}>
      {/* Pokédex Header */}
      <header style={header}>
        <div style={orb} />
        <div style={dots}>
          <div style={{ ...dot, background: "#ff5959" }} />
          <div style={{ ...dot, background: "#ffcb05" }} />
          <div style={{ ...dot, background: "#5cd65c" }} />
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={titleText}>Dev em Progresso</div>
          <div style={subtitleText}>no que estou trabalhando agora</div>
        </div>
        <a
          href="https://portfolio-frontend-amfc.vercel.app"

          style={portfolioBtn}
        >
          ← portfólio
        </a>
        <button
          onClick={toggleLock}
          title={editMode ? "Sair do modo edição" : "Entrar no modo edição"}
          style={lockBtn}
        >
          {editMode ? "🔓" : "🔒"}
        </button>
      </header>

      {/* Screen */}
      <div style={screen}>
        <div style={screenInner}>
          <PokemonPanel
            pokemonId={pokemonId}
            monthLabel={monthLabel}
            projects={monthProjects}
            editMode={editMode}
            onSelectProject={p => setModal({ type: "view", project: p })}
            onNewProject={() => setModal({ type: "create" })}
          />
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 14 }}>
              Carregando...
            </div>
          ) : (
            <Calendar
              projects={projects}
              year={year}
              month={month}
              onSelect={p => setModal({ type: "view", project: p })}
              onPrev={prevMonth}
              onNext={nextMonth}
            />
          )}
        </div>
      </div>


      {/* Modals */}
      {modal?.type === "view" && (
        <ProjectModal
          project={modal.project}
          editMode={editMode}
          onEdit={() => setModal({ type: "edit", project: modal.project })}
          onDelete={() => handleDelete(modal.project.id)}
          onClose={() => setModal(null)}
        />
      )}

      {/* Prompt de senha */}
      {lockPrompt && (
        <div style={overlay} onClick={() => setLockPrompt(false)}>
          <form style={pwCard} onClick={e => e.stopPropagation()} onSubmit={submitPassword}>
            <div style={{ fontSize: 28, textAlign: "center", marginBottom: 12 }}>🔒</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#e3350d", textAlign: "center", marginBottom: 16 }}>
              Modo edição
            </div>
            <input
              ref={pwRef}
              type="password"
              placeholder="Senha"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              style={{ ...pwInput_style, borderColor: pwError ? "#e3350d" : "#ddd" }}
            />
            {pwError && (
              <div style={{ fontSize: 12, color: "#e3350d", marginTop: 4 }}>Senha incorreta.</div>
            )}
            <button type="submit" style={{ ...btnYellow, width: "100%", marginTop: 12, padding: "10px 0" }}>
              Entrar
            </button>
          </form>
        </div>
      )}

      {(modal?.type === "create" || modal?.type === "edit") && (
        <div style={overlay} onClick={() => setModal(null)}>
          <div style={formCard} onClick={e => e.stopPropagation()}>
            <div style={formHeader}>
              <h2 style={formTitle}>
                {modal.type === "create" ? "Novo projeto" : "Editar projeto"}
              </h2>
              <button onClick={() => setModal(null)} style={closeBtn}>×</button>
            </div>
            <ProjectForm
              initial={modal.type === "edit" ? modal.project : undefined}
              onSave={handleSave}
              onCancel={() => setModal(null)}
              onAddPeriod={modal.type === "edit" ? d => handleAddPeriod(modal.project.id, d) : undefined}
              onUpdatePeriod={modal.type === "edit" ? (pid, d) => handleUpdatePeriod(modal.project.id, pid, d) : undefined}
              onRemovePeriod={modal.type === "edit" ? pid => handleRemovePeriod(modal.project.id, pid) : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const appWrap: React.CSSProperties = {
  display: "flex", flexDirection: "column", height: "100vh",
  background: "#e3350d", fontFamily: "'Segoe UI', system-ui, sans-serif",
};
const header: React.CSSProperties = {
  background: "#e3350d", padding: "12px 20px", display: "flex", alignItems: "center",
  gap: 14, borderBottom: "4px solid #c12d0b", flexShrink: 0,
};
const orb: React.CSSProperties = {
  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
  background: "radial-gradient(circle at 32% 30%, #7fd4ff, #3b4cca)",
  border: "4px solid #fff",
};
const dots: React.CSSProperties = { display: "flex", gap: 7 };
const dot: React.CSSProperties = { width: 13, height: 13, borderRadius: "50%", border: "2px solid #fff" };
const titleText: React.CSSProperties = { color: "#fff", fontSize: 18, fontWeight: 700 };
const subtitleText: React.CSSProperties = { color: "rgba(255,255,255,0.75)", fontSize: 12 };
const screen: React.CSSProperties = {
  flex: 1, minHeight: 0, background: "#f4f4f4", borderTop: "5px solid #c12d0b",
  borderBottom: "5px solid #c12d0b", overflow: "hidden", padding: 14,
};
const screenInner: React.CSSProperties = {
  background: "#fff", height: "100%", borderRadius: 10,
  border: "3px solid #c12d0b", boxShadow: "inset 0 0 0 5px #f4f4f4",
  display: "grid", gridTemplateColumns: "190px 1fr", overflow: "hidden",
};
const btnYellow: React.CSSProperties = {
  background: "#ffcb05", color: "#222", border: "none", borderRadius: 8,
  padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
};
const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
};
const formCard: React.CSSProperties = {
  background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 520,
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto",
  border: "3px solid #c12d0b",
};
const formHeader: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20,
};
const formTitle: React.CSSProperties = {
  margin: 0, fontSize: 18, fontWeight: 700, color: "#e3350d",
};
const closeBtn: React.CSSProperties = {
  background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888",
};
const portfolioBtn: React.CSSProperties = {
  color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500,
  textDecoration: "none", flexShrink: 0, padding: "4px 8px",
  borderRadius: 6, border: "1px solid rgba(255,255,255,0.25)",
};
const lockBtn: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  fontSize: 14, opacity: 0.4, flexShrink: 0, padding: "0 2px",
  lineHeight: 1,
};
const pwCard: React.CSSProperties = {
  background: "#fff", borderRadius: 14, padding: "28px 24px", width: "100%", maxWidth: 320,
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)", border: "3px solid #c12d0b",
};
const pwInput_style: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd",
  fontSize: 15, fontFamily: "'Segoe UI', system-ui, sans-serif", outline: "none",
};

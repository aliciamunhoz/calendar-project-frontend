import type { Project } from "../types/project";
import { STATUS_LABEL } from "./ProjectForm";

interface CalendarProps {
  projects: Project[];
  year: number;
  month: number;
  onSelect: (project: Project) => void;
  onPrev: () => void;
  onNext: () => void;
}

const MONTHS_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const WEEKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function projectsForDay(projects: Project[], year: number, month: number, day: number) {
  const date = new Date(year, month, day);
  const result: Array<{ project: Project; note?: string | null }> = [];
  for (const project of projects) {
    for (const period of project.periods) {
      const s = new Date(period.startDate);
      const e = period.endDate ? new Date(period.endDate) : s;
      const sd = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      const ed = new Date(e.getFullYear(), e.getMonth(), e.getDate());
      if (date >= sd && date <= ed) {
        result.push({ project, note: period.note });
        break;
      }
    }
  }
  return result;
}

export function Calendar({ projects, year, month, onSelect, onPrev, onNext }: CalendarProps) {
  const today = new Date();
  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);
  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div style={wrap}>
      <div style={calHeader}>
        <button onClick={onPrev} style={navBtn}>‹</button>
        <span style={calTitle}>{MONTHS_PT[month]} {year}</span>
        <button onClick={onNext} style={navBtn}>›</button>
      </div>

      <div style={grid7}>
        {WEEKDAYS.map((d) => (
          <div key={d} style={weekday}>{d}</div>
        ))}
      </div>

      <div style={grid7}>
        {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const entries = projectsForDay(projects, year, month, day);
          return (
            <div key={day} style={{ ...dayCell, ...(isToday(day) ? todayCell : {}) }}>
              <div style={{ ...dayNum, ...(isToday(day) ? todayNum : {}) }}>{day}</div>
              {entries.map(({ project, note }) => (
                <div
                  key={project.id}
                  onClick={() => onSelect(project)}
                  title={`${project.title} — ${STATUS_LABEL[project.status]}${note ? ` (${note})` : ""}`}
                  style={{ ...eventBar, background: project.color }}
                >
                  {project.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: 8, padding: 18, overflowY: "auto",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};
const calHeader: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4,
};
const calTitle: React.CSSProperties = {
  fontSize: 16, fontWeight: 700, color: "#3b4cca",
};
const navBtn: React.CSSProperties = {
  background: "#e3350d", color: "#fff", border: "none", borderRadius: 6,
  width: 28, height: 28, fontSize: 16, cursor: "pointer", fontWeight: 700,
  display: "flex", alignItems: "center", justifyContent: "center",
};
const grid7: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 3,
};
const weekday: React.CSSProperties = {
  textAlign: "center" as const, fontSize: 10, fontWeight: 700, color: "#888", paddingBottom: 4,
};
const dayCell: React.CSSProperties = {
  minHeight: 54, border: "1px solid #e8e8e8", borderRadius: 6,
  padding: "3px 4px", background: "#fafafa", overflow: "hidden", minWidth: 0,
};
const todayCell: React.CSSProperties = {
  border: "2px solid #3b4cca", background: "#eef0ff",
};
const dayNum: React.CSSProperties = {
  fontSize: 11, color: "#555", marginBottom: 2, fontWeight: 500,
};
const todayNum: React.CSSProperties = {
  color: "#3b4cca", fontWeight: 700,
};
const eventBar: React.CSSProperties = {
  fontSize: 9, fontWeight: 700, color: "#fff", padding: "1px 4px", borderRadius: 3,
  marginBottom: 1, whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
  cursor: "pointer",
};

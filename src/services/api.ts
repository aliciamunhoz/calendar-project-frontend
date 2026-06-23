import type { Period, PeriodFormData, Project, ProjectFormData } from "../types/project";

const BASE = "/projects";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  list: () => request<Project[]>(BASE),
  get: (id: string) => request<Project>(`${BASE}/${id}`),
  create: (data: ProjectFormData) =>
    request<Project>(BASE, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ProjectFormData>) =>
    request<Project>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`${BASE}/${id}`, { method: "DELETE" }),

  periods: {
    add: (projectId: string, data: PeriodFormData) =>
      request<Period>(`${BASE}/${projectId}/periods`, {
        method: "POST",
        body: JSON.stringify({
          startDate: new Date(data.startDate + "T00:00:00").toISOString(),
          endDate: data.endDate ? new Date(data.endDate + "T23:59:59").toISOString() : undefined,
          note: data.note || undefined,
        }),
      }),
    update: (projectId: string, periodId: string, data: Partial<PeriodFormData>) =>
      request<Period>(`${BASE}/${projectId}/periods/${periodId}`, {
        method: "PUT",
        body: JSON.stringify({
          startDate: data.startDate ? new Date(data.startDate + "T00:00:00").toISOString() : undefined,
          endDate: data.endDate ? new Date(data.endDate + "T23:59:59").toISOString() : undefined,
          note: data.note,
        }),
      }),
    remove: (projectId: string, periodId: string) =>
      request<void>(`${BASE}/${projectId}/periods/${periodId}`, { method: "DELETE" }),
  },
};

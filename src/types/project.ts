export type ProjectStatus = "planning" | "in_progress" | "completed" | "paused";

export interface Period {
  id: string;
  projectId: string;
  startDate: string;
  endDate?: string | null;
  note?: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  tech: string[];
  url?: string | null;
  repoUrl?: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
  periods: Period[];
}

export type ProjectFormData = {
  title: string;
  description?: string;
  status: ProjectStatus;
  tech: string[];
  url?: string;
  repoUrl?: string;
  color: string;
};

export type PeriodFormData = {
  startDate: string;
  endDate?: string;
  note?: string;
};

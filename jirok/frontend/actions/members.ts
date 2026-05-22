"use server";

import { api } from "@/lib/api";

export interface ProjectMember {
  id: number;
  name: string;
  surname?: string | null;
  email: string;
  projectId: number;
}

export async function getProjectMembers(
  projectId: string,
): Promise<ProjectMember[]> {
  const response = await api(`/projects/${projectId}/members`);
  if (!response.ok) {
    throw new Error("Failed to load project members");
  }
  return response.json();
}

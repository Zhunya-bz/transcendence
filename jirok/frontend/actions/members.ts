"use server";

export interface ProjectMember {
  id: number;
  name: string;
  surname?: string | null;
}

export async function getProjectMembers(
  projectId: string,
): Promise<ProjectMember[]> {
  const response = await fetch(
    `http://backend:3001/projects/${projectId}/members`,
  );
  if (!response.ok) {
    throw new Error("Failed to load project members");
  }
  return response.json();
}

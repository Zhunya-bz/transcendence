"use client";

import type { Project } from "@/types/prisma";
import { parseError } from "./issues";

export const createProject = async (data: { name: string }): Promise<Project> => {
  const response = await fetch("http://localhost:3001/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to create project"));
  }
  return await response.json();
};

export async function getCurrentProject(): Promise<Project[]> {
  const response = await fetch("http://localhost:3001/projects", {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to get current project"));
  }
  return response.json();
}

export async function updateProject(
  projectId: number,
  data: { name: string },
) {
  const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to update project"));
  }

  return response.json();
}

export async function deleteProject(projectId: number) {
  const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to delete project"));
  }

  return response.json();
}

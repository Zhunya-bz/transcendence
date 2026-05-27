"use client";

import type { Project } from "@/types/prisma";

async function parseError(response: Response, fallbackMessage: string) {
  const message = await response.text();
  return message || `${response.status}: ${response.statusText}` || fallbackMessage;
}

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
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

export async function getCurrentProject(): Promise<Project[]> {
  const response = await fetch("http://localhost:3001/projects", {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function updateProject(
  currentUserId: number,
  projectId: number,
  data: { name: string },
) {
  const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": String(currentUserId),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to update project"));
  }

  return response.json();
}

export async function deleteProject(currentUserId: number, projectId: number) {
  const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "x-user-id": String(currentUserId),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to delete project"));
  }

  return response.json();
}

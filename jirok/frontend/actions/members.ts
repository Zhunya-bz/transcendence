"use client";

// import { api } from "@/lib/api";

export async function getProjectMembers(projectId: string) {
  const response = await fetch(`http://localhost:3001/projects/${projectId}/members`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to load project members");
  }
  return response.json();
}

export async function addProjectMemberByEmail(projectId: string, email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const response = await fetch(`http://localhost:3001/projects/${projectId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: normalizedEmail,
      role: "member",
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `${response.status}: ${response.statusText}`);
  }

  return response.json();
}

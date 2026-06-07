"use client";

import { getBackendUrl } from "@/lib/backend";
import type { MemberPayload, UserProject, UserRole } from "@/types/prisma";
import { parseError } from "./issues";

export async function getProjectMembers(projectId: string): Promise<UserProject[]> {
  const response = await fetch(`/api/projects/${projectId}/members`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to load project members"));
  }
  return response.json();
}


export async function addProjectMember(projectId: string, payload: MemberPayload) {
  const response = await fetch(`/api/projects/${projectId}/members/by-email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to add project member"));
  }

  return response.json();
}

export async function updateProjectMemberRole(
  projectId: string,
  userId: number,
  role: UserRole,
) {
  const response = await fetch(`/api/projects/${projectId}/members/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to update member role"));
  }

  return response.json();
}

export async function removeProjectMember(projectId: string, userId: number) {
  const response = await fetch(`/api/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to remove project member"));
  }

  return response.json();
}

"use client";

export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
};

export type ProjectMemberUser = {
  id: number;
  name: string;
  surname?: string | null;
  email: string;
  avatarUrl?: string | null;
};

export type ProjectMember = {
  userId: number;
  projectId: number;
  role: Role;
  joinedAt?: string;
  user?: ProjectMemberUser;
};

export type MemberPayload = {
  email: string;
  role?: Role;
};

async function parseError(response: Response, fallbackMessage: string) {
  const message = await response.text();
  return message || `${response.status}: ${response.statusText}` || fallbackMessage;
}

export async function getProjectMembers(currentUserId: number, projectId: string): Promise<ProjectMember[]> {
  const response = await fetch(`http://localhost:3001/projects/${projectId}/members`, {
    credentials: "include",
    headers: {
      "x-user-id": String(currentUserId),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to load project members");
  }
  return response.json();
}


export async function addProjectMember(currentUserId: number, projectId: string, payload: MemberPayload) {
  const response = await fetch(`http://localhost:3001/projects/${projectId}/members/by-email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": String(currentUserId),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to add project member"));
  }

  return response.json();
}

export async function updateProjectMemberRole(currentUserId: number,
  projectId: string,
  userId: number,
  role: Role,
) {
  const response = await fetch(`http://localhost:3001/projects/${projectId}/members/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": String(currentUserId),
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to update member role"));
  }

  return response.json();
}

export async function removeProjectMember(currentUserId: number, projectId: string, userId: number) {
  const response = await fetch(`http://localhost:3001/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "x-user-id": String(currentUserId),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to remove project member"));
  }

  return response.json();
}

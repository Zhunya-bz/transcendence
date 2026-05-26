"use client";

export type ProjectMemberRole = "Admin" | "Member" | "VIEWER";

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
  role: ProjectMemberRole;
  joinedAt?: string;
  user?: ProjectMemberUser;
};

export type MockUser = ProjectMemberUser;

export const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: "PAUL",
    surname: "SMITH",
    email: "user@student.42.fr",
    avatarUrl: null,
  },
  {
    id: 2,
    name: "John",
    surname: "Doe",
    email: "user2@student.42.fr",
    avatarUrl: null,
  },
  {
    id: 3,
    name: "Bob",
    surname: "The Builder",
    email: "user3@student.42.fr",
    avatarUrl: null,
  },
  {
    id: 4,
    name: "Adam",
    surname: "Sandler",
    email: "user4@student.42.fr",
    avatarUrl: null,
  },
  {
    id: 5,
    name: "Charlie",
    surname: "Chaplin",
    email: "user5@student.42.fr",
    avatarUrl: null,
  },
];

type MemberPayload = {
  userId: number;
  role: ProjectMemberRole;
};

async function getCurrentUserId() {
  const response = await fetch("http://localhost:3001/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to resolve the current user");
  }

  const currentUser = await response.json();

  if (typeof currentUser?.id !== "number") {
    throw new Error("Unable to resolve the current user");
  }

  return currentUser.id;
}

async function parseError(response: Response, fallbackMessage: string) {
  const message = await response.text();
  return message || `${response.status}: ${response.statusText}` || fallbackMessage;
}

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  const currentUserId = await getCurrentUserId();
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

export async function getMockUsers(): Promise<MockUser[]> {
  return MOCK_USERS;
}

export async function addProjectMember(projectId: string, payload: MemberPayload) {
  const currentUserId = await getCurrentUserId();
  const response = await fetch(`http://localhost:3001/projects/${projectId}/members`, {
    method: "POST",
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

export async function updateProjectMemberRole(
  projectId: string,
  userId: number,
  role: ProjectMemberRole,
) {
  const currentUserId = await getCurrentUserId();
  const response = await fetch(`http://localhost:3001/projects/${projectId}/members/${userId}`, {
    method: "PUT",
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

export async function removeProjectMember(projectId: string, userId: number) {
  const currentUserId = await getCurrentUserId();
  const response = await fetch(`http://localhost:3001/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
    headers: {
      "x-user-id": String(currentUserId),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to remove project member"));
  }

  return response.json();
}

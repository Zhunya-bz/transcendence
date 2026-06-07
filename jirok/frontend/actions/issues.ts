"use client";

import { getBackendUrl } from "@/lib/backend";
import { Issue } from "@/types/prisma";

type CreateIssueInput = {
  projectId: number;
  title: string;
  status: string;
  description?: string;
  type: string;
  priority: string;
  assigneeId?: number | null;
  reporterId: number;
};

export const parseError = async (response: Response, fallbackMessage: string) => {
  const message = await response.json();
  return message.message ? message.message : `${response.status}: ${response.statusText}` || fallbackMessage;
};

export async function getBacklogTasks(projectId: string): Promise<Issue[]> {
  const response = await fetch(`/api/projects/${projectId}/issues`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(await parseError(response, "Failed to fetch backlog tasks"));
    }
    return await response.json();
}

export async function createIssue(data: CreateIssueInput): Promise<Issue> {
  try {
    const response = await fetch(`/api/projects/${data.projectId}/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "Failed to create issue"));
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTask(projectId: string, issueId: string): Promise<Issue> {
  return await fetch(`/api/projects/${projectId}/issues/${issueId}`, {
    credentials: "include"
  }).then(res => res.json())
}

export async function deleteTask(projectId: string, issueId: string): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}/issues/${issueId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to delete issue"));
  }
}

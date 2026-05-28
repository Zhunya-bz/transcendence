"use client";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export const DEFAULT: Partial<TaskItem> = {
  status: "TODO",
  priority: "MEDIUM",
  type: "TASK",
}

export interface TaskItem {
  id: number;
  type: "BUG" | "TASK" | "STORY";
  title: string;
  assigneeId: number;
  status: TaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  projectId: number;
}

export async function getBacklogTasks(projectId: string): Promise<TaskItem[]> {
  const response = await fetch(`http://localhost:3001/projects/${projectId}/issues`, {
    credentials: "include"
  });
  if (!response.ok) {
    throw new Error("Failed to load backlog");
  }
  return await response.json();
}

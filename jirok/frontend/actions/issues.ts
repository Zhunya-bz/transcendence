"use server";

export interface TaskItem {
  id: number;
  type: "bug" | "task" | "story";
  title: string;
  assigneeId: number;
  status: "todo" | "in_progress" | "in_review" | "done";
  priority: "low" | "medium" | "high";
  createdAt: string;
  projectId: number;
}

const mockTasks: TaskItem[] = [
  {
    id: 1,
    type: "story",
    title: "User can create a project",
    assigneeId: 3,
    status: "in_progress",
    priority: "high",
    createdAt: "2026-05-12",
    projectId: 1,
  },
  {
    id: 2,
    type: "bug",
    title: "Fix incorrect sidebar highlight",
    assigneeId: 2,
    status: "todo",
    priority: "medium",
    createdAt: "2026-05-13",
        projectId: 1,
  },
  {
    id: 3,
    type: "task",
    title: "Add project dashboard metrics",
    assigneeId: 1,
    status: "in_review",
    priority: "low",
    createdAt: "2026-05-14",
        projectId: 1,
  },
  {
    id: 4,
    type: "bug",
    title: "Resolve API timeout on backlog",
    assigneeId: 2,
    status: "done",
    priority: "high",
    createdAt: "2026-05-15",
        projectId: 1,
  },
];

export async function getBacklogTasks(projectId: string): Promise<TaskItem[]> {
  try {
    const response = await fetch(
      `http://backend:3001/projects/${projectId}/issues`,
    );
    if (!response.ok) {
      throw new Error("Failed to load backlog");
    }
    return await response.json();
  } catch {
    return mockTasks;
  }
}

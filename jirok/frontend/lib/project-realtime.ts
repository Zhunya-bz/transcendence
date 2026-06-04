import { Issue } from "@/types/prisma";

export type ProjectRealtimeEventType =
  | "project.created"
  | "project.updated"
  | "project.deleted"
  | "project.member.added"
  | "project.member.updated"
  | "project.member.removed"
  | "issue.created"
  | "issue.updated"
  | "issue.status.updated"
  | "issue.assigned"
  | "issue.deleted";

export interface ProjectRealtimeEvent<T = unknown> {
  type: ProjectRealtimeEventType;
  projectId: number;
  timestamp: string;
  data: T;
}

export interface ProjectRealtimeServerMessage<T = unknown> {
  type: "ready" | "subscribed" | "unsubscribed" | "pong" | "event" | "error";
  projectId?: number;
  userId?: number;
  message?: string;
  event?: ProjectRealtimeEvent<T>;
}

export function getProjectRealtimeUrl() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
  const url = new URL("/ws/projects", backendUrl);

  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

export function applyIssueEvent(
  current: Issue[],
  event: ProjectRealtimeEvent<Issue>,
) {
  if (!event.type.startsWith("issue.")) {
    return current;
  }

  if (event.type === "issue.deleted") {
    return current.filter((issue) => issue.id !== event.data.id);
  }

  const next = current.filter((issue) => issue.id !== event.data.id);
  next.push(event.data);
  return next;
}

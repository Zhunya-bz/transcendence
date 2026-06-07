import { Issue } from "@/types/prisma";
import type { User, UserProject } from "@/types/prisma";

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
  type:
    | "ready"
    | "subscribed"
    | "unsubscribed"
    | "pong"
    | "event"
    | "presence.snapshot"
    | "error";
  projectId?: number;
  userId?: number;
  message?: string;
  event?: ProjectRealtimeEvent<T>;
  onlineUserIds?: number[];
}

// export function getProjectRealtimeUrl() {
//   const backendUrl =
//     process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
//   const url = new URL("/ws/projects", backendUrl);

//   url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
//   return url.toString();
// }

export function getProjectRealtimeUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws/projects`;
}

export function applyIssueEvent(
  current: Issue[],
  event: ProjectRealtimeEvent<Issue>,
  members: UserProject[] = [],
) {
  if (!event.type.startsWith("issue.")) {
    return current;
  }

  if (event.type === "issue.deleted") {
    return current.filter((issue) => issue.id !== event.data.id);
  }

  const memberById = new Map<number, User | undefined>(
    members.map((member) => [member.userId, member.user]),
  );
  const previousIssue = current.find((issue) => issue.id === event.data.id);
  const hasAssigneeId = Object.prototype.hasOwnProperty.call(
    event.data,
    "assigneeId",
  );
  const hasAssignee = Object.prototype.hasOwnProperty.call(
    event.data,
    "assignee",
  );
  const assigneeId = hasAssigneeId
    ? event.data.assigneeId ?? null
    : previousIssue?.assigneeId ?? null;
  const assignee = hasAssignee
    ? event.data.assignee ?? null
    : assigneeId === null
      ? null
      : memberById.get(assigneeId) ?? previousIssue?.assignee ?? null;

  const next = current.filter((issue) => issue.id !== event.data.id);
  next.push({
    ...previousIssue,
    ...event.data,
    assigneeId,
    assignee,
  });
  return next;
}

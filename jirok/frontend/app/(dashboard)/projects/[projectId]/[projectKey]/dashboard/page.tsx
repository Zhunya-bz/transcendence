"use client";

import { use, useCallback, useEffect } from "react";
import { getBacklogTasks } from "@/actions/issues";
import { getProjectMembers } from "@/actions/members";
import { getBackendUrl } from "@/lib/backend";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskStack } from "@/components/TaskStack";
import { Issue, IssueStatus, type UserProject } from "@/types/prisma";
import {
  applyIssueEvent,
  getProjectRealtimeUrl,
  type ProjectRealtimeServerMessage,
} from "@/lib/project-realtime";
import { getCurrentMe } from "@/actions/current-user";
import {
  ProjectPresenceProvider,
  useProjectPresence,
} from "@/lib/project-presence-context";

interface DashboardPageProps {
  params: Promise<{ projectId: string; projectKey: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { projectId, projectKey } = use(params);

  return (
    <ProjectPresenceProvider>
      <DashboardBoard
        projectId={projectId}
        projectKey={projectKey}
      />
    </ProjectPresenceProvider>
  );
}

function DashboardBoard({
  projectId,
  projectKey,
}: {
  projectId: string;
  projectKey: string;
}) {
  const queryClient = useQueryClient();
  const [onlineUserIds, setOnlineUserIds] = useProjectPresence();

  const { data = [] } = useQuery<Issue[]>({
    queryKey: ["backlog", projectId],
    queryFn: () => getBacklogTasks(projectId),
    placeholderData: [],
  });

  const { data: members = [] } = useQuery<UserProject[]>({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: Boolean(projectId),
  });

  useEffect(() => {
    let isDisposed = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    const numericProjectId = Number(projectId);

    const connect = () => {
      if (isDisposed) {
        return;
      }

      socket = new WebSocket(getProjectRealtimeUrl());

      socket.onopen = () => {
        socket?.send(JSON.stringify({ type: "subscribe", projectId: numericProjectId }));
      };

      socket.onmessage = (messageEvent) => {
        let message: ProjectRealtimeServerMessage<Issue>;

        try {
          message = JSON.parse(messageEvent.data as string) as ProjectRealtimeServerMessage<Issue>;
        } catch {
          return;
        }

        if (
          message.type === "presence.snapshot" &&
          message.projectId === numericProjectId
        ) {
          setOnlineUserIds(message.onlineUserIds ?? []);
          return;
        }

        const event = message.type === "event" ? message.event : undefined;

        if (message.projectId !== numericProjectId || !event) {
          return;
        }

        const members = queryClient.getQueryData<UserProject[]>([
          "project-members",
          projectId,
        ]);

        queryClient.setQueryData<Issue[]>(["backlog", projectId], (current = []) =>
          applyIssueEvent(current, event, members ?? []),
        );
      };

      socket.onclose = (closeEvent) => {
        if (isDisposed) {
          return;
        }

        if (closeEvent.code === 4401) {
          return;
        }

        reconnectTimer = setTimeout(connect, 1000);
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      isDisposed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      socket?.close();
    };
  }, [projectId, queryClient, setOnlineUserIds]);

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentMe,
  });

  const onlineUsers = onlineUserIds
    .map(
      (userId) =>
        members.find((member) => member.userId === userId)?.user ?? {
          id: userId,
          name: `User ${userId}`,
          email: "",
        },
    );

  const setTask = useCallback(async (task: Partial<Issue>) => {
    // There is an id, so we're updating a task
    if ("id" in task) {
      await fetch(getBackendUrl(`/projects/${projectId}/issues/${task.id}`), {
        body: JSON.stringify(task),
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
    }

    // No id, so we are creating a new task
    else {
      alert(JSON.stringify(currentUser));
      await fetch(getBackendUrl(`/projects/${projectId}/issues`), {
        body: JSON.stringify({
          reporterId: currentUser?.id,
          ...task
        }),
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
    }
  }, [projectId, currentUser]);

  return (
    <div className="flex flex-col gap-4 width-full flex-1">
    <div className="flex flex-row gap-4 width-full flex-1">
      <TaskStack status={IssueStatus.TODO} tasks={data.filter(task => task.status === IssueStatus.TODO)} setTask={setTask} projectId={projectId} projectKey={projectKey} />
      <TaskStack status={IssueStatus.IN_PROGRESS} tasks={data.filter(task => task.status === IssueStatus.IN_PROGRESS)} setTask={setTask} projectId={projectId} projectKey={projectKey} />
      <TaskStack status={IssueStatus.IN_REVIEW} tasks={data.filter(task => task.status === IssueStatus.IN_REVIEW)} setTask={setTask} projectId={projectId} projectKey={projectKey} />
      <TaskStack status={IssueStatus.DONE} tasks={data.filter(task => task.status === IssueStatus.DONE)} setTask={setTask} projectId={projectId} projectKey={projectKey} showAdd={false} />
    </div>
    <div>
      currently online: {onlineUsers.map(user => user.name).join(", ")}
    </div>
    </div>
  )
}

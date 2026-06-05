"use client";

import { getCurrentMe } from "@/actions/current-user";
import { getBacklogTasks} from "@/actions/issues";
import { getProjectMembers } from "@/actions/members";
import { useQuery } from "@tanstack/react-query";
import { use, useState } from "react";
import { TasksTable } from "@/components/TaskTable";
import { Issue, type UserProject } from "@/types/prisma";

interface BacklogPageProps {
  params: Promise<{ projectId: string; projectKey: string }>;
  searchParams: Promise<{ assignee?: string }>;
}

export default function BacklogPage({ params, searchParams }: BacklogPageProps) {
  const { projectId, projectKey } = use(params);
  
  // Unwrap searchParams using the `use` hook
  const resolvedSearchParams = use(searchParams);
  const assigneeFilter = resolvedSearchParams?.assignee;

  const LIMIT = 10;
  const [visible, setVisible] = useState(LIMIT);

  const { data, isLoading, isError } = useQuery<Issue[]>({
    queryKey: ["backlog", projectId],
    queryFn: () => getBacklogTasks(projectId),
  });

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentMe,
  });

    const { data: members } = useQuery<UserProject[]>({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
  });

  const allTasks = data ?? [];

  const currentUserId = currentUser?.id ?? null;

  const filteredTasks =
    assigneeFilter === "me"
      ? currentUserId
        ? allTasks.filter((task) => task.assigneeId === currentUserId)
        : []
      : allTasks;

  const visibleTasks = filteredTasks.slice(0, visible);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {assigneeFilter === "me" ? "My Tasks" : "Backlog"}
        </h1>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading tasks...</p>}
      {isError && <p className="text-sm text-red-600">Could not load tasks.</p>}

      <TasksTable
        tasks={visibleTasks}
        members={members ?? []}
        projectId={projectId}
        projectKey={projectKey}
      />

      {visible < filteredTasks.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisible((prev) => prev + LIMIT)}
            className="px-4 py-2 text-sm bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

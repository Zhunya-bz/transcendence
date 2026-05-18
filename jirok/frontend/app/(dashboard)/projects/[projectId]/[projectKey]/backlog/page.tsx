"use client";
import { getBacklogTasks, type TaskItem } from "@/actions/issues";
import { getProjectMembers, type ProjectMember } from "@/actions/members";
import { useQuery } from "@tanstack/react-query";
import { use, useState } from "react";
import { TasksTable } from "@/components/TaskTable";

interface BacklogPageProps {
  params: Promise<{ projectId: string; projectKey: string }>;
}

export default function BacklogPage({ params }: BacklogPageProps) {
  const { projectId, projectKey } = use(params);

  const LIMIT = 3; //todo make 20
  const [visible, setVisible] = useState(LIMIT);

  const { data, isLoading, isError } = useQuery<TaskItem[]>({
    queryKey: ["backlog", projectId],
    queryFn: () => getBacklogTasks(projectId),
  });

  const { data: members } = useQuery<ProjectMember[]>({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
  });

  const allTasks = data ?? [];

  const visibleTasks = allTasks.slice(0, visible);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Backlog</h1>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading tasks...</p>}
      {isError && <p className="text-sm text-red-600">Could not load tasks.</p>}

      <TasksTable
        tasks={visibleTasks}
        members={members ?? []}
        projectId={projectId}
        projectKey={projectKey}
      />

      {visible < allTasks.length && (
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

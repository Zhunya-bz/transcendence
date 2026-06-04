"use client"

import { use, useCallback } from "react";
import { getBacklogTasks } from "@/actions/issues";
import { useQuery } from "@tanstack/react-query";
import { TaskStack } from "@/components/TaskStack";
import { Issue, IssueStatus } from "@/types/prisma";

interface DashboardPageProps {
  params: Promise<{ projectId: string; projectKey: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { projectId, projectKey } = use(params);

  const { data, refetch } = useQuery<Issue[]>({
    queryKey: ["backlog", projectId],
    queryFn: () => getBacklogTasks(projectId),
    placeholderData: [],
    // refetchInterval: 1000, // why????????
  });

  const setTask = useCallback(async (task: Partial<Issue>) => {
    // Make sure the data is loaded
    if (!data) return ;

    // There is an id, so we're updating a task
    if ("id" in task) {
      await fetch(`http://localhost:3001/projects/${projectId}/issues/${task.id}`, {
        body: JSON.stringify(task),
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      refetch()
    }
    
    // No id, so we are creating a new task
    else {
      await fetch(`http://localhost:3001/projects/${projectId}/issues`, {
        body: JSON.stringify(task),
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      refetch()
    }
  }, []);

  return (
    <div className="flex flex-row gap-4 width-full flex-1">
      <TaskStack status={IssueStatus.TODO} tasks={data!.filter(task => task.status === IssueStatus.TODO)} setTask={setTask} projectId={projectId} projectKey={projectKey} />
      <TaskStack status={IssueStatus.IN_PROGRESS} tasks={data!.filter(task => task.status === IssueStatus.IN_PROGRESS)} setTask={setTask} projectId={projectId} projectKey={projectKey} />
      <TaskStack status={IssueStatus.IN_REVIEW} tasks={data!.filter(task => task.status === IssueStatus.IN_REVIEW)} setTask={setTask} projectId={projectId} projectKey={projectKey} />
      <TaskStack status={IssueStatus.DONE} tasks={data!.filter(task => task.status === IssueStatus.DONE)} setTask={setTask} projectId={projectId} projectKey={projectKey} showAdd={false} />
    </div>
  )
}

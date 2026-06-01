"use client"

import { use, useCallback, useState } from "react";
import { getBacklogTasks, type TaskItem, type TaskStatus } from "@/actions/issues";
import { useQuery } from "@tanstack/react-query";
import { TaskStack } from "@/components/TaskStack";

interface DashboardPageProps {
  params: Promise<{ projectId: string; projectKey: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { projectId, projectKey } = use(params);

  const { data, refetch } = useQuery<TaskItem[]>({
    queryKey: ["backlog", projectId],
    queryFn: () => getBacklogTasks(projectId),
    placeholderData: [],
    refetchInterval: 1000,
  });

  const setTask = useCallback(async (task: Partial<TaskItem>) => {
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
      <TaskStack status="TODO" tasks={data!.filter(task => task.status === "TODO")} setTask={setTask} />
      <TaskStack status="IN_PROGRESS" tasks={data!.filter(task => task.status === "IN_PROGRESS")} setTask={setTask} />
      <TaskStack status="IN_REVIEW" tasks={data!.filter(task => task.status === "IN_REVIEW")} setTask={setTask} />
      <TaskStack status="DONE" tasks={data!.filter(task => task.status === "DONE")} setTask={setTask} showAdd={false} />
    </div>
  )
}

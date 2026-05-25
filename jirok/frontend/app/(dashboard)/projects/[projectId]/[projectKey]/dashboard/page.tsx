"use client"

import { use, useCallback } from "react";
import { getBacklogTasks, type TaskItem, type TaskStatus } from "@/actions/issues";
import { useQuery } from "@tanstack/react-query";
import { TaskStack } from "@/components/TaskStack";

interface DashboardPageProps {
  params: Promise<{ projectId: string; projectKey: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { projectId, projectKey } = use(params);

  const { data, isLoading, isError } = useQuery<TaskItem[]>({
    queryKey: ["backlog", projectId],
    queryFn: () => getBacklogTasks(projectId),
  });

  const setTask = useCallback((task: TaskItem) => {
    // fetch("http://localhost:3001/")
  }, []);

  if (isLoading || isError || data == undefined) {
    return <div className="flex flex-row gap-4 width-full flex-1">
      <TaskStack status="todo" tasks={[]} setTask={setTask} />
      <TaskStack status="in_progress" tasks={[]} setTask={setTask} />
      <TaskStack status="in_review" tasks={[]} setTask={setTask} />
      <TaskStack status="done" tasks={[]} setTask={setTask} showAdd={false} />
    </div>
  }

  return (
    <div className="flex flex-row gap-4 width-full flex-1">
      <TaskStack status="todo" tasks={data.filter(task => task.status === "todo")} setTask={setTask} />
      <TaskStack status="in_progress" tasks={data.filter(task => task.status === "in_progress")} setTask={setTask} />
      <TaskStack status="in_review" tasks={data.filter(task => task.status === "in_review")} setTask={setTask} />
      <TaskStack status="done" tasks={data.filter(task => task.status === "done")} setTask={setTask} showAdd={false} />
    </div>
  )
}

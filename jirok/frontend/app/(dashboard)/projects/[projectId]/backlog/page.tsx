"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBacklogTasks, type TaskItem } from "@/actions/issues";
import { getProjectMembers, type ProjectMember } from "@/actions/members";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { MdBookmark, MdBugReport, MdTaskAlt } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface BacklogPageProps {
  params: Promise<{ projectId: string }>;
}

export default function BacklogPage({ params }: BacklogPageProps) {
  const { projectId } = use(params);
  const searchParams = useSearchParams();
  const projectKey = searchParams.get("key") ?? "PROJECT";

  const { data, isLoading, isError } = useQuery<TaskItem[]>({
    queryKey: ["backlog", projectId],
    queryFn: () => getBacklogTasks(projectId),
  });

  const { data: members } = useQuery<ProjectMember[]>({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
  });

  const tasks = data ?? [];

  const getTypeClasses = (type: TaskItem["type"]) => {
    if (type === "bug") return "text-red-600";
    if (type === "story") return "text-green-600";
    return "text-blue-600";
  };

  const getTypeIcon = (type: TaskItem["type"]) => {
    if (type === "bug") return MdBugReport;
    if (type === "story") return MdBookmark;
    return MdTaskAlt;
  };

  const getStatusClasses = (status: TaskItem["status"]) => {
    if (status === "done") return "bg-green-100 text-green-700";
    if (status === "in_progress") return "bg-orange-100 text-orange-700";
    if (status === "in_review") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const getPriorityClasses = (priority: TaskItem["priority"]) => {
    if (priority === "high") return "bg-orange-100 text-orange-700";
    if (priority === "medium") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (status: TaskItem["status"]) => {
    if (status === "todo") return "To Do";
    if (status === "in_progress") return "In Progress";
    if (status === "in_review") return "In Review";
    return "Done";
  };

  const getPriorityLabel = (priority: TaskItem["priority"]) => {
    if (priority === "high") return "High";
    if (priority === "medium") return "Medium";
    return "Low";
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Backlog</h1>
      </div>

      <div className="rounded-lg border-2 bg-white shadow-md overflow-hidden">
        {isLoading && (
          <div className="px-6 py-4 text-sm text-gray-500">
            Loading tasks...
          </div>
        )}
        {isError && (
          <div className="px-6 py-4 text-sm text-red-600">
            Could not load backlog tasks.
          </div>
        )}
        <Table className="text-base">
          <TableHeader>
            <TableRow className="bg-orange-100 pointer-events-none rounded-t-lg">
              <TableHead className="text-orange-900 font-semibold">
                Title
              </TableHead>
              <TableHead className="text-orange-900 font-semibold">
                Assignee
              </TableHead>
              <TableHead className="text-orange-900 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-orange-900 font-semibold">
                Priority
              </TableHead>
              <TableHead className="text-orange-900 font-semibold">
                Created At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const TypeIcon = getTypeIcon(task.type);
              const member = members?.find(
                (item) => item.id === task.assigneeId,
              );
              const assigneeName = member
                ? `${member.name}${member.surname ? ` ${member.surname}` : ""}`
                : "Unassigned";
              return (
                <TableRow
                  key={task.id}
                  className="border-b border-blue-100 hover:bg-orange-50"
                >
                  <TableCell className="max-w-[320px] truncate">
                    <div className="flex items-baseline gap-2">
                      <TypeIcon
                        className={`size-4 ${getTypeClasses(task.type)}`}
                      />
                      <span className="inline-flex items-baseline px-2 py-0.5 text-xs font-mono text-blue-700">
                        {projectKey}-{task.id}
                      </span>
                      <Link
                        href={`/projects/${projectId}/issues/${task.id}?key=${encodeURIComponent(projectKey)}`}
                        className="truncate hover:text-blue-900 hover:underline"
                      >
                        {task.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member ? (
                      <Link
                        href={`/users/${task.assigneeId}`}
                        className="hover:text-blue-900 hover:underline"
                      >
                        {assigneeName}
                      </Link>
                    ) : (
                      <span className="text-gray-500">{assigneeName}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(task.status)}`}
                    >
                      {getStatusLabel(task.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityClasses(task.priority)}`}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                  </TableCell>
                  <TableCell>{task.createdAt}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

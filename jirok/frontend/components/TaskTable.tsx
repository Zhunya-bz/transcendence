"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type TaskItem } from "@/actions/issues";
import { type ProjectMember } from "@/actions/members";
import { MdBookmark, MdBugReport, MdTaskAlt } from "react-icons/md";
import Link from "next/link";

interface TasksTableProps {
  tasks: TaskItem[];
  members: ProjectMember[];
  projectId: string;
  projectKey: string;
}

export const getTypeClasses = (type: TaskItem["type"]) => {
  if (type === "bug") return "text-red-600";
  if (type === "story") return "text-green-600";
  return "text-blue-600";
};

export const getTypeIcon = (type: TaskItem["type"]) => {
  if (type === "bug") return MdBugReport;
  if (type === "story") return MdBookmark;
  return MdTaskAlt;
};

export const getStatusClasses = (status: TaskItem["status"]) => {
  if (status === "done") return "bg-green-100 text-green-700";
  if (status === "in_progress") return "bg-orange-100 text-orange-700";
  if (status === "in_review") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

export const getPriorityClasses = (priority: TaskItem["priority"]) => {
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

export const getStatusLabel = (status: TaskItem["status"]) => {
  if (status === "todo") return "To Do";
  if (status === "in_progress") return "In Progress";
  if (status === "in_review") return "In Review";
  return "Done";
};

export const getPriorityLabel = (priority: TaskItem["priority"]) => {
  if (priority === "high") return "High";
  if (priority === "medium") return "Medium";
  return "Low";
};

export const TasksTable = ({
  tasks,
  members,
  projectId,
  projectKey,
}: TasksTableProps) => {
  return (
    <div className="rounded-lg border-2 bg-white shadow-md overflow-hidden">
      <Table className="text-base">
        <TableHeader>
          <TableRow className="bg-orange-100 pointer-events-none">
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
                      href={`/projects/${projectId}/${projectKey}/issues/${task.id}`}
                      className="truncate hover:text-blue-900 hover:underline"
                    >
                      {task.title}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  {task.assigneeId &&
                  members?.find((m) => m.id === task.assigneeId) ? (
                    <Link
                      href={`/users/${task.assigneeId}`}
                      className="hover:text-blue-900 hover:underline"
                    >
                      {getMemberName(task.assigneeId)}
                    </Link>
                  ) : (
                    <span className="text-gray-500">Unassigned</span>
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
  );

  function getMemberName(assigneeId: number) {
    const member = members?.find((m) => m.id === assigneeId);
    return member ? `${member.name} ${member.surname ?? ""}` : "Unassigned";
  };
};

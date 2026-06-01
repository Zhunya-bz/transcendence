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
import { IssuePriority, IssueStatus, IssueType, type UserProject } from "@/types/prisma";
import { MdBookmark, MdBugReport, MdTaskAlt } from "react-icons/md";
import Link from "next/link";

interface TasksTableProps {
  tasks: TaskItem[];
  members: UserProject[];
  projectId: string;
  projectKey: string;
}

  export const getTypeClasses = (type: TaskItem["type"]) => {
    if (type === IssueType.BUG) return "text-red-600";
    if (type === IssueType.STORY) return "text-green-600";
    return "text-blue-600";
  };

  export const getTypeIcon = (type: TaskItem["type"]) => {
    if (type === IssueType.BUG) return MdBugReport;
    if (type === IssueType.STORY) return MdBookmark;
    return MdTaskAlt;
  };

  export const getStatusClasses = (status: TaskItem["status"]) => {
    if (status === IssueStatus.DONE) return "bg-green-100 text-green-700";
    if (status === IssueStatus.IN_PROGRESS) return "bg-orange-50 text-orange-700";
    if (status === IssueStatus.IN_REVIEW) return "bg-blue-50 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  export const getPriorityClasses = (priority: TaskItem["priority"]) => {
    if (priority === IssuePriority.HIGH) return "bg-red-50 text-red-700";
    if (priority === IssuePriority.MEDIUM) return "bg-violet-50 text-violet-600";
    return "bg-lime-50 text-lime-700";
  };

  export const getStatusLabel = (status: TaskItem["status"]) => {
    if (status === IssueStatus.TODO) return "To Do";
    if (status === IssueStatus.IN_PROGRESS) return "In Progress";
    if (status === IssueStatus.IN_REVIEW) return "In Review";
    return "Done";
  };

  export const getPriorityLabel = (priority: TaskItem["priority"]) => {
    if (priority === IssuePriority.HIGH) return "High";
    if (priority === IssuePriority.MEDIUM) return "Medium";
    return "Low";
  };

export const TasksTable = ({
  tasks,
  members,
  projectId,
  projectKey,
}: TasksTableProps) => {
  const getMemberName = (assigneeId: number) => {
    const member = members?.find((m) => m.userId === assigneeId);
    const user = member?.user;
    return user ? `${user.name} ${user.surname ?? ""}`.trim() : "Unassigned";
  };

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="rounded-lg border-2 bg-white shadow-md overflow-hidden">
      <Table className="text-base">
        <TableHeader>
          <TableRow className="bg-orange-100 pointer-events-none">
            <TableHead className="text-orange-900 font-semibold">
              Title
            </TableHead>
            <TableHead className="hidden sm:table-cell text-orange-900 font-semibold">
              Assignee
            </TableHead>
            <TableHead className="text-orange-900 font-semibold">
              Status
            </TableHead>
            <TableHead className="hidden sm:table-cell text-orange-900 font-semibold">
              Priority
            </TableHead>
            <TableHead className="hidden sm:table-cell text-orange-900 font-semibold">
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
                      className={`size-5 shrink-0 ${getTypeClasses(task.type)}`}
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
                <TableCell className="hidden sm:table-cell">
                  {task.assigneeId &&
                  members?.find((m) => m.userId === task.assigneeId) ? (
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
                <TableCell className="hidden sm:table-cell">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityClasses(task.priority)}`}
                  >
                    {getPriorityLabel(task.priority)}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {dateFormatter.format(new Date(task.created))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

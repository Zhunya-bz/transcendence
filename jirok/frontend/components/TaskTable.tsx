"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Issue, IssuePriority, IssueStatus, IssueType, type UserProject } from "@/types/prisma";
import { MdBookmark, MdBugReport, MdTaskAlt } from "react-icons/md";
import Link from "next/link";

interface TasksTableProps {
  tasks: Issue[];
  members: UserProject[];
  projectId: string;
  projectKey: string;
}

  export const getTypeClasses = (type: Issue["type"]) => {
    if (type === IssueType.BUG) return "text-red-600";
    if (type === IssueType.STORY) return "text-green-600";
    return "text-blue-600";
  };

  export const getTypeIcon = (type: Issue["type"]) => {
    if (type === IssueType.BUG) return MdBugReport;
    if (type === IssueType.STORY) return MdBookmark;
    return MdTaskAlt;
  };

  export const getStatusClasses = (status: Issue["status"]) => {
    if (status === IssueStatus.DONE) return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300";
    if (status === IssueStatus.IN_PROGRESS) return "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300";
    if (status === IssueStatus.IN_REVIEW) return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
    return "bg-muted text-muted-foreground";
  };

  export const getPriorityClasses = (priority: Issue["priority"]) => {
    if (priority === IssuePriority.HIGH) return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";
    if (priority === IssuePriority.MEDIUM) return "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300";
    return "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300";
  };

  export const getStatusLabel = (status: Issue["status"]) => {
    if (status === IssueStatus.TODO) return "To Do";
    if (status === IssueStatus.IN_PROGRESS) return "In Progress";
    if (status === IssueStatus.IN_REVIEW) return "In Review";
    return "Done";
  };

  export const getPriorityLabel = (priority: Issue["priority"]) => {
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
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
      <Table className="text-base">
        <TableHeader>
          <TableRow className="bg-muted pointer-events-none">
            <TableHead className="font-semibold text-foreground">
              Title
            </TableHead>
            <TableHead className="hidden font-semibold text-foreground sm:table-cell">
              Assignee
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Status
            </TableHead>
            <TableHead className="hidden font-semibold text-foreground sm:table-cell">
              Priority
            </TableHead>
            <TableHead className="hidden font-semibold text-foreground sm:table-cell">
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
                className="border-b border-border hover:bg-muted/60"
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
                      className="truncate hover:text-primary hover:underline"
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
                      className="hover:text-primary hover:underline"
                    >
                      {getMemberName(task.assigneeId)}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
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
                  {task.created && dateFormatter.format(new Date(task.created))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

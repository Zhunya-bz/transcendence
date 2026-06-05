"use client";

import { use, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { deleteTask, getTask } from "@/actions/issues";
import { getBackendUrl } from "@/lib/backend";
import { getProjectMembers } from "@/actions/members";
import {
  issueFieldLabelClassName,
  issuePriorityOptions,
  issueSelectTriggerClassName,
  issueStatusOptions,
  issueTypeOptions,
} from "@/components/modal-create-task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Issue, IssuePriority, IssueStatus, IssueType, UserRole, type UserProject } from "@/types/prisma";
import { getCurrentUserRole } from "@/actions/current-user";

interface DashboardPageProps {
  params: Promise<{ projectId: string; projectKey: string; issueId: string }>;
}

export default function IssuePage({ params }: DashboardPageProps) {
  const { projectId, projectKey, issueId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, refetch, isFetched } = useQuery<Issue>({
    queryKey: ["backlog", projectId, issueId],
    queryFn: () => getTask(projectId, issueId),
  });

  const { data: members = [] } = useQuery<UserProject[]>({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: Boolean(projectId),
  });

  const update = useCallback(
    async (task: Partial<Issue>) => {
      if (!data) return;

      await fetch(getBackendUrl(`/projects/${projectId}/issues/${data.id}`), {
        body: JSON.stringify(task),
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await refetch();
    },
    [data, projectId, refetch],
  );

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(projectId, issueId),
    onSuccess: async () => {
      toast.success("Issue deleted");
      await queryClient.invalidateQueries({ queryKey: ["backlog", projectId] });
      router.replace(`/projects/${projectId}/${projectKey}/backlog`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const { data: currentUserRole, isLoading: isRoleLoading } = useQuery({
    queryKey: ["current-role", projectId],
    queryFn: () => getCurrentUserRole(projectId ?? ""),
    enabled: Boolean(projectId),
  });

  const isViewer = currentUserRole?.role === UserRole.VIEWER;

  if (!isFetched || !data) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-row gap-4 width-full flex-1">
      <div className="flex flex-col gap-4 width-full flex-1">
        <Input
          className="h-11 bg-white text-xl"
          defaultValue={data.title}
          disabled={isViewer}
          onChange={(e) =>
            update({
              title: e.target.value,
            })
          }
        />
        <Textarea
          className="min-h-32 resize-y bg-white"
          defaultValue={data.description ?? ""}
          placeholder="description"
          disabled={isViewer}
          onChange={(e) =>
            update({
              description: e.target.value,
            })
          }
        />
      </div>
      <div className="flex min-w-[320px] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className={issueFieldLabelClassName}>Type</label>
          <Select
            defaultValue={data.type}
            disabled={isViewer}
            onValueChange={(value) =>
              update({
                type: value as IssueType,
              })
            }
          >
            <SelectTrigger className={issueSelectTriggerClassName}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {issueTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="inline-flex items-center gap-2">
                      <Icon className={option.iconClassName} />
                      {option.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className={issueFieldLabelClassName}>Priority</label>
          <Select
            defaultValue={data.priority}
            disabled={isViewer}
            onValueChange={(value) =>
              update({
                priority: value as IssuePriority,
              })
            }
          >
            <SelectTrigger className={issueSelectTriggerClassName}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {issuePriorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className={issueFieldLabelClassName}>Status</label>
          <Select
            defaultValue={data.status}
            disabled={isViewer}
            onValueChange={(value) =>
              update({
                status: value as IssueStatus,
              })
            }
          >
            <SelectTrigger className={issueSelectTriggerClassName}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {issueStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className={issueFieldLabelClassName}>Assignee</label>
          <Select
            defaultValue={data.assigneeId ? String(data.assigneeId) : "unassigned"}
            disabled={isViewer}
            onValueChange={(value) =>
              update({
                assigneeId: value === "unassigned" ? null : Number(value),
              })
            }
          >
            <SelectTrigger className={issueSelectTriggerClassName}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {members.map((member) => {
                const user = member.user;
                const name = `${user?.name ?? ""} ${user?.surname ?? ""}`.trim();
                const label = name || `User ${member.userId}`;
                return (
                  <SelectItem key={member.userId} value={String(member.userId)}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {!isViewer && <Button 
          type="button"
          variant="destructive"
          className="mt-2 w-full"
          onClick={() => {
            if (window.confirm("Delete this issue?")) {
              deleteMutation.mutate();
            }
          }}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete issue"}
        </Button>}
      </div>
    </div>
  );
}

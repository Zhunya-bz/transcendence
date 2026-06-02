"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { FaPlus, FaStar } from "react-icons/fa6";
import { MdBookmark, MdBugReport, MdTaskAlt } from "react-icons/md";
import toast from "react-hot-toast";

import { getCurrentMe, getCurrentUserRole } from "@/actions/current-user";
import { getProjectMembers } from "@/actions/members";
import {
  IssueType,
  IssuePriority,
  IssueStatus,
  UserRole,
  type UserProject,
} from "@/types/prisma";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createIssue } from "@/actions/issues";

export const issueFieldLabelClassName = "text-blue-700";
export const issueSelectTriggerClassName = "h-11 w-full bg-white";

export const issueTypeOptions = [
  {
    value: IssueType.BUG,
    label: "Bug",
    icon: MdBugReport,
    iconClassName: "size-4 text-red-500",
  },
  {
    value: IssueType.TASK,
    label: "Task",
    icon: MdTaskAlt,
    iconClassName: "size-4 text-blue-500",
  },
  {
    value: IssueType.STORY,
    label: "Story",
    icon: MdBookmark,
    iconClassName: "size-4 text-green-500",
  },
] as const;

export const issueStatusOptions = [
  { value: IssueStatus.TODO, label: "To Do" },
  { value: IssueStatus.IN_PROGRESS, label: "In Progress" },
  { value: IssueStatus.IN_REVIEW, label: "In Review" },
  { value: IssueStatus.DONE, label: "Done" },
] as const;

export const issuePriorityOptions = [
  { value: IssuePriority.LOW, label: "Low" },
  { value: IssuePriority.MEDIUM, label: "Medium" },
  { value: IssuePriority.HIGH, label: "High" },
] as const;

const taskSchema = z.object({
  type: z.enum([IssueType.BUG, IssueType.TASK, IssueType.STORY]),
  status: z.enum([
    IssueStatus.TODO,
    IssueStatus.IN_PROGRESS,
    IssueStatus.IN_REVIEW,
    IssueStatus.DONE,
  ]),
  title: z.string().trim().min(1, "Summary is required"),
  description: z.string().trim().optional(),
  assigneeId: z.string(),
  priority: z.enum([
    IssuePriority.LOW,
    IssuePriority.MEDIUM,
    IssuePriority.HIGH,
  ]),
  reporterId: z.string(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export const ModalCreateTask = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const projectIdMatch = pathname.match(/\/projects\/(\d+)\//);
  const projectId = projectIdMatch?.[1];

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentMe,
  });

  const { data: members = [] } = useQuery<UserProject[]>({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId ?? ""),
    enabled: Boolean(projectId),
  });

  const { data: currentUserRole, isLoading: isRoleLoading } = useQuery({
    queryKey: ["current-role", projectId],
    queryFn: () => getCurrentUserRole(projectId ?? ""),
    enabled: Boolean(projectId),
  });

  const isViewer = currentUserRole?.role === UserRole.VIEWER;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type: IssueType.TASK,
      status: IssueStatus.TODO,
      title: "",
      description: "",
      assigneeId: "unassigned",
      priority: IssuePriority.MEDIUM,
      reporterId: String(currentUser?.id || ""),
    },
  });
  useEffect(() => {
  if (currentUser?.id) {
    form.setValue("reporterId", String(currentUser.id));
  }
}, [currentUser?.id, form]);

  const mutation = useMutation({
    mutationFn: createIssue,
    onSuccess: async () => {
      toast.success("Task created successfully");
      if (projectId) {
        await queryClient.invalidateQueries({ queryKey: ["backlog", projectId] });
      }
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (values: TaskFormValues) => {
    console.log("values", values);
    mutation.mutate({
      projectId: Number(projectId),
      title: values.title,
      description: values.description,
      type: values.type,
      status: values.status,  
      priority: values.priority,
      assigneeId:
        values.assigneeId === "unassigned" ? null : Number(values.assigneeId),
      reporterId: Number(values.reporterId),
    });

    // console.log("Create task payload", { ...values, reporterId });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          disabled={!projectId || isRoleLoading || isViewer}
          className="text-base px-6 py-4 font-semibold text-center sm:text-lg bg-blue-600 hover:bg-blue-800"
        >
          <FaPlus />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100vh-2rem)] flex-col overflow-y-auto border-none bg-linear-to-b from-orange-50 via-blue-50/30 to-blue-100/60 shadow-2xl sm:max-w-xl md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-900">
            Create task
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the details to add a new task to the project
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700">
                      Work type
                      <FaStar color="red" size={10} />
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11 w-full bg-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={IssueType.BUG}>
                          <span className="inline-flex items-center gap-2">
                            <MdBugReport className="size-4 text-red-500" />
                            Bug
                          </span>
                        </SelectItem>
                        <SelectItem value={IssueType.TASK}>
                          <span className="inline-flex items-center gap-2">
                            <MdTaskAlt className="size-4 text-blue-500" />
                            Task
                          </span>
                        </SelectItem>
                        <SelectItem value={IssueType.STORY}>
                          <span className="inline-flex items-center gap-2">
                            <MdBookmark className="size-4 text-green-500" />
                            Story
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700">Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11 w-full bg-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={IssueStatus.TODO}>To Do</SelectItem>
                        <SelectItem value={IssueStatus.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={IssueStatus.IN_REVIEW}>
                          In Review
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">
                    Summary
                    <FaStar color="red" size={10} />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-11 bg-white"
                      placeholder="Add a short summary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="h-32 max-h-32 resize-none overflow-y-auto bg-white"
                      value={field.value ?? ""}
                      placeholder="Describe the task details"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700">Assignee</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11 w-full bg-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {members.map((member) => {
                          const user = member.user;
                          const name =
                            `${user?.name ?? ""} ${user?.surname ?? ""}`.trim();
                          const label = name || `User ${member.userId}`;
                          return (
                            <SelectItem
                              key={member.userId}
                              value={String(member.userId)}
                            >
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700">Priority</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-11 w-full bg-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={IssuePriority.LOW}>Low</SelectItem>
                        <SelectItem value={IssuePriority.MEDIUM}>
                          Medium
                        </SelectItem>
                        <SelectItem value={IssuePriority.HIGH}>High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reporterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700">
                    Reporter
                    <FaStar color="red" size={10} />
                  </FormLabel>
                  <Select
                    value={field.value || String(currentUser?.id || "")}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 w-full bg-white">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map((member) => {
                        const user = member.user;
                        const name =
                          `${user?.name ?? ""} ${user?.surname ?? ""}`.trim();
                        const label =
                          (name || `User ${member.userId}`) +
                          (member.userId === currentUser?.id ? " (You)" : "");
                        return (
                          <SelectItem
                            key={member.userId}
                            value={String(member.userId)}
                          >
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="bg-blue-100/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Create task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

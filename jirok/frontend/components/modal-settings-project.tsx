"use client";

import { deleteProject, updateProject } from "@/actions/projects";
import { getProjectMembers } from "@/actions/members";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { UserRole, type Project } from "@/types/prisma";

const projectSettingsSchema = z.object({
  name: z.string().trim().min(1, "Required"),
});

interface Props {
  project: Project;
  currentUserId: number | null;
}

export const ModalSettingsProject = ({ project, currentUserId }: Props) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof projectSettingsSchema>>({
    resolver: zodResolver(projectSettingsSchema),
    defaultValues: {
      name: project.name,
    },
  });

  useEffect(() => {
    form.reset({ name: project.name });
  }, [form, project.name]);

  const { data: members = [] } = useQuery({
    queryKey: ["project-members", project.id],
    queryFn: () => getProjectMembers(currentUserId ?? -1, String(project.id)),
    enabled: currentUserId != null,
  });

  const isProjectAdmin =
    currentUserId != null &&
    members.some((member) => member.userId === currentUserId && member.role === UserRole.ADMIN);

  const updateMutation = useMutation({
    mutationFn: (nextName: string) =>
      updateProject(currentUserId ?? -1, project.id, { name: nextName }),
    onSuccess: async () => {
      toast.success("Project updated");
      await queryClient.invalidateQueries({ queryKey: ["currentProject"] });
      setOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(currentUserId ?? -1, project.id),
    onSuccess: async () => {
      toast.success("Project deleted");
      await queryClient.invalidateQueries({ queryKey: ["currentProject"] });
      setOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!isProjectAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={(event) => event.stopPropagation()}
        >
          <Settings2 className="size-3.5" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project settings</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => {
              const nextName = values.name.trim();
              if (nextName === project.name) {
                return;
              }
              updateMutation.mutate(nextName);
            })}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter project name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (window.confirm("Delete this project?")) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                Delete project
              </Button>

              <Button
                type="submit"
                className="bg-orange-500 text-white hover:bg-orange-600"
                disabled={updateMutation.isPending}
              >
                Save name
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
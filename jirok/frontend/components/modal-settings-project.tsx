"use client";

import { deleteProject, generateProjectApiKey, updateProject } from "@/actions/projects";
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
import { getCurrentUserRole } from "@/actions/current-user";
import { DialogDescription } from "@radix-ui/react-dialog";

const projectSettingsSchema = z.object({
  name: z.string().trim().min(1, "Required"),
});

interface Props {
  project: Project;
}

export const ModalSettingsProject = ({ project }: Props) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);

  const form = useForm<z.infer<typeof projectSettingsSchema>>({
    resolver: zodResolver(projectSettingsSchema),
    defaultValues: {
      name: project.name,
    },
  });

  useEffect(() => {
    form.reset({ name: project.name });
  }, [form, project.name]);

  const {data: userRole} = useQuery({
    queryKey: ["current-role", project.id],
    queryFn: () => getCurrentUserRole(String(project.id)),
  });
  
  const updateMutation = useMutation({
    mutationFn: (nextName: string) =>
      updateProject( project.id, { name: nextName }),
    onSuccess: async () => {
      toast.success("Project updated");
      await queryClient.invalidateQueries({ queryKey: ["currentProject"] });
      setOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(project.id),
    onSuccess: async () => {
      toast.success("Project deleted");
      await queryClient.invalidateQueries({ queryKey: ["currentProject"] });
      setOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const apiKeyMutation = useMutation({
    mutationFn: () => generateProjectApiKey(project.id),
    onSuccess: (apiKey) => {
      setGeneratedApiKey(apiKey);
      toast.success("API key generated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const isProjectAdmin = userRole?.role === UserRole.ADMIN;

  if (!isProjectAdmin) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setGeneratedApiKey(null);
        }
      }}
    >
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
      <DialogContent className="max-h-[85vh] overflow-y-auto border border-border bg-background sm:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Project settings</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden"></DialogDescription>

        <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">Project API key</h3>
              <p className="text-sm text-orange-600 dark:text-orange-300">
                API key is generated only once and shown only once.
              </p>
              <p className="text-sm text-muted-foreground">
                Click generate to create a new key for this project. If you generate another one, the old value should no longer be used.
              </p>
            </div>
            <Button
              type="button"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              onClick={() => apiKeyMutation.mutate()}
              disabled={apiKeyMutation.isPending}
            >
              {apiKeyMutation.isPending ? "Generating..." : "Generate API key"}
            </Button>
          </div>

          {generatedApiKey && (
            <div className="rounded-md border border-orange-200 bg-orange-50 p-3 dark:border-orange-500/20 dark:bg-orange-500/10">
              <p className="text-xs uppercase tracking-wide text-orange-700 dark:text-orange-300">
                Copy this now
              </p>
              <code className="mt-2 block break-all font-mono text-sm text-orange-900 dark:text-orange-100">
                {generatedApiKey}
              </code>
            </div>
          )}
        </div>

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
                className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500"
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

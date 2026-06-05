"use client";
import { getCurrentProject } from "@/actions/projects";
import type { Project } from "@/types/prisma";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { CreateProject } from "./create-project";
interface Props {
  projectId?: string | null;
}

export const ModalCreateProject = ({ projectId }: Props) => {
  const [open, setOpen] = useState(false);
  const {
    data: projects,
    isError,
    error,
  } = useQuery<Project[]>({
    queryKey: ["currentProject"],
    queryFn: getCurrentProject,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const currentProject = projects?.find(p => p.id === Number(projectId));

  const handleProjectCreated = () => {
    setOpen(false);
  };

  return (
    <div className="mb-3 flex flex-col gap-y-2 rounded-md border border-border bg-muted px-3 py-3">
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="group flex min-w-0 flex-1 flex-col gap-1 rounded-md px-2 py-1 transition hover:bg-background/80"
        >
          <p className="text-sm uppercase text-muted-foreground transition group-hover:text-foreground">
            Project
          </p>
          <p className="truncate pl-2 text-sm font-semibold text-foreground transition group-hover:text-foreground">
            {currentProject?.name || "No project selected"}
          </p>
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="Create project"
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:text-foreground hover:opacity-100"
            >
              <RiAddCircleFill className="size-5" />
            </button>
          </DialogTrigger>
          <DialogHeader className="hidden">
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <DialogContent className="border-none p-0">
            <DialogDescription className="hidden"></DialogDescription>
            <CreateProject onProjectCreated={handleProjectCreated} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

"use client";
import { getCurrentProject } from "@/actions/projects";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { CreateProject } from "./create-project";

interface Project {
  id: number;
  name: string;
  projectKey: string;
}

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
    <div className="flex flex-col gap-y-2 px-3 py-3 rounded-md bg-neutral-100 mb-3">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase text-neutral-500">Project</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer transition hover:text-blue-500 hover:opacity-100" />
          </DialogTrigger>
          <DialogHeader className="hidden">
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <DialogContent className="border-none p-0">
            <CreateProject onProjectCreated={handleProjectCreated} />
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-sm font-semibold text-neutral-700 pl-2">
        {currentProject?.name || "No project selected"}
      </p>
    </div>
  );
};
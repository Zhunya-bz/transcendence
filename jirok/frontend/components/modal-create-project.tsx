import { getCurrentProject } from "@/actions/projects";
import { useEffect } from "react";
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

export const ModalCreateProject = () => {
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["currentProject"],
    queryFn: getCurrentProject,
  });
  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);
  return (
    <div className="flex flex-col gap-y-2 px-3 py-3 rounded-md bg-neutral-100 mb-3">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase text-neutral-500 ">Project</p>
        <Dialog>
          <DialogTrigger asChild>
            <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opasity-85 transition" />
          </DialogTrigger>
          <DialogHeader className="hidden">
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <DialogContent className="border-none p-0">
            <CreateProject />
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-sm font-semibold text-neutral-700 pl-2">
        {project?.[0]?.name || "No project selected"}
      </p>
    </div>
  );
};

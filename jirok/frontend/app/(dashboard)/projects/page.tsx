"use client";

import { getCurrentProject } from "@/actions/projects";
import { CreateProject } from "@/components/create-project";
import { GetProject } from "@/components/get-project";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ProjectPage() {
  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["currentProject"],
    queryFn: getCurrentProject,
  });

  useEffect(() => {
    if (isError) {
      console.log(error.message);
      toast.error(error.message);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="mt-4 h-32 rounded bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="p-2">
        <CreateProject />
      </div>
    );
  }

  return (
    <div>
      <GetProject />
    </div>
  );
}

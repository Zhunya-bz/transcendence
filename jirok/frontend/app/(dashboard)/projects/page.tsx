"use client"

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
        toast.error(error.message);
      }
    }, [isError, error]);

    if (projects) 
        return (
            <div className="p-2">
                <CreateProject/>
            </div>
        )
    return (
        <div>
            <GetProject/>
        </div>
    )    
}
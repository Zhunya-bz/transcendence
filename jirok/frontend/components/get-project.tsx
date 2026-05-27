"use client";

import { getCurrentProject } from "@/actions/projects";
import { getCurrentMe } from "@/actions/current-user";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ModalSettingsProject } from "./modal-settings-project";
import type { Project } from "@/types/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProjectRowProps {
  project: Project;
  currentUserId: number | null;
  dateFormatter: Intl.DateTimeFormat;
}

function ProjectRow({ project, currentUserId, dateFormatter }: ProjectRowProps) {
  const router = useRouter();

  return (
    <TableRow
      className="hover:bg-orange-100 transition-colors border-b border-gray-200 cursor-pointer"
      onClick={() => router.push(`/projects/${project.id}/${project.projectKey}/backlog`)}
    >
      <TableCell className="font-semibold text-blue-600 py-5 px-6">
        {project.name}
      </TableCell>
      <TableCell className="text-orange-500 font-mono font-bold py-5 px-6">
        {project.projectKey}
      </TableCell>
      <TableCell className="text-gray-600 py-5 px-6">
        {dateFormatter.format(new Date(project.createdAt))}
      </TableCell>
      <TableCell className="py-5 px-6">
        <div onClick={(event) => event.stopPropagation()}>
          <ModalSettingsProject
            project={project}
            currentUserId={currentUserId}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export const GetProject = () => {
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useQuery<Project[]>({
    queryKey: ["currentProject"],
    queryFn: getCurrentProject,
  });
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentMe,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  // Return null if no projects exist
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        A list of your projects
      </h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-linear-to-r from-blue-600 to-orange-500">
              <TableHead className="text-white font-bold py-4 px-6 text-left">
                Name
              </TableHead>
              <TableHead className="text-white font-bold py-4 px-6 text-left">
                Key
              </TableHead>
              <TableHead className="text-white font-bold py-4 px-6 text-left">
                Created
              </TableHead>
              <TableHead className="text-white font-bold py-4 px-6 text-left">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                currentUserId={currentUser?.id ?? null}
                dateFormatter={dateFormatter}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

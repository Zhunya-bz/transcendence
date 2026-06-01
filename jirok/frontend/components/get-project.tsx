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
      <TableCell className="font-semibold text-blue-600 py-2 px-2 sm:py-5 sm:px-6 whitespace-normal break-words">
        <div className="flex flex-col gap-1">
          <span>{project.name}</span>
          <div className="text-xs text-gray-500 sm:hidden">
            <div className="font-mono font-semibold text-orange-500">
              {project.projectKey}
            </div>
            <div>{dateFormatter.format(new Date(project.createdAt))}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-orange-500 font-mono font-bold py-5 px-6 whitespace-normal break-words">
        {project.projectKey}
      </TableCell>
      <TableCell className="hidden sm:table-cell text-gray-600 py-5 px-6 whitespace-normal break-words">
        {dateFormatter.format(new Date(project.createdAt))}
      </TableCell>
      <TableCell className="py-2 px-2 sm:py-5 sm:px-6 text-right">
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
    <div className="w-full px-2 py-3 sm:px-4 sm:py-6 max-w-sm sm:max-w-3xl mx-auto">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3">
        List of your projects
      </h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-linear-to-r from-blue-600 to-orange-500">
              <TableHead className="text-white font-bold py-3 px-2 sm:px-6 text-left w-40 sm:w-auto">
                Name
              </TableHead>
              <TableHead className="hidden sm:table-cell text-white font-bold py-4 px-6 text-left">
                Key
              </TableHead>
              <TableHead className="hidden sm:table-cell text-white font-bold py-4 px-6 text-left">
                Created
              </TableHead>
              <TableHead className="text-white font-bold py-3 px-2 sm:px-6 text-right w-16 sm:w-32">
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

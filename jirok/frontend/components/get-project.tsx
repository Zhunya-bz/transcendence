"use client";

import { getCurrentProject } from "@/actions/projects";
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
  dateFormatter: Intl.DateTimeFormat;
}

function ProjectRow({ project, dateFormatter }: ProjectRowProps) {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer border-b border-border transition-colors hover:bg-muted/60"
      onClick={() => router.push(`/projects/${project.id}/${project.projectKey}/backlog`)}
    >
      <TableCell className="whitespace-normal break-words px-2 py-2 font-semibold text-primary sm:px-6 sm:py-5">
        <div className="flex flex-col gap-1">
          <span>{project.name}</span>
          <div className="text-xs text-muted-foreground sm:hidden">
            <div className="font-mono font-semibold text-orange-500">
              {project.projectKey}
            </div>
            <div>{dateFormatter.format(new Date(project.createdAt))}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden whitespace-normal break-words px-6 py-5 font-mono font-bold text-orange-500 sm:table-cell">
        {project.projectKey}
      </TableCell>
      <TableCell className="hidden whitespace-normal break-words px-6 py-5 text-muted-foreground sm:table-cell">
        {dateFormatter.format(new Date(project.createdAt))}
      </TableCell>
      <TableCell className="px-2 py-2 text-right sm:px-6 sm:py-5">
        <div onClick={(event) => event.stopPropagation()}>
          <ModalSettingsProject
            project={project}
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

  // Return null if no projects exist
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-2 py-3 sm:px-4 sm:py-6 max-w-sm sm:max-w-3xl mx-auto">
      <h2 className="mb-3 text-lg font-bold text-foreground sm:text-2xl">
        List of your projects
      </h2>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-lg">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-40 px-2 py-3 text-left font-bold text-foreground sm:w-auto sm:px-6">
                Name
              </TableHead>
              <TableHead className="hidden px-6 py-4 text-left font-bold text-foreground sm:table-cell">
                Key
              </TableHead>
              <TableHead className="hidden px-6 py-4 text-left font-bold text-foreground sm:table-cell">
                Created
              </TableHead>
              <TableHead className="w-16 px-2 py-3 text-right font-bold text-foreground sm:w-32 sm:px-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              dateFormatter={dateFormatter}
            />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

import { getCurrentProject } from "@/actions/projects";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Project {
  id: number;
  name: string;
  projectKey: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const GetProject = () => {
  const router = useRouter();
  const {
    data: projects,
    isLoading,
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

  const handleProjectClick = (project: Project) => {
    // Redirect to project dashboard
    const encodedKey = encodeURIComponent(project.projectKey);
    router.push(`/projects/${project.id}/dashboard?key=${encodedKey}`);
  };

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="hover:bg-orange-100 transition-colors border-b border-gray-200 cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <TableCell className="font-semibold text-blue-600 py-5 px-6">
                  {project.name}
                </TableCell>
                <TableCell className="text-orange-500 font-mono font-bold py-5 px-6">
                  {project.projectKey}
                </TableCell>
                <TableCell className="text-gray-600 py-5 px-6">
                  {new Date(project.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

import { getCurrentProject } from "@/actions/projects";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const GetProject = () => {
      const {
    data: user,
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
        <>
        <Table>
  <TableCaption>A list of your projects</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Name</TableHead>
      <TableHead>Key</TableHead>
      <TableHead>Owner</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {projects.map((project) => (
      <TableRow key={project.id}>
        <TableCell>{project.name}</TableCell>
        <TableCell>{project.key}</TableCell>
        <TableCell>{project.user_id}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
        </>
    );
}
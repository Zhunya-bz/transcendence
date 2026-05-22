"use client";

import { addProjectMemberByEmail, getProjectMembers } from "@/actions/members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { use } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";

const addMemberSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type ProjectMemberUser = {
  id: number;
  name: string;
  surname?: string | null;
  email: string;
  avatarUrl?: string | null;
};

type ProjectMember = {
  userId: number;
  projectId: number;
  role: string;
  user?: ProjectMemberUser;
};

interface MembersPageProps {
  params: Promise<{ projectId: string; projectKey: string }>;
}

export default function MembersPage({ params }: MembersPageProps) {
  const { projectId, projectKey } = use(params);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
    },
  });

  const { data: members = [], isLoading, isError } = useQuery<ProjectMember[]>({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
  });

  const addMemberMutation = useMutation({
    mutationFn: (values: z.infer<typeof addMemberSchema>) =>
      addProjectMemberByEmail(projectId, values.email),
    onSuccess: async () => {
      toast.success("Member added!");
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (values: z.infer<typeof addMemberSchema>) => {
    addMemberMutation.mutate(values);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <p className="text-sm text-gray-500">
          People on project {projectKey}
        </p>
      </div>

      <div>
        {isLoading && <p className="text-sm text-gray-500">Loading members...</p>}
        {isError && <p className="text-sm text-red-600">Could not load members.</p>}

        {!isLoading && members.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => {
              const user = member.user;
              const fullName = user
                ? `${user.name} ${user.surname ?? ""}`.trim()
                : `User ${member.userId}`;
              const initials = user?.name?.[0]?.toUpperCase() ?? "U";

              return (
                <Card
                  key={`${member.projectId}-${member.userId}`}
                  className="border border-orange-100 shadow-sm transition hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar size="lg" className="size-12 shrink-0">
                      <AvatarImage src={user?.avatarUrl ?? undefined} alt={fullName} />
                      <AvatarFallback className="bg-orange-100 font-semibold text-orange-800">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-blue-900">{fullName}</p>
                      <p className="truncate text-sm text-gray-500">{user?.email ?? "-"}</p>
                      <span className="mt-2 inline-flex rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                        {member.role}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Card className="border border-orange-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Add member</CardTitle>
          <CardDescription>
            Invite an existing user by email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="member@example.com"
                          className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-orange-500 font-semibold text-white hover:bg-orange-600"
                  disabled={addMemberMutation.isPending}
                >
                  {addMemberMutation.isPending ? "Adding..." : "Add member"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
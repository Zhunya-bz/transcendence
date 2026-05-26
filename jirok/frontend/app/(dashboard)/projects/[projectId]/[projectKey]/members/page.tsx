"use client";

import { getCurrentMe } from "@/actions/current-user";
import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
  updateProjectMemberRole,
  type ProjectMember,
  type ProjectMemberRole,
} from "@/actions/members";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, UserPlus, Shield, Eye, Users } from "lucide-react";
import { use } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const addMemberSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  role: z.enum(["Admin", "Member", "VIEWER"]),
});

const roleOptions: Array<{ value: ProjectMemberRole; label: string }> = [
  { value: "Member", label: "Member" },
  { value: "Admin", label: "Admin" },
  { value: "VIEWER", label: "Viewer" },
];

const ROLE_STYLES: Record<
  ProjectMemberRole,
  { badge: string; icon: React.ReactNode }
> = {
  Admin: {
    badge: "bg-orange-100 text-orange-800 border border-orange-100",
    icon: <Shield size={11} className="inline mr-1 -mt-0.5" />,
  },
  Member: {
    badge: "bg-blue-50 text-blue-800 border border-blue-100",
    icon: <Users size={11} className="inline mr-1 -mt-0.5" />,
  },
  VIEWER: {
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    icon: <Eye size={11} className="inline mr-1 -mt-0.5" />,
  },
};

function getInitials(name?: string, surname?: string, email?: string) {
  if (name && surname) {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  }
  return (
    name?.charAt(0).toUpperCase() ||
    email?.charAt(0).toUpperCase() ||
    "U"
  );
}

interface MembersPageProps {
  params: Promise<{ projectId: string; projectKey: string }>;
}

export default function MembersPage({ params }: MembersPageProps) {
  const { projectId, projectKey } = use(params);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { email: "", role: "Member" },
  });

  const {
    data: members = [],
    isLoading,
    isError,
  } = useQuery<ProjectMember[]>({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
  });

  const { data: currentUser } = useQuery<{ id: number } | null>({
    queryKey: ["current-user"],
    queryFn: getCurrentMe,
    retry: false,
  });

  const isProjectAdmin =
    currentUser != null &&
    members.some((m) => m.userId === currentUser.id && m.role === "Admin");

  // Mutation functions
  const addMemberMutation = useMutation({
    mutationFn: (values: z.infer<typeof addMemberSchema>) =>
      addProjectMember(projectId, { email: values.email, role: values.role }),
    onSuccess: async () => {
      toast.success("Member added!");
      form.reset();
      await queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateRoleMutation = useMutation({
    mutationFn: (values: { userId: number; role: ProjectMemberRole }) =>
      updateProjectMemberRole(projectId, values.userId, values.role),
    onSuccess: async () => {
      toast.success("Role updated");
      await queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: number) => removeProjectMember(projectId, userId),
    onSuccess: async () => {
      toast.success("Member removed");
      await queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Members</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {members.length} {members.length === 1 ? "person" : "people"} on{" "}
          <span className="font-medium text-gray-700">{projectKey}</span>
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        {isLoading && (
          <div className="py-10 text-center text-sm text-gray-400">
            Loading members…
          </div>
        )}
        {isError && (
          <div className="py-10 text-center text-sm text-red-500">
            Could not load members.
          </div>
        )}

        {!isLoading && members.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">
            No members yet.
          </div>
        )}

        {!isLoading &&
          members.map((member, idx) => {
            const user = member.user;
            const name = user?.name ?? "";
            const surname = user?.surname ?? "";
            const fullName =
              `${name} ${surname}`.trim() || `User ${member.userId}`;
            const initials = getInitials(name, surname, user?.email);
            const isMe = currentUser?.id === member.userId;
            const roleStyle = ROLE_STYLES[member.role] ?? ROLE_STYLES["Member"];

            return (
              <div
                key={`${member.projectId}-${member.userId}`}
                className={`flex items-center gap-3 px-4 py-3 bg-white ${
                  idx < members.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <Avatar className="size-9 transition shrink-0">
                  <AvatarImage src={(user as any)?.picture?.medium} alt="Avatar image" />
                  <AvatarFallback className="bg-blue-400 font-medium text-gray-900 flex items-center justify-center text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {fullName}
                    </span>
                    {isMe && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 border border-gray-200 shrink-0">
                        you
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email ?? "—"}
                  </p>
                </div>

                {isProjectAdmin && !isMe ? (
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      updateRoleMutation.mutate({
                        userId: member.userId,
                        role: value as ProjectMemberRole,
                      })
                    }
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    className={`text-[11px] px-2 py-1 rounded-md font-medium shrink-0 ${roleStyle.badge}`}
                  >
                    {roleStyle.icon}
                    {member.role === "VIEWER" ? "Viewer" : member.role}
                  </span>
                )}

                {/* Remove */}
                {isProjectAdmin && !isMe && (
                  <button
                    onClick={() => removeMemberMutation.mutate(member.userId)}
                    disabled={removeMemberMutation.isPending}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                    aria-label={`Remove ${fullName}`}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            );
          })}
      </div>

      {/* Invite form — admin only */}
      {isProjectAdmin ? (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <h2 className="text-sm font-semibold text-gray-900">
              Invite member
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Enter an email to invite.
            </p>
          </div>
          <div className="px-4 py-3 bg-white">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((v) => addMemberMutation.mutate(v))}
                className="space-y-4 w-full"
              >
                <div className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <div className="flex flex-col flex-1">
                        <label className="text-xs font-medium text-gray-500 mb-2">
                          Email
                        </label>
                        <input
                          {...field}
                          type="email"
                          placeholder="member@example.com"
                          className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
                        />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <div className="flex flex-col w-[120px]">
                        <label className="text-xs font-medium text-gray-500 mb-2">
                          Role
                        </label>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="min-h-[36px] w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={addMemberMutation.isPending}
                    className="h-9 px-4 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0 self-end"
                  >
                    <UserPlus size={14} />
                    {addMemberMutation.isPending ? "Adding…" : "Invite"}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-2">
          Only admins can invite members or change roles.
        </p>
      )}
    </div>
  );
}

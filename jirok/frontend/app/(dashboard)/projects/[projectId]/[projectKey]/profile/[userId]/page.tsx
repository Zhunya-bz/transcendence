"use client";

import { use, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getCurrentMe } from "@/actions/current-user";
import { getUserById } from "@/actions/users";
import { ProfileContent } from "@/components/ProfileContent";
import { toast } from "react-hot-toast";

interface ProjectUserProfilePageProps {
  params: Promise<{ projectId: string; projectKey: string; userId: string }>;
}

export default function ProjectUserProfilePage({
  params,
}: ProjectUserProfilePageProps) {
  const { projectId, projectKey, userId } = use(params);
  const router = useRouter();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentMe,
  });

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project-user", userId],
    queryFn: () => getUserById(userId),
  });

  useEffect(() => {
    if (currentUser?.id && Number(userId) === currentUser.id) {
      router.replace("/profile");
    }
  }, [currentUser?.id, router, userId]);

  if (currentUser?.id && Number(userId) === currentUser.id) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="py-10 text-center text-sm text-red-500">
        Could not load profile
      </div>
    );
  }

  return (
    <ProfileContent
      user={user}
      backHref={`/projects/${projectId}/${projectKey}/members`}
      backLabel="Back to members"
    />
  );
}

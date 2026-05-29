"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentMe } from "@/actions/current-user";
import { ProfileContent } from "@/components/ProfileContent";

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentMe,
  });

  return (
    <ProfileContent
      user={user}
      editable
      onUpdated={() =>
        queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      }
    />
  );
}

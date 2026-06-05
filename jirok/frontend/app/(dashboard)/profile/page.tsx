"use client";
import { Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentMe } from "@/actions/current-user";
import { ProfileContent } from "@/components/ProfileContent";

function ProfilePageInner() {
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

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageInner />
    </Suspense>
  );
}
"use client";

import { getBackendUrl } from "@/lib/backend";
import type { User } from "@/types/prisma";
import { parseError } from "./issues";

export const getCurrentMe = async (): Promise<User> => {
  const response = await fetch("api/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to get current user"));
  }

  return response.json();
};

export const getCurrentUserRole = async (projectId: string) => {
  const response = await fetch(`/api/projects/${projectId}/role`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to get current user role"));
  }

  return response.json();
};
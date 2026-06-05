"use client";

import { getBackendUrl } from "@/lib/backend";
import type { User } from "@/types/prisma";
import { parseError } from "./issues";

export const getUserById = async (userId: string | number): Promise<User> => {
  const response = await fetch(getBackendUrl(`/users/${userId}`), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to load user profile"));
  }

  return response.json();
};

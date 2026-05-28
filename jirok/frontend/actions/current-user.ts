"use client";

import type { User } from "@/types/prisma";
import { parseError } from "./auth";

export const getCurrentMe = async (): Promise<User> => {
  const response = await fetch("http://localhost:3001/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to get current user"));
  }

  return response.json();
};
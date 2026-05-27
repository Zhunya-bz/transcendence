"use client";

import type { User } from "@/types/prisma";

export const getCurrentMe = async (): Promise<User> => {
  const response = await fetch("http://localhost:3001/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};
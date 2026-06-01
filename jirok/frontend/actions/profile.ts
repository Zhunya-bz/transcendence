"use client";

import { User } from "@/types/prisma";
import { parseError } from "./issues";

export const updateUserProfile = async ({
  id,
  data,
}: {
  id: number;
  data: User,
}) => {
  try {
    const response = await fetch(`http://localhost:3001/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) throw new Error(await parseError(response, "Failed to update profile"));
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

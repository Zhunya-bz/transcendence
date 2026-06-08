"use client";

import type { User } from "@/types/prisma";
import { parseError } from "./issues";
export const updateUserProfile = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<User>;
}) => {
  try {
    const response = await fetch(`/api/users/${id}`, {
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

export const updateUserAvatar = async ({
  id,
  file,
}: {
  id: number;
  file: File;
}) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/users/${id}/avatar`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "Failed to update avatar"));
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

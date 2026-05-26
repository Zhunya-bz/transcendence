"use client";

export const updateUserProfile = async ({
  id,
  data,
}: {
  id: number;
  data: {
    name?: string;
    surname?: string;
    jobTitle?: string;
    location?: string;
    jobOrganization?: string;
    avatarUrl?: string;
  };
}) => {
  try {
    const response = await fetch(`http://localhost:3001/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to update profile");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

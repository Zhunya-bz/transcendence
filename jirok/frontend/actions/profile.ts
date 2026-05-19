"use server";

export const updateUserProfile = async (data: {
  name?: string;
  surname?: string;
  jobTitle?: string;
  location?: string;
  jobOrganization?: string;
  avatarUrl?: string;
}) => {
  try {
    const response = await fetch("http://backend:3001/auth/me", {
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

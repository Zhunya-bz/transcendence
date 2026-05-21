"use client";

export const getCurrentMe = async () => {
  const response = await fetch("http://localhost:3001/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};
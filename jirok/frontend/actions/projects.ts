"use server";

import { api } from "@/lib/api";

export const createProject = async (data: { name: string }) => {
  const response = await api("/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

export async function getCurrentProject() {
  // Mock data for testing - remove when backend is ready
  const mockProjects = [
    {
      id: 1,
      name: "User Management System",
      projectKey: "UMS",
      createdAt: new Date("2026-01-15").toISOString(),
      updatedAt: new Date("2026-05-10").toISOString(),
      deletedAt: null,
    },
    {
      id: 2,
      name: "Payment Gateway",
      projectKey: "PAY",
      createdAt: new Date("2026-02-20").toISOString(),
      updatedAt: new Date("2026-05-15").toISOString(),
      deletedAt: null,
    },
    {
      id: 3,
      name: "Analytics Dashboard",
      projectKey: "ANA",
      createdAt: new Date("2026-03-10").toISOString(),
      updatedAt: new Date("2026-05-17").toISOString(),
      deletedAt: null,
    },
  ];

  return Promise.resolve(mockProjects);

  // Original API call - uncomment when backend is ready:
  // const response = await fetch("http://localhost:3001/projects");
  // if (!response.ok) {
  //   throw new Error(`${response.status}: ${response.statusText}`);
  // }
  // return response.json();
}

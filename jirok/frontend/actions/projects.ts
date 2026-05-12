"use server";

export const createProject = async (data: { name: string }) => {
    const response = await fetch("http://localhost:3001/projects", {
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
}

export async function getCurrentProject() {
  const response = await fetch("http://localhost:3001/projects");
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return response.json();
}

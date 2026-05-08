'use server';
export const signin = async(data: { email: string; password: string }) => {
    const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    }).then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error(error));
}

export const signup = async(data: { name:string; email: string; password: string }) => {
    const res = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    }).then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error(error));
}

export async function getCurrentMe() {
  const res = await fetch("https://randomuser.me/api/")
  if (!res.ok) return null;
  return res.json();
}
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
    .catch(error => {console.error(error); return error.message});
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
    .catch(error => {console.error(error); return error.message});
}

export async function getCurrentMe() {
  const res = await fetch("https://randomuser.me/api/")
  .then(response => response.json)
  .then(data => {return data})
  .catch(error => {console.error(error); return error.message});
}
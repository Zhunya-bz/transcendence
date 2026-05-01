'use server';
export const signin = async(data: { email: string; password: string }) => {
    const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

export const signup = async(data: { name:string; email: string; password: string }) => {
    const res = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return res.json();
}
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const signin = async(data: { email: string; password: string }) => {
    const res = await fetch("http://backend:3001/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    const { accessToken } = await res.json();
    
    (await cookies()).set('token', accessToken, {
        httpOnly: true,
        secure: false, // true if you're using HTTPS
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect('/');
}

export const signup = async(data: { name:string; email: string; password: string }) => {
    const res = await fetch("http://backend:3001/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }

    const { accessToken } = await res.json();
    
    (await cookies()).set('token', accessToken, {
        httpOnly: true,
        secure: false, // true if you're using HTTPS
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect('/');
}
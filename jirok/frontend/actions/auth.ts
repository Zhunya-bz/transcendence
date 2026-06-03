"use server";

import { cookies } from "next/headers";

export const parseError = async (response: Response, fallbackMessage: string) => {
  const message = await response.json();
  return message.message ? message.message : `${response.status}: ${response.statusText}` || fallbackMessage;
};


export const signin = async (data: { email: string; password: string }) => {
  try {
    const response = await fetch("http://backend:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "Failed to login"));
    }

    const { accessToken } = await response.json();

    (await cookies()).set("token", accessToken, {
      httpOnly: true,
      secure: false, // true if you're using HTTPS
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch("http://backend:3001/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });



    if (!response.ok) {
      throw new Error(await parseError(response, "Failed to sign up"));
    }

    const { accessToken } = await response.json();

    (await cookies()).set("token", accessToken, {
      httpOnly: true,
      secure: false, // true if you're using HTTPS
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async () => {
    (await cookies()).delete("token");
  };
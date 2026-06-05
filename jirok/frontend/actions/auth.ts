"use server";

import { cookies } from "next/headers";

export type AuthResponse = {
  success: boolean;
  redirectTo?: string; // Optional, only exists on success
  error?: string;      // Optional, only exists on failure
};

export const parseError = async (response: Response, fallbackMessage: string) :Promise<AuthResponse> => {
  try {
    // 1. Check if the backend actually sent JSON before trying to parse it
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return { success: false, error: data.message || `${response.status}: ${response.statusText}` };
    }

    // 2. Fallback for HTML/Text error pages (e.g., 502 Bad Gateway)
    const textData = await response.text();
    return { success: false, error: textData ? `${response.status}: ${textData}` : fallbackMessage };
    
  } catch (error) {
    return { success: false, error: fallbackMessage };
  }
};

export const signin = async (data: { email: string; password: string }) :Promise<AuthResponse> => {
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
      const errorMessage = await parseError(response, "Failed to login");
      return errorMessage;
    }

    const result = await response.json();

    if (result.require2FA) {
      // Store the temp token in a cookie for the 2FA verification step
      (await cookies()).set("token", result.tempToken, {
        httpOnly: true,
        secure: false, // true if you're using HTTPS
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 5, // 5 minutes
      });
      return {
        success: true,
        redirectTo: "/login-2fa",
      };
    } else {
      const { accessToken } = result;

      (await cookies()).set("token", accessToken, {
        httpOnly: true,
        secure: false, // true if you're using HTTPS
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return {
        success: true,
        redirectTo: "/projects",
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) :Promise<AuthResponse> => {
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
      const errorMessage = await parseError(response, "Failed to sign up");
      return errorMessage;
    }

    const { accessToken } = await response.json();

    (await cookies()).set("token", accessToken, {
      httpOnly: true,
      secure: false, // true if you're using HTTPS
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async () => {
  (await cookies()).delete("token");
};

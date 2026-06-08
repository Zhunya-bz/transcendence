"use client";

import { parseError } from "./issues";

export async function generate2FA() {
  const response = await fetch(`/api/auth/2fa/generate`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to generate 2FA QR code"));
  }

  return response.json();
}

export async function enable2FA(code: string) {
  const response = await fetch(
    `/api/auth/2fa/enable`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to enable 2FA"));
  }

  return response.json();
}  


export async function verify2FA({
  code,
}: {
  code: string;
}) {
  const response = await fetch(
    `/api/auth/2fa/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        code,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response, "Failed to verify 2FA code"));
  }

  return response.json();
}
"use server"

import { cookies } from "next/headers";

type ApiRequest = RequestInit & {
    headers?: Record<string, string>;
}

export async function api(path: string, init: ApiRequest={}) {
    const headers: Record<string, string> = init.headers ?? {};

    const token = (await cookies()).get("token");
    if (token != null && token.value) {
        headers['Cookie'] = token.value;
    }

    return fetch(`http://backend:3000/${path}`, {
        ...init,
        headers,
    })
}
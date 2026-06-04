"use server"

import { cookies } from "next/headers";
import { getBackendUrl } from "./backend";

type ApiRequest = RequestInit & {
    headers?: Record<string, string>;
}

export async function api(path: string, init: ApiRequest={}) {
    const headers: Record<string, string> = init.headers ?? {};

    const token = (await cookies()).get("token");
    if (token != null && token.value) {
        headers['Cookie'] = token.value;
    }

<<<<<<< HEAD
    return fetch(`http://backend:3001${path}`, {
=======
    return fetch(getBackendUrl(path), {
>>>>>>> parent of 36d443b (revert changes to backend endpoinnt for auth (BFF))
        ...init,
        headers,
    })
}
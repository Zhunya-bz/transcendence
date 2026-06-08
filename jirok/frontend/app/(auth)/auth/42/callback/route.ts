// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const token = url.searchParams.get("token");

//   if (!token) {
//     return NextResponse.redirect(new URL("/sign-in", req.url));
//   }

//   const redirectUrl = new URL("/projects", req.url);

//   const response = NextResponse.redirect(redirectUrl);

//   response.cookies.set("token", token, {
//     httpOnly: true,
//     secure: false, // true if you're using HTTPS
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7,
//   });

//   return response;
// }

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", process.env.FRONTEND_URL ?? "http://localhost"));
  }

  const redirectUrl = new URL("/projects", process.env.FRONTEND_URL ?? "http://localhost");
  const response = NextResponse.redirect(redirectUrl, { status: 302 });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true, // true if you're using HTTPS
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
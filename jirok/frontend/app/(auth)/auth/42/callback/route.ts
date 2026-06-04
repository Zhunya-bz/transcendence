// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const token = url.searchParams.get("token");

//   if (!token) {
//     return NextResponse.redirect(new URL("/sign-in", req.url));
//   }

//   (await cookies()).set("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7,
//   });

//   return NextResponse.redirect(new URL("/", req.url));
// }

//Second try

// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const token = url.searchParams.get("token");

//   if (!token) {
//     return NextResponse.redirect(
//       new URL("/sign-in", req.url)
//     );
//   }

//   const response = NextResponse.redirect(
//     new URL("/projects", req.url)
//   );

//   response.cookies.set("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
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
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const redirectUrl = new URL("/projects", req.url);

  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
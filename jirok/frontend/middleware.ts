import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
console.log("Middleware executed. Token:", token);
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
     "/projects/:path*", // ✅ use the actual URL path
    "/profile/:path*",
  ],  // ← protected routes
};

// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const { pathname } = request.nextUrl;

//   const isProtected =
//     pathname.startsWith("/projects") ||
//     pathname.startsWith("/profile");

//   const isAuthPage =
//     pathname.startsWith("/sign-in") ||
//     pathname.startsWith("/sign-up");

//   // ❌ Block protected routes if no token
//   if (!token && isProtected) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   // ❌ Prevent logged-in users from seeing auth pages
//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL("/projects", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/projects/:path*",
//     "/profile/:path*",
//     "/sign-in",
//     "/sign-up",
//   ],
// };
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

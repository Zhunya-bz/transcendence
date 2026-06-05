import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
console.log("Middleware executed.");
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

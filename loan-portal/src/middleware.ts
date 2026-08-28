import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const publicPaths = ["/", "/auth/login", "/auth/register", "/api/auth/login", "/api/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith("/api/auth/"));

  if (isPublic) return NextResponse.next();

  const token = request.cookies.get("token")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const payload = verifyToken(token);
  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (payload.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads/).*)"],
};

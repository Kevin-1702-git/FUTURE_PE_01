import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Secret token check
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "development-secret-key-feastlane-12345"
  });

  const role = (token?.role as string | undefined) || null;
  const isStaff = role === "RESTAURANT_ADMIN" || role === "ADMIN" || role === "MANAGER" || role === "STAFF";
  const isCustomer = role === "CUSTOMER";

  // 1. Protect Admin Routes (/admin/* except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isCustomer) {
      // Rejects normal customer accounts from accessing admin dashboards
      return NextResponse.redirect(new URL("/customer/dashboard", req.url));
    }
  }

  // 2. Protect Customer Routes (/customer/*)
  if (pathname.startsWith("/customer")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isCustomer) {
      // Only customer accounts may access customer routes.
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"]
};

// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // štitimo /admin i /dashboard
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(url);
    }
    if (token.role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/profil", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard"],
};

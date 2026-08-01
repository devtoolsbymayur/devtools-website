import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Old /admin routes — hide existence
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const loginPath = `${ADMIN_BASE_PATH}/login`;

  if (pathname === loginPath || pathname.startsWith(`${loginPath}/`)) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (
    pathname === ADMIN_BASE_PATH ||
    pathname.startsWith(`${ADMIN_BASE_PATH}/`)
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const login = new URL(loginPath, request.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/admin-secure-portal-x051908/:path*"],
};

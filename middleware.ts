import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/utils/middleware/roleGuard";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // === API MIDDLEWARE SECTION ===
  if (pathname.startsWith("/api")) {
    const publicApiPaths = [
      "/api/super_admin",
      "/api/super_admin/sign-in",
      "/api/admin/sign-in",
      "/api/seller/sign-in",
      "/api/admin",
      "/api/seller",
      "/api/company", 
    ];

    if (publicApiPaths.includes(pathname)) {
      return NextResponse.next(); 
    }

    if (pathname.startsWith("/api/super_admin")) {
      const auth = await requireRole(request, ["super_admin"]);
      if (auth instanceof NextResponse) return auth;
    } else if (pathname.startsWith("/api/admin")) {
      const auth = await requireRole(request, ["admin"]);
      if (auth instanceof NextResponse) return auth;
    } else if (pathname.startsWith("/api/seller")) {
      const auth = await requireRole(request, ["seller"]);
      if (auth instanceof NextResponse) return auth;
    }

    return NextResponse.next();
  }

  // === FRONTEND MIDDLEWARE SECTION ===
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true";
  const role = request.cookies.get("userRole")?.value;

  const publicRoutes = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/otp",
    "/password-created",
  ];

  const isPublic = publicRoutes.includes(pathname);

  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
  }

  const isSellerRoute = pathname.startsWith("/seller");
  const isAdminRoute = pathname.startsWith("/admin");
  const isSuperAdminRoute = pathname.startsWith("/super-admin");

  if (isLoggedIn) {
    if (isSellerRoute && role !== "seller") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
    if (isSuperAdminRoute && role !== "superadmin") {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|static|.*\\.(?:svg|png|jpg|jpeg|webp|ico|css|js|woff2?|ttf|eot)).*)",
    "/api/:path*",
  ],
};

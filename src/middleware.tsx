// src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "js-cookie"; // Import Cookies for cookie management

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken");
  const isLoggedIn = !!refreshToken; // Check if the user is logged in

  // Redirect logged-in users to the dashboard if they try to access the login page
  if (isLoggedIn && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Check if the access token is present
  if (!refreshToken && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // Allow the request to continue if token is valid
  return NextResponse.next();
}

// Specify the routes to apply the middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/tables/:path*",
    "/forms/:path*",
    "/calendar/:path*",
    "/auth/:path*",
    "/chart/:path*",
    "/roles/:path*",
    "/permissions/:path*",
    "/customers/:path*",
    "/manageCompany/:path*",
    "/staff/:path*",
    "/provider/:path*",
    "/invoice/:path*",
    "/services/:path*",
    "/categories/:path*",
    "/bookings/:path*",
    "/reports/:path*",
    "/offers/:path*",
    "/login", // Ensure the login page is also matched
  ],
};

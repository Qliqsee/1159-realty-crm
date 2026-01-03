import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { User } from "@/types"
import { PermissionManager } from "@/lib/permissions/permission-manager"
import type { Permission } from "@/lib/permissions/types"

/**
 * Route -> Required Permission mapping
 * Add your protected routes here
 */
const ROUTE_PERMISSIONS: Record<string, Permission> = {
  "/": "view:analytics", // Dashboard at root
  "/leads": "view:lead",
  "/properties": "view:property",
  "/appointments": "view:appointment",
  "/clients": "view:client",
  "/client-interests": "view:interest",
  "/partnerships": "view:partnership",
  "/partners": "view:partner",
  "/agent": "view:commission", // Agent dashboard
  "/enrollments": "view:enrollment",
  "/invoices": "view:invoice",
  "/payments": "view:payment",
  "/kyc": "view:kyc",
  "/commissions": "view:commission",
  "/releases": "view:release",
  "/campaigns": "view:campaign",
  "/documents": "view:document",
  "/support": "view:support",
  "/analytics": "view:analytics",
  "/team": "view:team",
  "/locations": "view:location",
  "/settings": "view:settings",
  "/profile": "view:analytics", // Profile page accessible to all
}

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"]

/**
 * Middleware function to protect routes
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Check if this is the root path or a protected route
  const isProtectedRoute = pathname === "/" || Object.keys(ROUTE_PERMISSIONS).some(
    (route) => route !== "/" && pathname.startsWith(route)
  )

  // Get user from cookie
  const userCookie = request.cookies.get("user")
  let user: User | null = null

  if (userCookie?.value) {
    try {
      user = JSON.parse(userCookie.value)
    } catch (error) {
      console.error("Failed to parse user cookie:", error)
    }
  }

  // Redirect to login if not authenticated (only for protected routes)
  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check permission for specific routes
  const requiredPermission = ROUTE_PERMISSIONS[pathname]

  if (requiredPermission) {
    const hasPermission = PermissionManager.hasPermission(
      user,
      requiredPermission
    )

    if (!hasPermission) {
      // Redirect to root/dashboard if no permission
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Allow access
  return NextResponse.next()
}

/**
 * Matcher configuration
 * Specify which routes to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - files with extensions (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}

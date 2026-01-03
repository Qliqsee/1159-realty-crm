/**
 * Cookie management utilities
 * Provides both client-side and server-side cookie handling
 */

export * from "./base-cookie"
export * from "./client-cookie"

// Server actions - explicitly export to maintain "use server" directive
export {
  setUserCookie,
  getUserCookie,
  removeUserCookie,
} from "./server-cookie"

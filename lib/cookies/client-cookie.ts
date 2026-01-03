import type { User } from "@/types"
import { BaseCookie, type CookieConfig } from "./base-cookie"

/**
 * Client-side cookie handler
 * Uses document.cookie API to manage cookies in the browser
 */
export class ClientCookie extends BaseCookie {
  constructor(config: Partial<CookieConfig> = {}) {
    super(config)
  }

  /**
   * Set user cookie on client-side
   */
  setUser(user: User): void {
    if (typeof window === "undefined") {
      console.warn("ClientCookie.setUser called on server-side")
      return
    }

    const serializedUser = this.serializeUser(user)
    const cookieOptions = this.buildCookieOptions()

    document.cookie = `${this.config.name}=${encodeURIComponent(serializedUser)}; ${cookieOptions}`
  }

  /**
   * Get user from cookie on client-side
   */
  getUser(): User | null {
    if (typeof window === "undefined") {
      console.warn("ClientCookie.getUser called on server-side")
      return null
    }

    const cookies = document.cookie.split("; ")
    const userCookie = cookies.find((cookie) =>
      cookie.startsWith(`${this.config.name}=`)
    )

    if (!userCookie) {
      return null
    }

    const value = userCookie.split("=")[1]
    if (!value) {
      return null
    }

    try {
      const decodedValue = decodeURIComponent(value)
      return this.deserializeUser(decodedValue)
    } catch (error) {
      console.error("Failed to decode user cookie:", error)
      return null
    }
  }

  /**
   * Remove user cookie on client-side
   */
  removeUser(): void {
    if (typeof window === "undefined") {
      console.warn("ClientCookie.removeUser called on server-side")
      return
    }

    // Set cookie with Max-Age=0 to delete it
    document.cookie = `${this.config.name}=; Max-Age=0; Path=${this.config.path}`
  }
}

// Export singleton instance for easy usage
export const clientCookie = new ClientCookie()

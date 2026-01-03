import type { User } from "@/types"

/**
 * Cookie configuration interface
 */
export interface CookieConfig {
  name: string
  maxAge?: number // in seconds
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: "strict" | "lax" | "none"
  httpOnly?: boolean
}

/**
 * Base cookie utility class with common cookie operations
 * Extended by client and server-side cookie handlers
 */
export abstract class BaseCookie {
  protected config: CookieConfig

  constructor(config: Partial<CookieConfig> = {}) {
    this.config = {
      name: config.name || "user",
      maxAge: config.maxAge || 60 * 60 * 24 * 7, // 7 days default
      path: config.path || "/",
      domain: config.domain,
      secure: config.secure ?? process.env.NODE_ENV === "production",
      sameSite: config.sameSite || "lax",
      httpOnly: config.httpOnly ?? false,
    }
  }

  /**
   * Serialize user object to JSON string
   */
  protected serializeUser(user: User): string {
    return JSON.stringify(user)
  }

  /**
   * Deserialize JSON string to user object
   */
  protected deserializeUser(value: string): User | null {
    try {
      return JSON.parse(value) as User
    } catch (error) {
      console.error("Failed to parse user cookie:", error)
      return null
    }
  }

  /**
   * Build cookie options string for Set-Cookie header
   */
  protected buildCookieOptions(): string {
    const options: string[] = []

    if (this.config.maxAge) {
      options.push(`Max-Age=${this.config.maxAge}`)
    }

    if (this.config.path) {
      options.push(`Path=${this.config.path}`)
    }

    if (this.config.domain) {
      options.push(`Domain=${this.config.domain}`)
    }

    if (this.config.secure) {
      options.push("Secure")
    }

    if (this.config.sameSite) {
      options.push(`SameSite=${this.config.sameSite}`)
    }

    if (this.config.httpOnly) {
      options.push("HttpOnly")
    }

    return options.join("; ")
  }

  /**
   * Abstract methods to be implemented by child classes
   */
  abstract setUser(user: User): void | Promise<void>
  abstract getUser(): User | null | Promise<User | null>
  abstract removeUser(): void | Promise<void>
}

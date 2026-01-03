"use server"

import { cookies } from "next/headers"
import type { User } from "@/types"

/**
 * Cookie configuration
 */
const COOKIE_CONFIG = {
  name: "user",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  httpOnly: false,
}

/**
 * Serialize user object to JSON string
 */
function serializeUser(user: User): string {
  return JSON.stringify(user)
}

/**
 * Deserialize JSON string to user object
 */
function deserializeUser(value: string): User | null {
  try {
    return JSON.parse(value) as User
  } catch (error) {
    console.error("Failed to parse user cookie:", error)
    return null
  }
}

/**
 * Server actions for cookie management
 * Can be called from client components
 */

/**
 * Set user cookie on server-side
 */
export async function setUserCookie(user: User): Promise<void> {
  const serializedUser = serializeUser(user)
  const cookieStore = await cookies()

  cookieStore.set({
    name: COOKIE_CONFIG.name,
    value: serializedUser,
    maxAge: COOKIE_CONFIG.maxAge,
    path: COOKIE_CONFIG.path,
    secure: COOKIE_CONFIG.secure,
    sameSite: COOKIE_CONFIG.sameSite,
    httpOnly: COOKIE_CONFIG.httpOnly,
  })
}

/**
 * Get user from cookie on server-side
 */
export async function getUserCookie(): Promise<User | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get(COOKIE_CONFIG.name)

  if (!userCookie?.value) {
    return null
  }

  return deserializeUser(userCookie.value)
}

/**
 * Remove user cookie on server-side
 */
export async function removeUserCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_CONFIG.name)
}

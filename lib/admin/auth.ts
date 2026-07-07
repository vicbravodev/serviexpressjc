import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export type SessionClaims = { userId: string; email: string; role: "admin" | "user" | "none" }

export async function getSessionClaims(): Promise<SessionClaims | null> {
  const supabase = createClient(await cookies())
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims as Record<string, unknown> | undefined
  if (!claims) return null
  const appMeta = (claims.app_metadata ?? {}) as Record<string, unknown>
  return {
    userId: String(claims.sub ?? ""),
    email: String(claims.email ?? ""),
    role: (appMeta.role as SessionClaims["role"]) ?? "none",
  }
}

/** Exige sesión válida con rol admin|user. Redirige a login si no. Devuelve los claims. */
export async function requireStaff(): Promise<SessionClaims> {
  const claims = await getSessionClaims()
  if (!claims || (claims.role !== "admin" && claims.role !== "user")) redirect("/admin/login")
  return claims
}

/** Exige rol admin. Redirige a /admin si es user, a login si no hay sesión. */
export async function requireAdmin(): Promise<SessionClaims> {
  const claims = await getSessionClaims()
  if (!claims) redirect("/admin/login")
  if (claims.role !== "admin") redirect("/admin")
  return claims
}

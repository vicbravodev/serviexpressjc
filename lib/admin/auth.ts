import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"

export type SessionClaims = { userId: string; email: string; role: "admin" | "user" | "none" }

/**
 * Memoizado por request (React `cache`): layout + página + guards comparten una sola
 * verificación del JWT en vez de repetirla en cada nivel del árbol.
 */
export const getSessionClaims = cache(async (): Promise<SessionClaims | null> => {
  const supabase = createClient(await cookies())
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims as Record<string, unknown> | undefined
  if (!claims) return null
  const appMeta = (claims.app_metadata ?? {}) as Record<string, unknown>
  const userId = String(claims.sub ?? "")
  return {
    userId,
    email: String(claims.email ?? ""),
    role: (await currentRole(userId)) ?? (appMeta.role as SessionClaims["role"]) ?? "none",
  }
})

/**
 * El rol del JWT sigue vigente hasta que el token expira (1 h por defecto), aunque
 * un admin ya haya desactivado o degradado al usuario. `profiles` es la fuente de
 * verdad: una cuenta inactiva queda sin acceso al panel en el siguiente request.
 * Devuelve null si no hay fila o no hay service key, y entonces manda el JWT.
 * ponytail: RLS sigue leyendo el JWT, así que PostgREST directo conserva el acceso hasta que expire.
 */
async function currentRole(userId: string): Promise<SessionClaims["role"] | null> {
  if (!userId || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  const { data } = await createAdminClient()
    .from("profiles")
    .select("role, is_active")
    .eq("id", userId)
    .maybeSingle()
  if (!data) return null
  return data.is_active ? (data.role as SessionClaims["role"]) : "none"
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

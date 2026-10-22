import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { SECTIONS, type Section } from "@/lib/admin/meta"

export type SessionClaims = {
  userId: string
  email: string
  role: "admin" | "user" | "none"
  /** Secciones visibles: todas para admin, las de `profiles.permissions` para user. */
  sections: Section[]
}

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
  const profile = await currentProfile(userId)
  const role = profile?.role ?? (appMeta.role as SessionClaims["role"]) ?? "none"
  return {
    userId,
    email: String(claims.email ?? ""),
    role,
    sections: role === "admin" ? [...SECTIONS] : role === "user" ? (profile?.sections ?? []) : [],
  }
})

/**
 * El rol del JWT sigue vigente hasta que el token expira (1 h por defecto), aunque
 * un admin ya haya desactivado o degradado al usuario. `profiles` es la fuente de
 * verdad: una cuenta inactiva queda sin acceso al panel en el siguiente request.
 * Las secciones de un user salen de aquí, igual que en RLS (has_perm), así que quitar
 * una sección corta también el acceso por PostgREST directo.
 * Devuelve null si no hay fila o no hay service key, y entonces manda el JWT (user sin secciones).
 * ponytail: un admin desactivado conserva acceso por PostgREST hasta que expire su JWT.
 */
async function currentProfile(userId: string): Promise<{ role: SessionClaims["role"]; sections: Section[] } | null> {
  if (!userId || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  const { data } = await createAdminClient()
    .from("profiles")
    .select("role, is_active, permissions")
    .eq("id", userId)
    .maybeSingle()
  if (!data) return null
  if (!data.is_active) return { role: "none", sections: [] }
  const perms: string[] = data.permissions ?? []
  return { role: data.role as SessionClaims["role"], sections: SECTIONS.filter((s) => perms.includes(s)) }
}

/** Exige sesión válida con rol admin|user. Redirige a login si no. Devuelve los claims. */
export async function requireStaff(): Promise<SessionClaims> {
  const claims = await getSessionClaims()
  if (!claims || (claims.role !== "admin" && claims.role !== "user")) redirect("/admin/login")
  return claims
}

/** Exige acceso a la sección. Sin ella, de vuelta al tablero. */
export async function requireSection(section: Section): Promise<SessionClaims> {
  const claims = await requireStaff()
  if (!claims.sections.includes(section)) redirect("/admin")
  return claims
}

/** Exige rol admin. Redirige a /admin si es user, a login si no hay sesión. */
export async function requireAdmin(): Promise<SessionClaims> {
  const claims = await getSessionClaims()
  if (!claims) redirect("/admin/login")
  if (claims.role !== "admin") redirect("/admin")
  return claims
}

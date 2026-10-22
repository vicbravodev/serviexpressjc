import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { SECTIONS, type Section } from "@/lib/admin/meta"

export type StaffOption = { id: string; name: string; email: string; sections: Section[] }

type Row = { id: string; email: string; full_name: string | null; role: string; permissions: string[] | null }
const toOption = (p: Row): StaffOption => ({
  id: p.id,
  name: p.full_name || p.email,
  email: p.email,
  sections: p.role === "admin" ? [...SECTIONS] : SECTIONS.filter((s) => p.permissions?.includes(s)),
})

/** Quién puede llevar un registro de la sección (para el selector de asignado). */
export const canWork = (section: Section) => (s: StaffOption) => s.sections.includes(section)

/**
 * Cuentas del equipo para asignación. RLS solo deja a admin listar profiles, así que
 * usamos el cliente service_role; si no está configurado, degradamos al cliente normal
 * (admin ve todos; user solo se ve a sí mismo). Memoizado por request.
 */
export const getStaffOptions = cache(async (): Promise<StaffOption[]> => {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from("profiles")
      .select("id, email, full_name, role, permissions")
      .eq("is_active", true)
      .order("full_name", { ascending: true })
    return ((data ?? []) as Row[]).map(toOption)
  } catch {
    const supabase = createClient(await cookies())
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, permissions")
      .eq("is_active", true)
    return ((data ?? []) as Row[]).map(toOption)
  }
})

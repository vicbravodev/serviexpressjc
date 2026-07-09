import "server-only"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"

export type StaffOption = { id: string; name: string; email: string }

/**
 * Cuentas del equipo para asignación. RLS solo deja a admin listar profiles, así que
 * usamos el cliente service_role; si no está configurado, degradamos al cliente normal
 * (admin ve todos; user solo se ve a sí mismo).
 */
export async function getStaffOptions(): Promise<StaffOption[]> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from("profiles")
      .select("id, email, full_name, is_active")
      .eq("is_active", true)
      .order("full_name", { ascending: true })
    return (data ?? []).map((p) => ({ id: p.id, name: p.full_name || p.email, email: p.email }))
  } catch {
    const supabase = createClient(await cookies())
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, is_active")
      .eq("is_active", true)
    return (data ?? []).map((p) => ({ id: p.id, name: p.full_name || p.email, email: p.email }))
  }
}

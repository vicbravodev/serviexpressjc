import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export type PendingCounts = { newLeads: number; newPartners: number; newApplications: number | null }

/**
 * Contadores de pendientes (status = 'new') para el sidebar y el tablero.
 * Memoizado por request: el layout y /admin comparten el mismo resultado en vez
 * de lanzar las mismas consultas dos veces. Las tres corren en paralelo.
 */
export const getPendingCounts = cache(async (isAdmin: boolean): Promise<PendingCounts> => {
  const supabase = createClient(await cookies())
  const countNew = (table: string) =>
    supabase.from(table).select("id", { count: "exact", head: true }).eq("status", "new")
  const [leads, partners, apps] = await Promise.all([
    countNew("load_requests"),
    countNew("partner_leads"),
    isAdmin ? countNew("job_applications") : Promise.resolve(null),
  ])
  return {
    newLeads: leads.count ?? 0,
    newPartners: partners.count ?? 0,
    newApplications: apps ? (apps.count ?? 0) : null,
  }
})

import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import type { Section } from "@/lib/admin/meta"

/** Pendientes por sección; null en las que la persona no tiene acceso. */
export type PendingCounts = Record<Section, number | null>

const TABLE: Record<Section, string> = {
  leads: "load_requests",
  socios: "partner_leads",
  postulaciones: "job_applications",
}

/**
 * Contadores de pendientes (status = 'new') para el sidebar y el tablero.
 * Memoizado por request: el layout y /admin pasan el mismo arreglo `sections` de los
 * claims (también memoizados), así que comparten resultado. Corren en paralelo.
 */
export const getPendingCounts = cache(async (sections: Section[]): Promise<PendingCounts> => {
  const supabase = createClient(await cookies())
  const keys = Object.keys(TABLE) as Section[]
  const results = await Promise.all(
    keys.map((s) =>
      sections.includes(s)
        ? supabase.from(TABLE[s]).select("id", { count: "exact", head: true }).eq("status", "new")
        : null,
    ),
  )
  return Object.fromEntries(keys.map((s, i) => [s, results[i] ? (results[i].count ?? 0) : null])) as PendingCounts
})

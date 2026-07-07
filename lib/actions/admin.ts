"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { getSessionClaims } from "@/lib/admin/auth"

const LEAD_STATUSES = ["new", "contacted", "in_progress", "won", "lost"] as const
const APPLICATION_STATUSES = ["new", "reviewed", "contacted", "hired", "rejected"] as const

async function requireRole(roles: Array<"admin" | "user">) {
  const claims = await getSessionClaims()
  if (!claims || !roles.includes(claims.role as "admin" | "user")) {
    throw new Error("No autorizado")
  }
  const supabase = createClient(await cookies())
  return { claims, supabase }
}

export async function updateLeadStatus(id: string, status: string, lostReason?: string) {
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) throw new Error("Status inválido")
  const { supabase } = await requireRole(["admin", "user"])
  const patch: Record<string, unknown> = { status }
  patch.lost_reason = status === "lost" ? (lostReason?.trim() || null) : null
  const { error } = await supabase.from("load_requests").update(patch).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/leads/${id}`)
  revalidatePath("/admin/leads")
}

export async function updateApplicationStatus(id: string, status: string) {
  if (!APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) throw new Error("Status inválido")
  const { supabase } = await requireRole(["admin"])
  const { error } = await supabase.from("job_applications").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/postulaciones/${id}`)
  revalidatePath("/admin/postulaciones")
}

export async function addNote(entityType: "load_request" | "job_application", entityId: string, note: string) {
  const roles: Array<"admin" | "user"> = entityType === "load_request" ? ["admin", "user"] : ["admin"]
  const { claims, supabase } = await requireRole(roles)
  const body = note.trim()
  if (!body) throw new Error("La nota está vacía")
  const { error } = await supabase.from("audit_log").insert({
    actor_id: claims.userId,
    actor_email: claims.email,
    entity_type: entityType,
    entity_id: entityId,
    action: "note",
    note: body,
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/${entityType === "load_request" ? "leads" : "postulaciones"}/${entityId}`)
}

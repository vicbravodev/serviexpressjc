"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
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

export async function updateApplicationStatus(id: string, status: string, reason?: string) {
  if (!APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) throw new Error("Status inválido")
  const { claims, supabase } = await requireRole(["admin"])
  const { error } = await supabase.from("job_applications").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  // job_applications no tiene columna de motivo; el motivo del rechazo queda como nota en el audit.
  const body = reason?.trim()
  if (status === "rejected" && body) {
    await supabase.from("audit_log").insert({
      actor_id: claims.userId,
      actor_email: claims.email,
      entity_type: "job_application",
      entity_id: id,
      action: "note",
      note: `Motivo del rechazo: ${body}`,
    })
  }
  revalidatePath(`/admin/postulaciones/${id}`)
  revalidatePath("/admin/postulaciones")
}

export async function updateAssignee(
  entityType: "load_request" | "job_application",
  entityId: string,
  assigneeId: string | null,
  assigneeName?: string,
) {
  const roles: Array<"admin" | "user"> = entityType === "load_request" ? ["admin", "user"] : ["admin"]
  const { claims, supabase } = await requireRole(roles)
  const table = entityType === "load_request" ? "load_requests" : "job_applications"
  const { data: updated, error } = await supabase
    .from(table)
    .update({ assigned_to: assigneeId })
    .eq("id", entityId)
    .select("id")
  if (error) throw new Error(error.message)
  if (!updated || updated.length === 0) throw new Error("Registro no encontrado")
  // El trigger solo audita cambios de status; la asignación se registra como nota.
  await supabase.from("audit_log").insert({
    actor_id: claims.userId,
    actor_email: claims.email,
    entity_type: entityType,
    entity_id: entityId,
    action: "note",
    note: assigneeId ? `Asignó la gestión a ${assigneeName ?? "un integrante del equipo"}` : "Quitó la asignación",
  })
  const base = entityType === "load_request" ? "leads" : "postulaciones"
  revalidatePath(`/admin/${base}/${entityId}`)
  revalidatePath(`/admin/${base}`)
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

export async function createUser(input: { email: string; password: string; fullName?: string; role: "admin" | "user" }) {
  const { claims } = await requireRole(["admin"])
  // Defensa en profundidad: valida el rol server-side (el tipo TS no protege una invocación RPC directa).
  if (!(["admin", "user"] as const).includes(input.role)) throw new Error("Rol inválido")
  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email.trim(),
    password: input.password,
    email_confirm: true,
    app_metadata: { role: input.role },
    user_metadata: { full_name: input.fullName?.trim() || null },
  })
  if (error || !data.user) throw new Error(error?.message ?? "No se pudo crear el usuario")
  const { error: pErr } = await admin.from("profiles").upsert({
    id: data.user.id,
    email: input.email.trim(),
    full_name: input.fullName?.trim() || null,
    role: input.role,
    is_active: true,
  })
  if (pErr) throw new Error(pErr.message)
  await admin.from("audit_log").insert({
    actor_id: claims.userId, actor_email: claims.email,
    entity_type: "user", entity_id: data.user.id, action: "user_create",
    new_value: { email: input.email.trim(), role: input.role },
  })
  revalidatePath("/admin/usuarios")
}

export async function updateUserRole(userId: string, role: "admin" | "user") {
  const { claims } = await requireRole(["admin"])
  const admin = createAdminClient()
  const { data: before } = await admin.from("profiles").select("role").eq("id", userId).single()
  const { error } = await admin.auth.admin.updateUserById(userId, { app_metadata: { role } })
  if (error) throw new Error(error.message)
  const { data: updated, error: pErr } = await admin.from("profiles").update({ role }).eq("id", userId).select("id")
  if (pErr) throw new Error(pErr.message)
  if (!updated || updated.length === 0) throw new Error("Usuario no encontrado")
  await admin.from("audit_log").insert({
    actor_id: claims.userId, actor_email: claims.email,
    entity_type: "user", entity_id: userId, action: "role_change",
    old_value: before ?? null, new_value: { role },
  })
  revalidatePath("/admin/usuarios")
}

export async function setUserActive(userId: string, isActive: boolean) {
  const { claims } = await requireRole(["admin"])
  const admin = createAdminClient()
  const { error: banErr } = await admin.auth.admin.updateUserById(userId, { ban_duration: isActive ? "none" : "876000h" })
  if (banErr) throw new Error(banErr.message)
  const { data: updated, error: pErr } = await admin.from("profiles").update({ is_active: isActive }).eq("id", userId).select("id")
  if (pErr) throw new Error(pErr.message)
  if (!updated || updated.length === 0) throw new Error("Usuario no encontrado")
  await admin.from("audit_log").insert({
    actor_id: claims.userId, actor_email: claims.email,
    entity_type: "user", entity_id: userId, action: "user_update",
    new_value: { is_active: isActive },
  })
  revalidatePath("/admin/usuarios")
}

"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { getSessionClaims } from "@/lib/admin/auth"
import { SECTIONS, type Section } from "@/lib/admin/meta"

const LEAD_STATUSES = ["new", "contacted", "in_progress", "won", "lost"] as const
const APPLICATION_STATUSES = ["new", "reviewed", "contacted", "hired", "rejected"] as const

/**
 * Next oculta en producción el mensaje de un error lanzado en una Server Action
 * ("An error occurred in the Server Components render…"). Las acciones devuelven
 * el error como dato para que el panel muestre el motivo real.
 */
function withResult<A extends unknown[]>(fn: (...args: A) => Promise<void>) {
  return async (...args: A): Promise<{ error?: string }> => {
    try {
      await fn(...args)
      return {}
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Error inesperado" }
    }
  }
}

/** Sección del panel (admin la tiene siempre) o "admin" para la gestión de usuarios. */
async function requireAccess(need: Section | "admin") {
  const claims = await getSessionClaims()
  const ok = need === "admin" ? claims?.role === "admin" : claims?.sections.includes(need)
  if (!claims || !ok) throw new Error("No autorizado")
  const supabase = createClient(await cookies())
  return { claims, supabase }
}

/** Solo secciones conocidas, sin repetir, en orden fijo (el CHECK de la base rechaza el resto). */
function cleanSections(input: unknown): Section[] {
  const list = Array.isArray(input) ? input : []
  return SECTIONS.filter((s) => list.includes(s))
}

export const updateLeadStatus = withResult(async (id: string, status: string, lostReason?: string) => {
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) throw new Error("Status inválido")
  const { supabase } = await requireAccess("leads")
  const patch: Record<string, unknown> = { status }
  patch.lost_reason = status === "lost" ? (lostReason?.trim() || null) : null
  const { error } = await supabase.from("load_requests").update(patch).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/leads/${id}`)
  revalidatePath("/admin/leads")
})

export const updatePartnerStatus = withResult(async (id: string, status: string, lostReason?: string) => {
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) throw new Error("Status inválido")
  const { supabase } = await requireAccess("socios")
  const patch: Record<string, unknown> = { status }
  patch.lost_reason = status === "lost" ? (lostReason?.trim() || null) : null
  const { error } = await supabase.from("partner_leads").update(patch).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/socios/${id}`)
  revalidatePath("/admin/socios")
})

export const updateApplicationStatus = withResult(async (id: string, status: string, reason?: string) => {
  if (!APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) throw new Error("Status inválido")
  const { claims, supabase } = await requireAccess("postulaciones")
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
})

type EntityType = "load_request" | "job_application" | "partner_lead"

const ENTITY_TABLE: Record<EntityType, string> = {
  load_request: "load_requests",
  job_application: "job_applications",
  partner_lead: "partner_leads",
}
const ENTITY_BASE: Record<EntityType, string> = {
  load_request: "leads",
  job_application: "postulaciones",
  partner_lead: "socios",
}
const ENTITY_SECTION: Record<EntityType, Section> = {
  load_request: "leads",
  job_application: "postulaciones",
  partner_lead: "socios",
}

export const updateAssignee = withResult(async (
  entityType: EntityType,
  entityId: string,
  assigneeId: string | null,
  assigneeName?: string,
) => {
  const { claims, supabase } = await requireAccess(ENTITY_SECTION[entityType])
  const { data: updated, error } = await supabase
    .from(ENTITY_TABLE[entityType])
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
  const base = ENTITY_BASE[entityType]
  revalidatePath(`/admin/${base}/${entityId}`)
  revalidatePath(`/admin/${base}`)
})

export const addNote = withResult(async (entityType: EntityType, entityId: string, note: string) => {
  const { claims, supabase } = await requireAccess(ENTITY_SECTION[entityType])
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
  revalidatePath(`/admin/${ENTITY_BASE[entityType]}/${entityId}`)
})

export const createUser = withResult(async (input: {
  email: string
  password: string
  fullName?: string
  role: "admin" | "user"
  permissions: Section[]
}) => {
  const { claims } = await requireAccess("admin")
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
    permissions: cleanSections(input.permissions),
  })
  if (pErr) throw new Error(pErr.message)
  await admin.from("audit_log").insert({
    actor_id: claims.userId, actor_email: claims.email,
    entity_type: "user", entity_id: data.user.id, action: "user_create",
    new_value: { email: input.email.trim(), role: input.role, permissions: cleanSections(input.permissions) },
  })
  revalidatePath("/admin/usuarios")
})

export const updateUserRole = withResult(async (userId: string, role: "admin" | "user") => {
  const { claims } = await requireAccess("admin")
  if (!(["admin", "user"] as const).includes(role)) throw new Error("Rol inválido")
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
})

/** Secciones de una cuenta "user"; efecto inmediato (RLS las lee de profiles). */
export const updateUserPermissions = withResult(async (userId: string, permissions: Section[]) => {
  const { claims } = await requireAccess("admin")
  const next = cleanSections(permissions)
  const admin = createAdminClient()
  const { data: before } = await admin.from("profiles").select("permissions").eq("id", userId).single()
  const { data: updated, error } = await admin.from("profiles").update({ permissions: next }).eq("id", userId).select("id")
  if (error) throw new Error(error.message)
  if (!updated || updated.length === 0) throw new Error("Usuario no encontrado")
  await admin.from("audit_log").insert({
    actor_id: claims.userId, actor_email: claims.email,
    entity_type: "user", entity_id: userId, action: "permissions_change",
    old_value: before ?? null, new_value: { permissions: next },
  })
  revalidatePath("/admin/usuarios")
})

export const setUserActive = withResult(async (userId: string, isActive: boolean) => {
  const { claims } = await requireAccess("admin")
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
})

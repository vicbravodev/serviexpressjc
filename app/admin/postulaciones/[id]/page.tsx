import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { requireSection } from "@/lib/admin/auth"
import {
  applicationStatusMeta,
  experienceLabel,
  fmtShort,
  folio,
  NO_DATA,
  positionLabel,
} from "@/lib/admin/meta"
import { canWork, getStaffOptions } from "@/lib/admin/staff"
import { createClient } from "@/utils/supabase/server"
import { AuditHistory, type AuditRow } from "@/app/admin/_components/audit-history"
import { DetailPage, Fields } from "@/app/admin/_components/detail"
import { ManagePanel } from "@/app/admin/_components/manage-panel"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return { title: folio("POS", (await params).id) }
}

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireSection("postulaciones")
  const { id } = await params
  const supabase = createClient(await cookies())

  const [{ data: app }, { data: timeline }, staff] = await Promise.all([
    supabase.from("job_applications").select("*").eq("id", id).single(),
    supabase
      .from("audit_log")
      .select("id, created_at, actor_email, action, old_value, new_value, note")
      .eq("entity_type", "job_application")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(100),
    getStaffOptions(),
  ])
  if (!app) notFound()

  return (
    <DetailPage
      folio={folio("POS", id)}
      status={applicationStatusMeta(app.status)}
      title={app.name}
      subtitle={`${positionLabel(app.position)}, ${experienceLabel(app.experience).toLowerCase()}`}
      phone={app.phone}
      fields={
        <Fields
          items={[
            { label: "Puesto", value: positionLabel(app.position) },
            { label: "Experiencia", value: experienceLabel(app.experience) },
            { label: "Teléfono", value: app.phone || NO_DATA },
            { label: "Idioma del sitio", value: app.locale === "en" ? "Inglés" : "Español" },
            { label: "Recibida", value: fmtShort(app.created_at) },
          ]}
        />
      }
      manage={
        <ManagePanel
          kind="application"
          id={id}
          status={app.status}
          assigneeId={app.assigned_to}
          staff={staff.filter(canWork("postulaciones")).map((s) => ({ id: s.id, name: s.name }))}
        />
      }
      history={
        <AuditHistory
          rows={(timeline ?? []) as AuditRow[]}
          statusLabel={applicationStatusMeta}
          nameByEmail={new Map(staff.map((s) => [s.email, s.name]))}
        />
      }
    />
  )
}

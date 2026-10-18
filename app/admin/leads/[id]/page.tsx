import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import {
  fmtShort,
  folio,
  leadStatusMeta,
  NO_DATA,
  serviceLabel,
  unitLabel,
  urgencyLabel,
} from "@/lib/admin/meta"
import { getStaffOptions } from "@/lib/admin/staff"
import { createClient } from "@/utils/supabase/server"
import { AuditHistory, type AuditRow } from "@/app/admin/_components/audit-history"
import { DetailPage, Fields } from "@/app/admin/_components/detail"
import { ManagePanel } from "@/app/admin/_components/manage-panel"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return { title: folio("COT", (await params).id) }
}

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff()
  const { id } = await params
  const supabase = createClient(await cookies())

  const [{ data: lead }, { data: timeline }, staff] = await Promise.all([
    supabase.from("load_requests").select("*").eq("id", id).single(),
    supabase
      .from("audit_log")
      .select("id, created_at, actor_email, action, old_value, new_value, note")
      .eq("entity_type", "load_request")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(100),
    getStaffOptions(),
  ])
  if (!lead) notFound()

  const route = `${lead.origin_name || "Sin origen"} → ${lead.destination_name || "Sin destino"}`
  return (
    <DetailPage
      folio={folio("COT", id)}
      status={leadStatusMeta(lead.status)}
      flag={lead.urgency === "urgente" ? <span className="text-xs font-medium text-destructive">Urgente</span> : null}
      title={lead.contact_name || lead.contact_phone || "Sin contacto"}
      subtitle={route}
      phone={lead.contact_phone}
      fields={
        <Fields
          items={[
            { label: "Ruta", value: route, wide: true },
            { label: "Servicio", value: serviceLabel(lead.service) },
            { label: "Unidad", value: unitLabel(lead.unit) },
            { label: "Mercancía", value: lead.cargo || "Sin especificar" },
            { label: "Peso", value: lead.tons != null ? `${lead.tons} t` : NO_DATA },
            { label: "Distancia", value: lead.distance_km != null ? `${lead.distance_km} km` : NO_DATA },
            { label: "Urgencia", value: urgencyLabel(lead.urgency) },
            { label: "Contacto", value: lead.contact_name || NO_DATA },
            { label: "Teléfono", value: lead.contact_phone || NO_DATA },
            { label: "Idioma del sitio", value: lead.locale === "en" ? "Inglés" : "Español" },
            { label: "Recibida", value: fmtShort(lead.created_at) },
            ...(lead.status === "lost" && lead.lost_reason
              ? [{ label: "Motivo de pérdida", value: lead.lost_reason, wide: true }]
              : []),
          ]}
        />
      }
      manage={
        <ManagePanel
          kind="lead"
          id={id}
          status={lead.status}
          assigneeId={lead.assigned_to}
          staff={staff.map((s) => ({ id: s.id, name: s.name }))}
        />
      }
      history={
        <AuditHistory
          rows={(timeline ?? []) as AuditRow[]}
          statusLabel={leadStatusMeta}
          nameByEmail={new Map(staff.map((s) => [s.email, s.name]))}
        />
      }
    />
  )
}

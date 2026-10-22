import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { requireSection } from "@/lib/admin/auth"
import { fmtShort, folio, leadStatusMeta, NO_DATA, partnerUnitLabel } from "@/lib/admin/meta"
import { canWork, getStaffOptions } from "@/lib/admin/staff"
import { createClient } from "@/utils/supabase/server"
import { AuditHistory, type AuditRow } from "@/app/admin/_components/audit-history"
import { DetailPage, Fields } from "@/app/admin/_components/detail"
import { ManagePanel } from "@/app/admin/_components/manage-panel"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return { title: folio("SOC", (await params).id) }
}

export default async function PartnerLeadDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireSection("socios")
  const { id } = await params
  const supabase = createClient(await cookies())

  const [{ data: lead }, { data: timeline }, staff] = await Promise.all([
    supabase.from("partner_leads").select("*").eq("id", id).single(),
    supabase
      .from("audit_log")
      .select("id, created_at, actor_email, action, old_value, new_value, note")
      .eq("entity_type", "partner_lead")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(100),
    getStaffOptions(),
  ])
  if (!lead) notFound()

  return (
    <DetailPage
      folio={folio("SOC", id)}
      status={leadStatusMeta(lead.status)}
      title={lead.name}
      subtitle={partnerUnitLabel(lead.unit_type)}
      phone={lead.phone}
      fields={
        <Fields
          items={[
            { label: "Nombre", value: lead.name },
            { label: "Teléfono", value: lead.phone || NO_DATA },
            { label: "Unidad", value: partnerUnitLabel(lead.unit_type) },
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
          kind="partner"
          id={id}
          status={lead.status}
          assigneeId={lead.assigned_to}
          staff={staff.filter(canWork("socios")).map((s) => ({ id: s.id, name: s.name }))}
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

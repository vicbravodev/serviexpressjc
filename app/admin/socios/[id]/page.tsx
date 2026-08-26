import Link from "next/link"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import { fmtShort, folio, leadStatusMeta, partnerUnitLabel } from "@/lib/admin/meta"
import { getStaffOptions } from "@/lib/admin/staff"
import { createClient } from "@/utils/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuditHistory, type AuditRow } from "@/app/admin/_components/audit-history"
import { ManagePanel } from "@/app/admin/_components/manage-panel"

export const dynamic = "force-dynamic"

export default async function PartnerLeadDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff()
  const { id } = await params
  const supabase = createClient(await cookies())

  const [{ data: lead }, { data: timeline }, staff] = await Promise.all([
    supabase.from("partner_leads").select("*").eq("id", id).single(),
    supabase
      .from("audit_log")
      .select("id, created_at, actor_email, action, old_value, new_value, note")
      .eq("entity_type", "partner_lead")
      .eq("entity_id", id)
      .order("created_at", { ascending: false }),
    getStaffOptions(),
  ])
  if (!lead) notFound()

  const meta = leadStatusMeta(lead.status)
  const mono = "font-mono text-sm"
  const txt = "text-sm"
  const pairs = [
    { k: "UNIDAD", v: partnerUnitLabel(lead.unit_type), cls: txt },
    { k: "TELÉFONO", v: lead.phone || "—", cls: mono },
    { k: "IDIOMA", v: lead.locale === "en" ? "Inglés" : "Español", cls: txt },
    { k: "RECIBIDA", v: fmtShort(lead.created_at), cls: mono },
  ]
  if (lead.status === "lost" && lead.lost_reason) {
    pairs.push({ k: "MOTIVO PÉRDIDA", v: lead.lost_reason, cls: txt })
  }

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 p-6">
      <div className="flex flex-col items-start gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/socios">← Volver a Socios comerciales</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">{folio("SOC", id)}</span>
          <Badge variant={meta.variant} className={meta.className}>
            {meta.label}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
        <p className="text-sm text-muted-foreground">{partnerUnitLabel(lead.unit_type)}</p>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-[300px] flex-[1.2] flex-col gap-4 sm:min-w-[320px]">
          <Card>
            <CardHeader>
              <CardTitle>Solicitante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3.5 gap-x-5 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
                {pairs.map((par) => (
                  <div key={par.k} className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">{par.k}</span>
                    <span className={par.cls}>{par.v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex min-w-[300px] flex-1 flex-col gap-4 sm:min-w-[320px]">
          <ManagePanel
            kind="partner"
            id={id}
            status={lead.status}
            assigneeId={lead.assigned_to}
            staff={staff.map((s) => ({ id: s.id, name: s.name }))}
          />
          <AuditHistory rows={(timeline ?? []) as AuditRow[]} statusLabel={leadStatusMeta} />
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import {
  fmtShort,
  folio,
  leadStatusMeta,
  serviceLabel,
  unitLabel,
  urgencyLabel,
} from "@/lib/admin/meta"
import { getStaffOptions } from "@/lib/admin/staff"
import { createClient } from "@/utils/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuditHistory, type AuditRow } from "@/app/admin/_components/audit-history"
import { ManagePanel } from "@/app/admin/_components/manage-panel"

export const dynamic = "force-dynamic"

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
      .order("created_at", { ascending: false }),
    getStaffOptions(),
  ])
  if (!lead) notFound()

  const meta = leadStatusMeta(lead.status)
  const contacto = lead.contact_name || lead.contact_phone || "Sin contacto"
  const mono = "font-mono text-sm"
  const txt = "text-sm"
  const cards: Array<{ titulo: string; pairs: Array<{ k: string; v: string; cls: string }> }> = [
    {
      titulo: "Embarque",
      pairs: [
        { k: "RUTA", v: `${lead.origin_name || "—"} → ${lead.destination_name || "—"}`, cls: txt },
        { k: "SERVICIO", v: serviceLabel(lead.service), cls: txt },
        { k: "UNIDAD", v: unitLabel(lead.unit), cls: txt },
        { k: "TONELADAS", v: lead.tons != null ? `${lead.tons} t` : "—", cls: mono },
        { k: "MERCANCÍA", v: lead.cargo || "Sin especificar", cls: txt },
        { k: "DISTANCIA", v: lead.distance_km != null ? `${lead.distance_km} km` : "—", cls: mono },
        { k: "URGENCIA", v: urgencyLabel(lead.urgency), cls: txt },
      ],
    },
    {
      titulo: "Contacto",
      pairs: [
        { k: "NOMBRE", v: lead.contact_name || "—", cls: txt },
        { k: "TELÉFONO", v: lead.contact_phone || "—", cls: mono },
        { k: "IDIOMA", v: lead.locale === "en" ? "Inglés" : "Español", cls: txt },
        { k: "RECIBIDA", v: fmtShort(lead.created_at), cls: mono },
      ],
    },
  ]
  if (lead.status === "lost" && lead.lost_reason) {
    cards[0].pairs.push({ k: "MOTIVO PÉRDIDA", v: lead.lost_reason, cls: txt })
  }

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 p-6">
      <div className="flex flex-col items-start gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/leads">← Volver a Cotizaciones</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">{folio("COT", id)}</span>
          <Badge variant={meta.variant} className={meta.className}>
            {meta.label}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{contacto}</h1>
        <p className="text-sm text-muted-foreground">
          {lead.origin_name || "—"} → {lead.destination_name || "—"} · {serviceLabel(lead.service)} ·{" "}
          {unitLabel(lead.unit)}
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-[300px] flex-[1.2] flex-col gap-4 sm:min-w-[320px]">
          {cards.map((card) => (
            <Card key={card.titulo}>
              <CardHeader>
                <CardTitle>{card.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3.5 gap-x-5 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
                  {card.pairs.map((par) => (
                    <div key={par.k} className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">{par.k}</span>
                      <span className={par.cls}>{par.v}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex min-w-[300px] flex-1 flex-col gap-4 sm:min-w-[320px]">
          <ManagePanel
            kind="lead"
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

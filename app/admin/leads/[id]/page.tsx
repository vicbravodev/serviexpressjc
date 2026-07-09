import Link from "next/link"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { ArrowLeft } from "lucide-react"
import { requireStaff } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusForm } from "@/app/admin/_components/status-form"
import { NoteForm } from "@/app/admin/_components/note-form"
import { StatusBadge } from "@/app/admin/_components/status-badge"

export const dynamic = "force-dynamic"
const LEAD_STATUSES = ["new", "contacted", "in_progress", "won", "lost"]

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff()
  const { id } = await params
  const supabase = createClient(await cookies())

  const { data: lead } = await supabase.from("load_requests").select("*").eq("id", id).single()
  if (!lead) notFound()
  const { data: timeline } = await supabase
    .from("audit_log")
    .select("id, created_at, actor_email, action, old_value, new_value, note")
    .eq("entity_type", "load_request")
    .eq("entity_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Solicitudes
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{lead.origin_name} → {lead.destination_name}</h1>
        <StatusBadge status={lead.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalle de la solicitud</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><dt className="text-muted-foreground">Servicio</dt><dd className="font-medium">{lead.service}</dd></div>
                <div><dt className="text-muted-foreground">Unidad</dt><dd className="font-medium">{lead.unit}</dd></div>
                <div><dt className="text-muted-foreground">Toneladas</dt><dd className="font-medium">{lead.tons}</dd></div>
                <div><dt className="text-muted-foreground">Urgencia</dt><dd className="font-medium">{lead.urgency}</dd></div>
                <div><dt className="text-muted-foreground">Mercancía</dt><dd className="font-medium">{lead.cargo}</dd></div>
                <div><dt className="text-muted-foreground">Distancia</dt><dd className="font-medium">{lead.distance_km ? `${lead.distance_km} km` : "—"}</dd></div>
                <div><dt className="text-muted-foreground">Contacto</dt><dd className="font-medium">{lead.contact_name || "—"}</dd></div>
                <div><dt className="text-muted-foreground">Teléfono</dt><dd className="font-medium">{lead.contact_phone || "—"}</dd></div>
                {lead.status === "lost" ? (
                  <div className="col-span-2"><dt className="text-muted-foreground">Motivo pérdida</dt><dd className="font-medium">{lead.lost_reason || "—"}</dd></div>
                ) : null}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Seguimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NoteForm entityType="load_request" entityId={id} />
              <ul className="space-y-3">
                {(timeline ?? []).map((e) => (
                  <li key={e.id} className="rounded-lg border border-border p-3 text-sm">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{e.action}{e.actor_email ? ` · ${e.actor_email}` : " · público"}</span>
                      <span>{new Date(e.created_at).toLocaleString("es-MX")}</span>
                    </div>
                    {e.action === "note" ? <p className="mt-1">{e.note}</p> : null}
                    {e.action === "status_change" ? (
                      <p className="mt-1">
                        {(e.old_value as { status?: string } | null)?.status} → {(e.new_value as { status?: string } | null)?.status}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusForm kind="lead" id={id} current={lead.status} options={LEAD_STATUSES} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

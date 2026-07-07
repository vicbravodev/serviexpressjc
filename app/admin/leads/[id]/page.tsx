import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { StatusForm } from "@/app/admin/_components/status-form"
import { NoteForm } from "@/app/admin/_components/note-form"

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
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h1 className="text-2xl font-bold">{lead.origin_name} → {lead.destination_name}</h1>
        <dl className="grid grid-cols-2 gap-2 rounded-xl border border-border p-4 text-sm">
          <dt className="text-muted-foreground">Servicio</dt><dd>{lead.service}</dd>
          <dt className="text-muted-foreground">Unidad</dt><dd>{lead.unit}</dd>
          <dt className="text-muted-foreground">Toneladas</dt><dd>{lead.tons}</dd>
          <dt className="text-muted-foreground">Urgencia</dt><dd>{lead.urgency}</dd>
          <dt className="text-muted-foreground">Mercancía</dt><dd>{lead.cargo}</dd>
          <dt className="text-muted-foreground">Distancia</dt><dd>{lead.distance_km ? `${lead.distance_km} km` : "—"}</dd>
          <dt className="text-muted-foreground">Contacto</dt><dd>{lead.contact_name || "—"}</dd>
          <dt className="text-muted-foreground">Teléfono</dt><dd>{lead.contact_phone || "—"}</dd>
          {lead.status === "lost" ? (<><dt className="text-muted-foreground">Motivo pérdida</dt><dd>{lead.lost_reason || "—"}</dd></>) : null}
        </dl>

        <section className="space-y-2">
          <h2 className="font-semibold">Seguimiento</h2>
          <NoteForm entityType="load_request" entityId={id} />
          <ul className="space-y-3 pt-2">
            {(timeline ?? []).map((e) => (
              <li key={e.id} className="rounded-md border border-border p-3 text-sm">
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
        </section>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-border p-4">
          <h2 className="mb-3 font-semibold">Status</h2>
          <StatusForm kind="lead" id={id} current={lead.status} options={LEAD_STATUSES} />
        </div>
      </aside>
    </div>
  )
}

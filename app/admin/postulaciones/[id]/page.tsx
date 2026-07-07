import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { StatusForm } from "@/app/admin/_components/status-form"
import { NoteForm } from "@/app/admin/_components/note-form"

export const dynamic = "force-dynamic"
const APPLICATION_STATUSES = ["new", "reviewed", "contacted", "hired", "rejected"]

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = createClient(await cookies())

  const { data: app } = await supabase.from("job_applications").select("*").eq("id", id).single()
  if (!app) notFound()
  const { data: timeline } = await supabase
    .from("audit_log")
    .select("id, created_at, actor_email, action, old_value, new_value, note")
    .eq("entity_type", "job_application")
    .eq("entity_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h1 className="text-2xl font-bold">{app.name}</h1>
        <dl className="grid grid-cols-2 gap-2 rounded-xl border border-border p-4 text-sm">
          <dt className="text-muted-foreground">Teléfono</dt><dd>{app.phone}</dd>
          <dt className="text-muted-foreground">Puesto</dt><dd>{app.position}</dd>
          <dt className="text-muted-foreground">Experiencia</dt><dd>{app.experience}</dd>
        </dl>
        <section className="space-y-2">
          <h2 className="font-semibold">Seguimiento</h2>
          <NoteForm entityType="job_application" entityId={id} />
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
          <StatusForm kind="application" id={id} current={app.status} options={APPLICATION_STATUSES} />
        </div>
      </aside>
    </div>
  )
}

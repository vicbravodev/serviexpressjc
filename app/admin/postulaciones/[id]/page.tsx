import Link from "next/link"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { ArrowLeft } from "lucide-react"
import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusForm } from "@/app/admin/_components/status-form"
import { NoteForm } from "@/app/admin/_components/note-form"
import { StatusBadge } from "@/app/admin/_components/status-badge"

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
    <div className="space-y-6">
      <Link href="/admin/postulaciones" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Postulaciones
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{app.name}</h1>
        <StatusBadge status={app.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalle de la postulación</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><dt className="text-muted-foreground">Teléfono</dt><dd className="font-medium">{app.phone}</dd></div>
                <div><dt className="text-muted-foreground">Puesto</dt><dd className="font-medium">{app.position}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Experiencia</dt><dd className="font-medium">{app.experience}</dd></div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Seguimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NoteForm entityType="job_application" entityId={id} />
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
              <StatusForm kind="application" id={id} current={app.status} options={APPLICATION_STATUSES} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

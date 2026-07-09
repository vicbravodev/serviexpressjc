import Link from "next/link"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin/auth"
import {
  applicationStatusMeta,
  experienceLabel,
  fmtShort,
  folio,
  positionLabel,
} from "@/lib/admin/meta"
import { getStaffOptions } from "@/lib/admin/staff"
import { createClient } from "@/utils/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuditHistory, type AuditRow } from "@/app/admin/_components/audit-history"
import { ManagePanel } from "@/app/admin/_components/manage-panel"

export const dynamic = "force-dynamic"

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = createClient(await cookies())

  const [{ data: app }, { data: timeline }, staff] = await Promise.all([
    supabase.from("job_applications").select("*").eq("id", id).single(),
    supabase
      .from("audit_log")
      .select("id, created_at, actor_email, action, old_value, new_value, note")
      .eq("entity_type", "job_application")
      .eq("entity_id", id)
      .order("created_at", { ascending: false }),
    getStaffOptions(),
  ])
  if (!app) notFound()

  const meta = applicationStatusMeta(app.status)
  const mono = "font-mono text-sm"
  const txt = "text-sm"
  const pairs = [
    { k: "PUESTO", v: positionLabel(app.position), cls: txt },
    { k: "EXPERIENCIA", v: experienceLabel(app.experience), cls: txt },
    { k: "TELÉFONO", v: app.phone || "—", cls: mono },
    { k: "IDIOMA", v: app.locale === "en" ? "Inglés" : "Español", cls: txt },
    { k: "RECIBIDA", v: fmtShort(app.created_at), cls: mono },
  ]

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 p-6">
      <div className="flex flex-col items-start gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/postulaciones">← Volver a Postulaciones</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">{folio("POS", id)}</span>
          <Badge variant={meta.variant} className={meta.className}>
            {meta.label}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{app.name}</h1>
        <p className="text-sm text-muted-foreground">
          {positionLabel(app.position)} · {experienceLabel(app.experience)}
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-[300px] flex-[1.2] flex-col gap-4 sm:min-w-[320px]">
          <Card>
            <CardHeader>
              <CardTitle>Candidato</CardTitle>
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
            kind="application"
            id={id}
            status={app.status}
            assigneeId={app.assigned_to}
            staff={staff.map((s) => ({ id: s.id, name: s.name }))}
          />
          <AuditHistory rows={(timeline ?? []) as AuditRow[]} statusLabel={applicationStatusMeta} />
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import { folio } from "@/lib/admin/meta"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentLeads, type RecentLead } from "./_components/recent-leads"

export const dynamic = "force-dynamic"

export default async function AdminHome() {
  const claims = await requireStaff()
  const supabase = createClient(await cookies())
  const isAdmin = claims.role === "admin"

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [{ count: newLeads }, { count: contacted }, { count: inProgress }, { count: wonMonth }, { data: recent }] =
    await Promise.all([
      supabase.from("load_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("load_requests").select("*", { count: "exact", head: true }).eq("status", "contacted"),
      supabase.from("load_requests").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
      supabase
        .from("load_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "won")
        .gte("updated_at", monthStart.toISOString()),
      supabase
        .from("load_requests")
        .select("id, origin_name, destination_name, contact_name, contact_phone, status")
        .order("created_at", { ascending: false })
        .limit(5),
    ])

  let newApplications: number | null = null
  if (isAdmin) {
    const { count } = await supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "new")
    newApplications = count ?? 0
  }

  const stats: Array<{ label: string; value: number }> = [
    { label: "COTIZACIONES NUEVAS", value: newLeads ?? 0 },
    { label: "EN SEGUIMIENTO", value: (contacted ?? 0) + (inProgress ?? 0) },
    { label: "GANADAS ESTE MES", value: wonMonth ?? 0 },
  ]
  if (newApplications !== null) stats.push({ label: "POSTULACIONES NUEVAS", value: newApplications })

  const rows: RecentLead[] = (recent ?? []).map((l) => ({
    id: l.id,
    folio: folio("COT", l.id),
    contacto: l.contact_name || l.contact_phone || "Sin contacto",
    origen: l.origin_name || "—",
    destino: l.destination_name || "—",
    status: l.status,
  }))

  const hoy = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Monterrey",
  }).format(new Date())

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">OPERACIÓN</span>
        <h1 className="text-2xl font-semibold tracking-tight">Tablero</h1>
        <p className="text-sm text-muted-foreground">Resumen de la operación · {hoy}</p>
      </div>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground">{s.label}</span>
                <span className="text-[32px] font-semibold leading-none tabular-nums">{s.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <Card className="min-w-[300px] flex-[2] sm:min-w-[460px]">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Últimas cotizaciones</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/leads">Ver todas →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecentLeads rows={rows} />
          </CardContent>
        </Card>

        <Card className="min-w-[240px] flex-1">
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin/leads">Revisar cotizaciones</Link>
              </Button>
              {isAdmin ? (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/admin/postulaciones">Revisar postulaciones</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/admin/usuarios">Gestionar usuarios</Link>
                  </Button>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

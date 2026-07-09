import Link from "next/link"
import { cookies } from "next/headers"
import { ArrowRight, ClipboardList, Sparkles, Trophy, Truck } from "lucide-react"
import { requireStaff } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "./_components/page-header"
import { StatusBadge } from "./_components/status-badge"

export const dynamic = "force-dynamic"

export default async function AdminHome() {
  const claims = await requireStaff()
  const supabase = createClient(await cookies())
  const isAdmin = claims.role === "admin"

  const [totalLeads, newLeads, wonLeads, recent, applications] = await Promise.all([
    supabase.from("load_requests").select("*", { count: "exact", head: true }),
    supabase.from("load_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("load_requests").select("*", { count: "exact", head: true }).eq("status", "won"),
    supabase
      .from("load_requests")
      .select("id, created_at, service, origin_name, destination_name, contact_name, contact_phone, status")
      .order("created_at", { ascending: false })
      .limit(6),
    isAdmin
      ? supabase.from("job_applications").select("*", { count: "exact", head: true })
      : Promise.resolve({ count: null as number | null }),
  ])

  const stats = [
    { label: "Solicitudes totales", value: totalLeads.count ?? 0, icon: Truck, href: "/admin/leads", tint: "text-primary bg-primary/10" },
    { label: "Nuevas sin atender", value: newLeads.count ?? 0, icon: Sparkles, href: "/admin/leads", tint: "text-amber-600 dark:text-amber-400 bg-amber-500/12" },
    { label: "Ganadas", value: wonLeads.count ?? 0, icon: Trophy, href: "/admin/leads", tint: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/12" },
    ...(isAdmin
      ? [{ label: "Postulaciones", value: applications.count ?? 0, icon: ClipboardList, href: "/admin/postulaciones", tint: "text-secondary bg-secondary/12" }]
      : []),
  ]

  const recentLeads = recent.data ?? []

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Hola, ${claims.email.split("@")[0]}`}
        description="Resumen de la operación comercial de ServiExpress JC."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.label} href={s.href} className="group">
              <Card className="transition-shadow group-hover:shadow-md">
                <CardContent className="flex items-start justify-between gap-3 p-5">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-bold tabular-nums tracking-tight">{s.value}</p>
                  </div>
                  <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${s.tint}`}>
                    <Icon className="size-5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Solicitudes recientes</CardTitle>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <Link href="/admin/leads">
              Ver todas <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentLeads.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">Aún no hay solicitudes.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentLeads.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/admin/leads/${l.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {l.origin_name} → {l.destination_name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {l.service} · {l.contact_name || l.contact_phone || "Sin contacto"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={l.status} />
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {new Date(l.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

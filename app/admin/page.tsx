import Link from "next/link"
import { cookies } from "next/headers"
import { ChevronRight } from "lucide-react"
import { requireStaff } from "@/lib/admin/auth"
import { getPendingCounts } from "@/lib/admin/counts"
import { fmtShort, folio, leadStatusMeta } from "@/lib/admin/meta"
import { createClient } from "@/utils/supabase/server"
import { StatusBadge } from "./_components/cells"
import { PageBody, PageHeader } from "./_components/page-header"

export const dynamic = "force-dynamic"
export const metadata = { title: { absolute: "Tablero · Panel ServiExpress JC" } }

const OPEN = ["new", "contacted", "in_progress"]
const LEAD_COLS = "id, created_at, origin_name, destination_name, contact_name, contact_phone, status, urgency"

type LeadItem = {
  id: string
  created_at: string
  origin_name: string | null
  destination_name: string | null
  contact_name: string | null
  contact_phone: string | null
  status: string
  urgency: string | null
}

export default async function AdminHome() {
  const claims = await requireStaff()
  const supabase = createClient(await cookies())
  const isAdmin = claims.role === "admin"

  // Inicio de mes en hora de Monterrey (UTC-6 fijo desde 2022), no en la zona del servidor (UTC).
  const [y, m] = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: "America/Monterrey" })
    .format(new Date())
    .split("-")
  const monthStart = new Date(`${y}-${m}-01T00:00:00-06:00`)
  const leads = () => supabase.from("load_requests").select("id", { count: "exact", head: true })

  // Los pendientes (status = 'new') vienen memoizados del layout: no se vuelven a consultar.
  const [pending, unassigned, inProgress, wonMonth, mine, recent] = await Promise.all([
    getPendingCounts(isAdmin),
    leads().eq("status", "new").is("assigned_to", null),
    leads().eq("status", "in_progress"),
    leads().eq("status", "won").gte("updated_at", monthStart.toISOString()),
    supabase
      .from("load_requests")
      .select(LEAD_COLS)
      .eq("assigned_to", claims.userId)
      .in("status", OPEN)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("load_requests").select(LEAD_COLS).order("created_at", { ascending: false }).limit(6),
  ])
  for (const r of [unassigned, inProgress, wonMonth, mine, recent]) {
    if (r.error) throw new Error(`No se pudo cargar el tablero (${r.error.message})`)
  }

  const queue: Array<{ label: string; value: number; href: string }> = [
    { label: "Cotizaciones nuevas", value: pending.newLeads, href: "/admin/leads?status=new" },
    { label: "Nuevas sin asignar", value: unassigned.count ?? 0, href: "/admin/leads?status=new&asignado=sin" },
    { label: "En proceso", value: inProgress.count ?? 0, href: "/admin/leads?status=in_progress" },
    { label: "Ganadas este mes", value: wonMonth.count ?? 0, href: "/admin/leads?status=won" },
    { label: "Socios nuevos", value: pending.newPartners, href: "/admin/socios?status=new" },
  ]
  if (pending.newApplications !== null) {
    queue.push({ label: "Postulaciones nuevas", value: pending.newApplications, href: "/admin/postulaciones?status=new" })
  }

  const hoy = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Monterrey",
  }).format(new Date())

  return (
    <PageBody>
      <PageHeader title="Tablero" description={`Hoy es ${hoy}.`} />

      <section aria-labelledby="tab-pendientes">
        <h2 id="tab-pendientes" className="sr-only">
          Pendientes
        </h2>
        <ul className="grid grid-cols-2 overflow-hidden rounded-xl border bg-card sm:grid-cols-3 xl:grid-cols-6">
          {queue.map((q) => (
            <li key={q.label} className="-mt-px -ml-px border-t border-l">
              <Link
                href={q.href}
                className="flex h-full flex-col gap-1 px-4 py-3.5 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                <span className="text-2xl font-semibold tabular-nums">{q.value}</span>
                <span className="text-sm text-muted-foreground">{q.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <LeadList
          title="Asignadas a ti"
          empty="No tienes cotizaciones abiertas asignadas."
          rows={(mine.data ?? []) as LeadItem[]}
          more={{ href: `/admin/leads?asignado=${claims.userId}`, label: "Ver todas las tuyas" }}
        />
        <LeadList
          title="Últimas cotizaciones"
          empty="Aún no llegan cotizaciones."
          rows={(recent.data ?? []) as LeadItem[]}
          more={{ href: "/admin/leads", label: "Ver todas" }}
        />
      </div>
    </PageBody>
  )
}

function LeadList({
  title,
  rows,
  empty,
  more,
}: {
  title: string
  rows: LeadItem[]
  empty: string
  more: { href: string; label: string }
}) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Link href={more.href} className="text-sm text-primary hover:underline">
          {more.label}
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="divide-y">
          {rows.map((l) => (
            <li key={l.id}>
              <Link
                href={`/admin/leads/${l.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm">
                  <span className="truncate font-medium">{l.contact_name || l.contact_phone || "Sin contacto"}</span>
                  <span className="truncate text-muted-foreground">
                    {l.origin_name || "Sin origen"} → {l.destination_name || "Sin destino"}
                  </span>
                  <span className="flex gap-3 text-xs text-muted-foreground tabular-nums">
                    <span>{fmtShort(l.created_at)}</span>
                    <span className="font-mono">{folio("COT", l.id)}</span>
                    {l.urgency === "urgente" ? <span className="font-medium text-destructive">Urgente</span> : null}
                  </span>
                </div>
                <StatusBadge meta={leadStatusMeta(l.status)} />
                <ChevronRight aria-hidden className="size-4 flex-none text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

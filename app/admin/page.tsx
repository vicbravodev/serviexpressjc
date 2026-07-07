import Link from "next/link"
import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export default async function AdminHome() {
  const claims = await requireStaff()
  const supabase = createClient(await cookies())

  const { count: leadsCount } = await supabase
    .from("load_requests")
    .select("*", { count: "exact", head: true })
  const { count: newLeads } = await supabase
    .from("load_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/leads" className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground">Leads totales</p>
          <p className="text-3xl font-bold">{leadsCount ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">{newLeads ?? 0} nuevos</p>
        </Link>
        {claims.role === "admin" ? <AdminApplicationsCard /> : null}
      </div>
    </div>
  )
}

async function AdminApplicationsCard() {
  const supabase = createClient(await cookies())
  const { count } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
  return (
    <Link href="/admin/postulaciones" className="rounded-xl border border-border p-6">
      <p className="text-sm text-muted-foreground">Postulaciones</p>
      <p className="text-3xl font-bold">{count ?? 0}</p>
    </Link>
  )
}

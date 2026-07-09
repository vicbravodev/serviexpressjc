import Link from "next/link"
import { cookies } from "next/headers"
import { ArrowRight } from "lucide-react"
import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "../_components/page-header"
import { StatusBadge } from "../_components/status-badge"

export const dynamic = "force-dynamic"

export default async function ApplicationsPage() {
  await requireAdmin()
  const supabase = createClient(await cookies())
  const { data: apps } = await supabase
    .from("job_applications")
    .select("id, created_at, name, phone, position, experience, status")
    .order("created_at", { ascending: false })
    .limit(200)

  const rows = apps ?? []

  return (
    <div>
      <PageHeader
        title="Postulaciones"
        description={`${rows.length} postulación${rows.length === 1 ? "" : "es"} de operadores.`}
      />
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">No hay postulaciones registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Nombre</th>
                    <th className="px-4 py-3 font-medium">Teléfono</th>
                    <th className="px-4 py-3 font-medium">Puesto</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((a) => (
                    <tr key={a.id} className="transition-colors hover:bg-muted/40">
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 font-medium">{a.name}</td>
                      <td className="px-4 py-3">{a.phone}</td>
                      <td className="px-4 py-3">{a.position}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/postulaciones/${a.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          Ver <ArrowRight className="size-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

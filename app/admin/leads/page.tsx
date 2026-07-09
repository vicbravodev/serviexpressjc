import Link from "next/link"
import { cookies } from "next/headers"
import { ArrowRight } from "lucide-react"
import { requireStaff } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "../_components/page-header"
import { StatusBadge } from "../_components/status-badge"

export const dynamic = "force-dynamic"

export default async function LeadsPage() {
  await requireStaff()
  const supabase = createClient(await cookies())
  const { data: leads } = await supabase
    .from("load_requests")
    .select("id, created_at, service, origin_name, destination_name, contact_name, contact_phone, status")
    .order("created_at", { ascending: false })
    .limit(200)

  const rows = leads ?? []

  return (
    <div>
      <PageHeader
        title="Solicitudes de carga"
        description={`${rows.length} solicitud${rows.length === 1 ? "" : "es"} más reciente${rows.length === 1 ? "" : "s"}.`}
      />
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">No hay solicitudes registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Servicio</th>
                    <th className="px-4 py-3 font-medium">Ruta</th>
                    <th className="px-4 py-3 font-medium">Contacto</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((l) => (
                    <tr key={l.id} className="transition-colors hover:bg-muted/40">
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {new Date(l.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">{l.service}</td>
                      <td className="px-4 py-3 font-medium">{l.origin_name} → {l.destination_name}</td>
                      <td className="px-4 py-3">{l.contact_name || l.contact_phone || "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/leads/${l.id}`}
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

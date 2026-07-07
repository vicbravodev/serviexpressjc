import Link from "next/link"
import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export default async function LeadsPage() {
  await requireStaff()
  const supabase = createClient(await cookies())
  const { data: leads } = await supabase
    .from("load_requests")
    .select("id, created_at, service, origin_name, destination_name, contact_name, contact_phone, status")
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Solicitudes de carga</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Fecha</th><th className="p-3">Servicio</th><th className="p-3">Ruta</th>
              <th className="p-3">Contacto</th><th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="p-3 whitespace-nowrap">{new Date(l.created_at).toLocaleString("es-MX")}</td>
                <td className="p-3">{l.service}</td>
                <td className="p-3">{l.origin_name} → {l.destination_name}</td>
                <td className="p-3">{l.contact_name || l.contact_phone || "—"}</td>
                <td className="p-3">{l.status}</td>
                <td className="p-3"><Link className="underline" href={`/admin/leads/${l.id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

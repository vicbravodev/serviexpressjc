import Link from "next/link"
import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export default async function ApplicationsPage() {
  await requireAdmin()
  const supabase = createClient(await cookies())
  const { data: apps } = await supabase
    .from("job_applications")
    .select("id, created_at, name, phone, position, experience, status")
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Postulaciones</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Fecha</th><th className="p-3">Nombre</th><th className="p-3">Teléfono</th>
              <th className="p-3">Puesto</th><th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(apps ?? []).map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="p-3 whitespace-nowrap">{new Date(a.created_at).toLocaleString("es-MX")}</td>
                <td className="p-3">{a.name}</td>
                <td className="p-3">{a.phone}</td>
                <td className="p-3">{a.position}</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3"><Link className="underline" href={`/admin/postulaciones/${a.id}`}>Ver</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

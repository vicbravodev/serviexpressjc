import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { UserForm } from "@/app/admin/_components/user-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "../_components/page-header"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  await requireAdmin()
  const supabase = createClient(await cookies())
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, created_at")
    .order("created_at", { ascending: false })

  const rows = users ?? []

  return (
    <div className="space-y-6">
      <PageHeader title="Usuarios" description="Personal con acceso al panel administrativo." />

      <UserForm />

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">No hay usuarios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Nombre</th>
                    <th className="px-4 py-3 font-medium">Rol</th>
                    <th className="px-4 py-3 font-medium">Activo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((u) => (
                    <tr key={u.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium">{u.email}</td>
                      <td className="px-4 py-3">{u.full_name || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === "admin" ? "default" : "secondary"} className="capitalize">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {u.is_active ? (
                          <Badge variant="outline" className="border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            Sí
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-transparent bg-muted text-muted-foreground">
                            No
                          </Badge>
                        )}
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

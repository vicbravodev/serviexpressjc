import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin/auth"
import { createClient } from "@/utils/supabase/server"
import { UserForm } from "@/app/admin/_components/user-form"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  await requireAdmin()
  const supabase = createClient(await cookies())
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, created_at")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Usuarios</h1>
      <UserForm />
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Email</th><th className="p-3">Nombre</th><th className="p-3">Rol</th><th className="p-3">Activo</th></tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.full_name || "—"}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.is_active ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

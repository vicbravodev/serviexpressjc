import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin/auth"
import { fmtDate } from "@/lib/admin/meta"
import { createClient } from "@/utils/supabase/server"
import { UsersTable, type UserRow } from "@/app/admin/_components/users-table"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const claims = await requireAdmin()
  const supabase = createClient(await cookies())
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, created_at")
    .order("created_at", { ascending: true })

  const rows: UserRow[] = (users ?? []).map((u) => ({
    id: u.id,
    nombre: u.full_name || u.email.split("@")[0],
    email: u.email,
    rol: u.role,
    activo: u.is_active,
    alta: fmtDate(u.created_at),
  }))

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">ADMINISTRACIÓN</span>
          <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
          <p className="text-sm text-muted-foreground">Cuentas del equipo operativo y sus permisos.</p>
        </div>
      </div>
      <UsersTable users={rows} selfId={claims.userId} />
    </div>
  )
}

import type { Metadata } from "next"
import { requireAdmin } from "@/lib/admin/auth"
import { parseListParams } from "@/lib/admin/list"
import { queryList, queryStatusCounts } from "@/lib/admin/list-query"
import { fmtDate, initials, SECTIONS } from "@/lib/admin/meta"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MobileRow, Primary } from "../_components/cells"
import { ListView, type Column } from "../_components/list-view"
import { PageBody, PageHeader } from "../_components/page-header"
import { ActiveSwitch, NewUserButton, RoleSelect, SectionsMenu } from "../_components/users-table"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Usuarios" }

const BASE = "/admin/usuarios"
const TABLE = "profiles"
// En Usuarios la pestaña filtra por rol en vez de estatus.
const ROLES = ["admin", "user"] as const
const FILTERS = { textColumns: ["full_name", "email"], statusColumn: "role" }

type Profile = {
  id: string
  email: string
  full_name: string | null
  role: "admin" | "user"
  is_active: boolean
  permissions: string[] | null
  created_at: string
}

const toUser = (u: Profile) => ({
  id: u.id,
  nombre: u.full_name || u.email.split("@")[0],
  rol: u.role,
  activo: u.is_active,
  secciones: SECTIONS.filter((s) => u.permissions?.includes(s)),
})

export default async function UsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  const claims = await requireAdmin()
  const params = parseListParams(await searchParams, { sorts: ["created_at", "full_name"], statuses: ROLES })
  const data = queryList<Profile>({
    table: TABLE,
    select: "id, email, full_name, role, is_active, permissions, created_at",
    params,
    filters: FILTERS,
    basePath: BASE,
  })
  const counts = queryStatusCounts({ table: TABLE, statuses: ROLES, params, filters: FILTERS })

  const columns: Column<Profile>[] = [
    {
      key: "usuario",
      label: "Usuario",
      sort: "full_name",
      cell: (u) => (
        <span className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarFallback>{initials(toUser(u).nombre)}</AvatarFallback>
          </Avatar>
          <Primary title={toUser(u).nombre} sub={u.email} />
        </span>
      ),
    },
    {
      key: "rol",
      label: "Rol",
      cell: (u) => <RoleSelect user={toUser(u)} disabled={u.id === claims.userId} />,
    },
    {
      key: "secciones",
      label: "Secciones",
      cell: (u) => <SectionsMenu user={toUser(u)} disabled={u.id === claims.userId} />,
    },
    {
      key: "acceso",
      label: "Acceso",
      cell: (u) => <ActiveSwitch user={toUser(u)} disabled={u.id === claims.userId} />,
    },
    { key: "alta", label: "Alta", sort: "created_at", cell: (u) => <span className="tabular-nums">{fmtDate(u.created_at)}</span> },
  ]

  return (
    <PageBody narrow>
      <PageHeader
        title="Usuarios"
        description="Cuentas del equipo y qué secciones ve cada una. Tu propia cuenta no se puede editar desde aquí."
        actions={<NewUserButton />}
      />
      <ListView
        basePath={BASE}
        params={params}
        tabs={[
          { value: "admin", label: "Admin" },
          { value: "user", label: "Usuario" },
        ]}
        allLabel="Todos"
        counts={counts}
        data={data}
        columns={columns}
        rowKey={(u) => u.id}
        mobileRow={(u) => (
          <MobileRow
            title={toUser(u).nombre}
            detail={u.email}
            meta={
              <span className="flex w-full flex-wrap items-center gap-3 pt-1">
                <RoleSelect user={toUser(u)} disabled={u.id === claims.userId} />
                <SectionsMenu user={toUser(u)} disabled={u.id === claims.userId} />
                <ActiveSwitch user={toUser(u)} disabled={u.id === claims.userId} />
              </span>
            }
          />
        )}
        searchLabel="Buscar nombre o correo"
        noun={{ singular: "cuenta", plural: "cuentas" }}
      />
    </PageBody>
  )
}

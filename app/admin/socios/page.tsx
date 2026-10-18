import type { Metadata } from "next"
import { requireStaff } from "@/lib/admin/auth"
import { parseListParams } from "@/lib/admin/list"
import { queryList, queryStatusCounts } from "@/lib/admin/list-query"
import { fmtShort, folio, LEAD_STATUSES, leadStatusMeta, partnerUnitLabel } from "@/lib/admin/meta"
import { getStaffOptions } from "@/lib/admin/staff"
import { Assignee, MobileRow, Primary, Received, StatusBadge } from "../_components/cells"
import { ListView, type Column } from "../_components/list-view"
import { PageBody, PageHeader } from "../_components/page-header"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Socios comerciales" }

const BASE = "/admin/socios"
const TABLE = "partner_leads"
const FILTERS = { textColumns: ["name"], phoneColumn: "phone" }
const TABS = [
  { value: "new", label: "Nuevas" },
  { value: "contacted", label: "Contactadas" },
  { value: "in_progress", label: "En proceso" },
  { value: "won", label: "Ganadas" },
  { value: "lost", label: "Perdidas" },
]

type Partner = {
  id: string
  created_at: string
  name: string
  phone: string
  unit_type: string | null
  status: string
  assigned_to: string | null
}

export default async function PartnerLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>
}) {
  await requireStaff()
  const params = parseListParams(await searchParams, { sorts: ["created_at", "name"], statuses: LEAD_STATUSES })
  const staff = await getStaffOptions()
  const data = queryList<Partner>({
    table: TABLE,
    select: "id, created_at, name, phone, unit_type, status, assigned_to",
    params,
    filters: FILTERS,
    basePath: BASE,
  })
  const counts = queryStatusCounts({ table: TABLE, statuses: LEAD_STATUSES, params, filters: FILTERS })
  const staffName = (id: string | null) => (id ? (staff.find((s) => s.id === id)?.name ?? "Equipo") : null)

  const columns: Column<Partner>[] = [
    { key: "nombre", label: "Nombre", sort: "name", cell: (p) => <Primary title={p.name} sub={p.phone} /> },
    { key: "unidad", label: "Unidad", cell: (p) => partnerUnitLabel(p.unit_type) },
    {
      key: "recibida",
      label: "Recibida",
      sort: "created_at",
      cell: (p) => <Received iso={p.created_at} folio={folio("SOC", p.id)} />,
    },
    { key: "estatus", label: "Estatus", cell: (p) => <StatusBadge meta={leadStatusMeta(p.status)} /> },
    { key: "asignado", label: "Asignado a", cell: (p) => <Assignee name={staffName(p.assigned_to)} /> },
  ]

  return (
    <PageBody>
      <PageHeader
        title="Socios comerciales"
        description="Transportistas que quieren afiliarse con su unidad."
      />
      <ListView
        basePath={BASE}
        params={params}
        tabs={TABS}
        counts={counts}
        data={data}
        columns={columns}
        rowKey={(p) => p.id}
        rowHref={(p) => `${BASE}/${p.id}`}
        rowLabel={(p) => `${p.name}, ${partnerUnitLabel(p.unit_type)}, ${folio("SOC", p.id)}`}
        mobileRow={(p) => (
          <MobileRow
            title={p.name}
            status={<StatusBadge meta={leadStatusMeta(p.status)} />}
            detail={partnerUnitLabel(p.unit_type)}
            meta={
              <>
                <span>{fmtShort(p.created_at)}</span>
                <span className="font-mono">{folio("SOC", p.id)}</span>
                <span>{staffName(p.assigned_to) ?? "Sin asignar"}</span>
              </>
            }
          />
        )}
        searchLabel="Buscar nombre, teléfono o folio"
        staff={staff.map((s) => ({ id: s.id, name: s.name }))}
        noun={{ singular: "solicitud", plural: "solicitudes" }}
      />
    </PageBody>
  )
}

import type { Metadata } from "next"
import { requireAdmin } from "@/lib/admin/auth"
import { parseListParams } from "@/lib/admin/list"
import { queryList, queryStatusCounts } from "@/lib/admin/list-query"
import {
  APPLICATION_STATUSES,
  applicationStatusMeta,
  experienceLabel,
  fmtShort,
  folio,
  positionLabel,
} from "@/lib/admin/meta"
import { getStaffOptions } from "@/lib/admin/staff"
import { Assignee, MobileRow, Primary, Received, StatusBadge } from "../_components/cells"
import { ListView, type Column } from "../_components/list-view"
import { PageBody, PageHeader } from "../_components/page-header"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Postulaciones" }

const BASE = "/admin/postulaciones"
const TABLE = "job_applications"
const FILTERS = { textColumns: ["name"], phoneColumn: "phone" }
const TABS = [
  { value: "new", label: "Nuevas" },
  { value: "reviewed", label: "Revisadas" },
  { value: "contacted", label: "Contactadas" },
  { value: "hired", label: "Contratadas" },
  { value: "rejected", label: "Rechazadas" },
]

type Application = {
  id: string
  created_at: string
  name: string
  phone: string
  position: string | null
  experience: string | null
  status: string
  assigned_to: string | null
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>
}) {
  await requireAdmin()
  const params = parseListParams(await searchParams, {
    sorts: ["created_at", "name", "position"],
    statuses: APPLICATION_STATUSES,
  })
  const staff = await getStaffOptions()
  const data = queryList<Application>({
    table: TABLE,
    select: "id, created_at, name, phone, position, experience, status, assigned_to",
    params,
    filters: FILTERS,
    basePath: BASE,
  })
  const counts = queryStatusCounts({ table: TABLE, statuses: APPLICATION_STATUSES, params, filters: FILTERS })
  const staffName = (id: string | null) => (id ? (staff.find((s) => s.id === id)?.name ?? "Equipo") : null)

  const columns: Column<Application>[] = [
    { key: "nombre", label: "Nombre", sort: "name", cell: (a) => <Primary title={a.name} sub={a.phone} /> },
    {
      key: "puesto",
      label: "Puesto",
      sort: "position",
      cell: (a) => (
        <Primary title={<span className="font-normal">{positionLabel(a.position)}</span>} sub={experienceLabel(a.experience)} />
      ),
    },
    {
      key: "recibida",
      label: "Recibida",
      sort: "created_at",
      cell: (a) => <Received iso={a.created_at} folio={folio("POS", a.id)} />,
    },
    { key: "estatus", label: "Estatus", cell: (a) => <StatusBadge meta={applicationStatusMeta(a.status)} /> },
    { key: "asignado", label: "Asignado a", cell: (a) => <Assignee name={staffName(a.assigned_to)} /> },
  ]

  return (
    <PageBody>
      <PageHeader title="Postulaciones" description="Candidatos para operación y taller." />
      <ListView
        basePath={BASE}
        params={params}
        tabs={TABS}
        counts={counts}
        data={data}
        columns={columns}
        rowKey={(a) => a.id}
        rowHref={(a) => `${BASE}/${a.id}`}
        rowLabel={(a) => `${a.name}, ${positionLabel(a.position)}, ${folio("POS", a.id)}`}
        mobileRow={(a) => (
          <MobileRow
            title={a.name}
            status={<StatusBadge meta={applicationStatusMeta(a.status)} />}
            detail={`${positionLabel(a.position)}, ${experienceLabel(a.experience).toLowerCase()}`}
            meta={
              <>
                <span>{fmtShort(a.created_at)}</span>
                <span className="font-mono">{folio("POS", a.id)}</span>
                <span>{staffName(a.assigned_to) ?? "Sin asignar"}</span>
              </>
            }
          />
        )}
        searchLabel="Buscar nombre, teléfono o folio"
        staff={staff.map((s) => ({ id: s.id, name: s.name }))}
        noun={{ singular: "postulación", plural: "postulaciones" }}
      />
    </PageBody>
  )
}

import type { Metadata } from "next"
import { requireStaff } from "@/lib/admin/auth"
import { parseListParams } from "@/lib/admin/list"
import { queryList, queryStatusCounts } from "@/lib/admin/list-query"
import { fmtShort, folio, LEAD_STATUSES, leadStatusMeta, serviceLabel, unitLabel } from "@/lib/admin/meta"
import { getStaffOptions } from "@/lib/admin/staff"
import { Assignee, MobileRow, Primary, Received, StatusBadge } from "../_components/cells"
import { ListView, type Column } from "../_components/list-view"
import { PageBody, PageHeader } from "../_components/page-header"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Cotizaciones" }

const BASE = "/admin/leads"
const TABLE = "load_requests"
const FILTERS = {
  textColumns: ["contact_name", "origin_name", "destination_name", "cargo"],
  phoneColumn: "contact_phone",
}
const TABS = [
  { value: "new", label: "Nuevas" },
  { value: "contacted", label: "Contactadas" },
  { value: "in_progress", label: "En proceso" },
  { value: "won", label: "Ganadas" },
  { value: "lost", label: "Perdidas" },
]

type Lead = {
  id: string
  created_at: string
  service: string | null
  origin_name: string | null
  destination_name: string | null
  unit: string | null
  tons: number | null
  urgency: string | null
  cargo: string | null
  contact_name: string | null
  contact_phone: string | null
  status: string
  assigned_to: string | null
}

const route = (l: Lead) => `${l.origin_name || "Sin origen"} → ${l.destination_name || "Sin destino"}`
const contact = (l: Lead) => l.contact_name || l.contact_phone || "Sin contacto"

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  await requireStaff()
  const params = parseListParams(await searchParams, {
    sorts: ["created_at", "contact_name", "origin_name"],
    statuses: LEAD_STATUSES,
  })
  // El equipo primero: así las promesas de la lista no quedan rechazadas sin consumidor.
  const staff = await getStaffOptions()
  const data = queryList<Lead>({
    table: TABLE,
    select:
      "id, created_at, service, origin_name, destination_name, unit, tons, urgency, cargo, contact_name, contact_phone, status, assigned_to",
    params,
    filters: FILTERS,
    basePath: BASE,
  })
  const counts = queryStatusCounts({ table: TABLE, statuses: LEAD_STATUSES, params, filters: FILTERS })
  const staffName = (id: string | null) => (id ? (staff.find((s) => s.id === id)?.name ?? "Equipo") : null)

  const urgent = (l: Lead) =>
    l.urgency === "urgente" ? <span className="text-xs font-medium text-destructive">Urgente</span> : null

  const columns: Column<Lead>[] = [
    {
      key: "contacto",
      label: "Contacto",
      sort: "contact_name",
      cell: (l) => <Primary title={contact(l)} sub={l.contact_name ? l.contact_phone : null} />,
    },
    {
      key: "ruta",
      label: "Ruta",
      sort: "origin_name",
      className: "min-w-44 whitespace-normal",
      cell: (l) => <Primary title={<span className="font-normal">{route(l)}</span>} sub={serviceLabel(l.service)} />,
    },
    {
      key: "carga",
      label: "Carga",
      className: "hidden xl:table-cell",
      cell: (l) => (
        <Primary
          title={<span className="font-normal">{unitLabel(l.unit)}</span>}
          sub={[l.cargo, l.tons != null ? `${l.tons} t` : null].filter(Boolean).join(", ") || "Sin especificar"}
        />
      ),
    },
    {
      key: "recibida",
      label: "Recibida",
      sort: "created_at",
      cell: (l) => <Received iso={l.created_at} folio={folio("COT", l.id)} />,
    },
    {
      key: "estatus",
      label: "Estatus",
      cell: (l) => (
        <div className="flex flex-col items-start gap-1">
          <StatusBadge meta={leadStatusMeta(l.status)} />
          {urgent(l)}
        </div>
      ),
    },
    { key: "asignado", label: "Asignado a", cell: (l) => <Assignee name={staffName(l.assigned_to)} /> },
  ]

  return (
    <PageBody>
      <PageHeader title="Cotizaciones" description="Solicitudes de flete que llegan desde el cotizador del sitio." />
      <ListView
        basePath={BASE}
        params={params}
        tabs={TABS}
        counts={counts}
        data={data}
        columns={columns}
        rowKey={(l) => l.id}
        rowHref={(l) => `${BASE}/${l.id}`}
        rowLabel={(l) => `${contact(l)}, ${route(l)}, ${folio("COT", l.id)}`}
        mobileRow={(l) => (
          <MobileRow
            title={contact(l)}
            status={<StatusBadge meta={leadStatusMeta(l.status)} />}
            detail={route(l)}
            meta={
              <>
                <span>{fmtShort(l.created_at)}</span>
                <span className="font-mono">{folio("COT", l.id)}</span>
                {urgent(l)}
                <span>{staffName(l.assigned_to) ?? "Sin asignar"}</span>
              </>
            }
          />
        )}
        searchLabel="Buscar nombre, ciudad, teléfono o folio"
        staff={staff.map((s) => ({ id: s.id, name: s.name }))}
        noun={{ singular: "cotización", plural: "cotizaciones" }}
      />
    </PageBody>
  )
}

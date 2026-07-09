import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import { fmtShort, folio, serviceLabel, unitLabel, urgencyLabel } from "@/lib/admin/meta"
import { getStaffOptions } from "@/lib/admin/staff"
import { createClient } from "@/utils/supabase/server"
import { LeadsTable, type LeadRow } from "../_components/leads-table"

export const dynamic = "force-dynamic"

export default async function LeadsPage() {
  await requireStaff()
  const supabase = createClient(await cookies())
  const [{ data: leads }, staff] = await Promise.all([
    supabase
      .from("load_requests")
      .select(
        "id, created_at, service, origin_name, destination_name, unit, tons, urgency, cargo, contact_name, contact_phone, status, assigned_to",
      )
      .order("created_at", { ascending: false })
      .limit(200),
    getStaffOptions(),
  ])

  const staffById = new Map(staff.map((s) => [s.id, s.name]))
  const rows: LeadRow[] = (leads ?? []).map((l) => ({
    id: l.id,
    folio: folio("COT", l.id),
    fecha: fmtShort(l.created_at),
    contacto: l.contact_name || l.contact_phone || "Sin contacto",
    tel: l.contact_phone || "—",
    origen: l.origin_name || "—",
    destino: l.destination_name || "—",
    servicio: serviceLabel(l.service),
    unidad: unitLabel(l.unit),
    carga: l.cargo || "Sin especificar",
    tons: l.tons != null ? `${l.tons} t` : "—",
    urgencia: urgencyLabel(l.urgency),
    urgente: l.urgency === "urgente",
    status: l.status,
    asignadoId: l.assigned_to,
    asignadoName: l.assigned_to ? (staffById.get(l.assigned_to) ?? "Equipo") : null,
  }))

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 p-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">OPERACIÓN</span>
        <h1 className="text-2xl font-semibold tracking-tight">Cotizaciones</h1>
        <p className="text-sm text-muted-foreground">
          Solicitudes entrantes desde el sitio y por teléfono. Haz clic en una fila para gestionarla.
        </p>
      </div>
      <LeadsTable rows={rows} staff={staff.map((s) => ({ id: s.id, name: s.name }))} />
    </div>
  )
}

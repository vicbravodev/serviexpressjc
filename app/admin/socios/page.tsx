import { cookies } from "next/headers"
import { requireStaff } from "@/lib/admin/auth"
import { folio, partnerUnitLabel } from "@/lib/admin/meta"
import { getStaffOptions } from "@/lib/admin/staff"
import { createClient } from "@/utils/supabase/server"
import { PartnerLeadsTable, type PartnerRow } from "../_components/partner-leads-table"

export const dynamic = "force-dynamic"

export default async function PartnerLeadsPage() {
  await requireStaff()
  const supabase = createClient(await cookies())
  const [{ data: leads }, staff] = await Promise.all([
    supabase
      .from("partner_leads")
      .select("id, created_at, name, phone, unit_type, status, assigned_to")
      .order("created_at", { ascending: false })
      .limit(200),
    getStaffOptions(),
  ])

  const staffById = new Map(staff.map((s) => [s.id, s.name]))
  const rows: PartnerRow[] = (leads ?? []).map((l) => ({
    id: l.id,
    folio: folio("SOC", l.id),
    nombre: l.name,
    tel: l.phone,
    unidad: partnerUnitLabel(l.unit_type),
    status: l.status,
    asignadoId: l.assigned_to,
    asignadoName: l.assigned_to ? (staffById.get(l.assigned_to) ?? "Equipo") : null,
  }))

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 p-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">OPERACIÓN</span>
        <h1 className="text-2xl font-semibold tracking-tight">Socios comerciales</h1>
        <p className="text-sm text-muted-foreground">
          Transportistas interesados en afiliarse con su unidad. Haz clic en una fila para gestionarla.
        </p>
      </div>
      <PartnerLeadsTable rows={rows} staff={staff.map((s) => ({ id: s.id, name: s.name }))} />
    </div>
  )
}

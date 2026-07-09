import { cookies } from "next/headers"
import { requireAdmin } from "@/lib/admin/auth"
import { experienceLabel, folio, positionLabel } from "@/lib/admin/meta"
import { getStaffOptions } from "@/lib/admin/staff"
import { createClient } from "@/utils/supabase/server"
import { AppsTable, type AppRow } from "../_components/apps-table"

export const dynamic = "force-dynamic"

export default async function ApplicationsPage() {
  await requireAdmin()
  const supabase = createClient(await cookies())
  const [{ data: apps }, staff] = await Promise.all([
    supabase
      .from("job_applications")
      .select("id, created_at, name, phone, position, experience, status, assigned_to")
      .order("created_at", { ascending: false })
      .limit(200),
    getStaffOptions(),
  ])

  const staffById = new Map(staff.map((s) => [s.id, s.name]))
  const rows: AppRow[] = (apps ?? []).map((a) => ({
    id: a.id,
    folio: folio("POS", a.id),
    nombre: a.name,
    tel: a.phone,
    puesto: positionLabel(a.position),
    experiencia: experienceLabel(a.experience),
    status: a.status,
    asignadoId: a.assigned_to,
    asignadoName: a.assigned_to ? (staffById.get(a.assigned_to) ?? "Equipo") : null,
  }))

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 p-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">OPERACIÓN</span>
        <h1 className="text-2xl font-semibold tracking-tight">Postulaciones</h1>
        <p className="text-sm text-muted-foreground">
          Candidatos para operación y taller. Haz clic en una fila para gestionarla.
        </p>
      </div>
      <AppsTable rows={rows} staff={staff.map((s) => ({ id: s.id, name: s.name }))} />
    </div>
  )
}

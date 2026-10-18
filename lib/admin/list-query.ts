import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { applyListFilters, listHref, pageRange, type ListParams } from "@/lib/admin/list"

type FilterOpts = Parameters<typeof applyListFilters>[2]

type ListQuery = {
  table: string
  select: string
  params: ListParams
  filters: FilterOpts
  basePath: string
}

/**
 * Una página de resultados con su total (`.range()` + count exacto), ordenada por la
 * columna pedida y por id para que la paginación sea estable con fechas repetidas.
 * Los errores se lanzan para que los muestre `error.tsx` en vez de pasar por lista vacía.
 */
export async function queryList<Row>({ table, select, params, filters, basePath }: ListQuery) {
  const supabase = createClient(await cookies())
  const [from, to] = pageRange(params)
  const { data, count, error } = await applyListFilters(
    supabase.from(table).select(select, { count: "exact" }),
    params,
    filters,
  )
    .order(params.sort, { ascending: params.dir === "asc", nullsFirst: false })
    .order("id", { ascending: true })
    .range(from, to)

  // Página fuera de rango (p. ej. tras filtrar): PostgREST responde 416.
  if (error?.code === "PGRST103") redirect(listHref(basePath, params, { page: 1 }))
  if (error) throw new Error(`No se pudo cargar la lista (${error.message})`)
  const total = count ?? 0
  if (params.page > 1 && from >= total) redirect(listHref(basePath, params, { page: 1 }))
  return { rows: (data ?? []) as Row[], total }
}

/** Conteo por estatus con los mismos filtros de búsqueda y asignado (para las pestañas). */
export async function queryStatusCounts({
  table,
  statuses,
  params,
  filters,
}: Omit<ListQuery, "select" | "basePath"> & { statuses: readonly string[] }) {
  const supabase = createClient(await cookies())
  const results = await Promise.all(
    statuses.map((status) =>
      applyListFilters(
        supabase.from(table).select("id", { count: "exact", head: true }),
        { ...params, status },
        filters,
      ),
    ),
  )
  return Object.fromEntries(statuses.map((s, i) => [s, results[i].count ?? 0])) as Record<string, number>
}

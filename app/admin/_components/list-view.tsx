import { Suspense, type ReactNode } from "react"
import Link from "next/link"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { hasFilters, listHref, PAGE_SIZES, type Facet, type ListParams } from "@/lib/admin/list"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ListFilters } from "./list-filters"

export type Column<R> = {
  key: string
  label: string
  /** Columna de la base por la que ordena este encabezado. */
  sort?: string
  className?: string
  cell: (row: R) => ReactNode
}

type Props<R> = {
  basePath: string
  params: ListParams
  /** Pestañas de estatus; "todos" se agrega solo con `allLabel`. */
  tabs: Array<{ value: string; label: string }>
  allLabel?: string
  counts: Promise<Record<string, number>>
  data: Promise<{ rows: R[]; total: number }>
  columns: Column<R>[]
  rowKey: (row: R) => string
  /** Sin href la fila no navega (Usuarios se gestiona en la misma fila). */
  rowHref?: (row: R) => string
  /** Texto accesible del link de la fila (la primera celda). */
  rowLabel?: (row: R) => string
  mobileRow: (row: R) => ReactNode
  searchLabel: string
  staff?: Array<{ id: string; name: string }>
  /** Filtro por fecha de recepción (created_at). */
  dates?: boolean
  facets?: Facet[]
  noun: { singular: string; plural: string }
}

/**
 * Lista paginada del panel: pestañas de estatus con conteo, búsqueda/asignado, tabla
 * ordenable en escritorio, filas apiladas en móvil y paginador. Todo el estado vive en
 * la URL, así que atrás/adelante, recargar y compartir el link conservan la vista.
 */
export function ListView<R>(props: Props<R>) {
  const { basePath, params, searchLabel, staff, dates, facets } = props
  // La key reinicia el Suspense en cada cambio de filtros para mostrar el skeleton.
  const key = listHref(basePath, params)
  // Los conteos de las pestañas solo cambian con los filtros, no con estatus/orden/página.
  const tabsKey = JSON.stringify([params.q, params.asignado, params.desde, params.hasta, params.f])
  return (
    <div className="flex flex-col gap-3">
      <ListFilters
        basePath={basePath}
        params={params}
        searchLabel={searchLabel}
        staff={staff}
        dates={dates}
        facets={facets}
      />
      <Suspense key={tabsKey} fallback={<TabsSkeleton n={props.tabs.length + 1} />}>
        <StatusTabs {...props} />
      </Suspense>
      <Suspense key={key} fallback={<ResultsSkeleton cols={props.columns.length} />}>
        <Results {...props} />
      </Suspense>
    </div>
  )
}

async function StatusTabs<R>({ basePath, params, tabs, counts, allLabel = "Todas" }: Props<R>) {
  const c = await counts
  const all = Object.values(c).reduce((a, b) => a + b, 0)
  const items = [{ value: "todos", label: allLabel, count: all }, ...tabs.map((t) => ({ ...t, count: c[t.value] ?? 0 }))]
  return (
    <nav aria-label="Estatus" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max border-b">
        {items.map((t) => {
          const active = params.status === t.value
          return (
            <li key={t.value}>
              <Link
                href={listHref(basePath, params, { status: t.value, page: 1 })}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm whitespace-nowrap transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring",
                  active
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
                <span className="tabular-nums text-muted-foreground">{t.count}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

async function Results<R>({
  basePath,
  params,
  data,
  columns,
  rowKey,
  rowHref,
  rowLabel,
  mobileRow,
  noun,
}: Props<R>) {
  const { rows, total } = await data
  const filtered = params.status !== "todos" || hasFilters(params)

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border bg-card">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{filtered ? "Sin resultados con estos filtros" : `Aún no hay ${noun.plural}`}</EmptyTitle>
            <EmptyDescription>
              {filtered
                ? "Prueba con otra búsqueda, otro rango de fechas o quita algún filtro."
                : "Aparecerán aquí en cuanto lleguen desde el sitio."}
            </EmptyDescription>
          </EmptyHeader>
          {filtered ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={basePath}>Quitar filtros</Link>
            </Button>
          ) : null}
        </Empty>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <SortableHead key={col.key} col={col} basePath={basePath} params={params} />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={rowKey(row)}
                className={cn(
                  rowHref &&
                    "relative has-[a:focus-visible]:bg-muted/60 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-ring",
                )}
              >
                {columns.map((col, i) => (
                  <TableCell key={col.key} className={cn("px-3 py-2.5", col.className)}>
                    {i === 0 && rowHref ? (
                      // Link real (cmd-clic, foco, prefetch) estirado a toda la fila.
                      <Link
                        href={rowHref(row)}
                        aria-label={rowLabel?.(row)}
                        className="block outline-none after:absolute after:inset-0"
                      >
                        {col.cell(row)}
                      </Link>
                    ) : (
                      col.cell(row)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="divide-y md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)}>
            {rowHref ? (
              <Link
                href={rowHref(row)}
                aria-label={rowLabel?.(row)}
                className="block px-4 py-3 outline-none hover:bg-muted/50 focus-visible:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                {mobileRow(row)}
              </Link>
            ) : (
              <div className="px-4 py-3">{mobileRow(row)}</div>
            )}
          </li>
        ))}
      </ul>

      <Pagination basePath={basePath} params={params} total={total} shown={rows.length} noun={noun} />
    </div>
  )
}

function SortableHead<R>({ col, basePath, params }: { col: Column<R>; basePath: string; params: ListParams }) {
  if (!col.sort) {
    return <TableHead className={cn("px-3 text-muted-foreground", col.className)}>{col.label}</TableHead>
  }
  const active = params.sort === col.sort
  // Fechas empiezan por lo más reciente; texto, de la A a la Z.
  const firstDir = col.sort === "created_at" ? "desc" : "asc"
  const nextDir = active ? (params.dir === "asc" ? "desc" : "asc") : firstDir
  const Icon = !active ? ChevronsUpDown : params.dir === "asc" ? ArrowUp : ArrowDown
  return (
    <TableHead
      aria-sort={active ? (params.dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn("px-3", col.className)}
    >
      <Link
        href={listHref(basePath, params, { sort: col.sort, dir: nextDir, page: 1 })}
        scroll={false}
        className={cn(
          "-mx-1.5 inline-flex items-center gap-1 rounded-sm px-1.5 py-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {col.label}
        <Icon aria-hidden className={cn("size-3.5", !active && "opacity-50")} />
      </Link>
    </TableHead>
  )
}

function Pagination({
  basePath,
  params,
  total,
  shown,
  noun,
}: {
  basePath: string
  params: ListParams
  total: number
  shown: number
  noun: { singular: string; plural: string }
}) {
  const pages = Math.max(1, Math.ceil(total / params.pageSize))
  const from = (params.page - 1) * params.pageSize + 1
  const to = from + shown - 1
  const prev = params.page > 1 ? listHref(basePath, params, { page: params.page - 1 }) : null
  const next = params.page < pages ? listHref(basePath, params, { page: params.page + 1 }) : null
  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground tabular-nums">
        {from}-{to} de {total} {total === 1 ? noun.singular : noun.plural}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="mr-1">Por página</span>
          {PAGE_SIZES.map((size) => (
            <Link
              key={size}
              href={listHref(basePath, params, { pageSize: size, page: 1 })}
              scroll={false}
              aria-current={size === params.pageSize ? "true" : undefined}
              className={cn(
                "rounded-md px-2 py-1 tabular-nums focus-visible:outline-2 focus-visible:outline-ring",
                size === params.pageSize ? "bg-muted font-medium text-foreground" : "hover:text-foreground",
              )}
            >
              {size}
            </Link>
          ))}
        </div>
        <nav aria-label="Paginación" className="flex items-center gap-1">
          <PageButton href={prev} label="Página anterior">
            <ChevronLeft />
          </PageButton>
          <span className="px-2 text-muted-foreground tabular-nums">
            Página {params.page} de {pages}
          </span>
          <PageButton href={next} label="Página siguiente">
            <ChevronRight />
          </PageButton>
        </nav>
      </div>
    </div>
  )
}

function PageButton({ href, label, children }: { href: string | null; label: string; children: ReactNode }) {
  if (!href) {
    return (
      <Button variant="outline" size="icon" className="size-8" disabled aria-label={label}>
        {children}
      </Button>
    )
  }
  return (
    <Button variant="outline" size="icon" className="size-8" asChild>
      <Link href={href} aria-label={label}>
        {children}
      </Link>
    </Button>
  )
}

function TabsSkeleton({ n }: { n: number }) {
  return (
    <div className="flex gap-4 border-b pb-2.5">
      {Array.from({ length: n }, (_, i) => (
        <Skeleton key={i} className="h-5 w-20" />
      ))}
    </div>
  )
}

export function ResultsSkeleton({ cols, rows = 8 }: { cols: number; rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card" aria-busy="true" aria-label="Cargando">
      <div className="flex gap-6 border-b px-3 py-3">
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-6 border-b px-3 py-4 last:border-0">
          {Array.from({ length: cols }, (_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ListFilter, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  clearFilters,
  DATE_PRESETS,
  hasFilters,
  listHref,
  presetRange,
  todayMty,
  type Facet,
  type ListParams,
} from "@/lib/admin/list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

type Props = {
  basePath: string
  params: ListParams
  searchLabel: string
  /** Sin `staff` no se muestra el filtro de asignado (p. ej. Usuarios). */
  staff?: Array<{ id: string; name: string }>
  /** Filtro por fecha de recepción. */
  dates?: boolean
  /** Filtros por tipo de la lista (servicio, unidad, puesto...). */
  facets?: Facet[]
}

/**
 * Búsqueda, fecha, tipo y asignado: escriben en la URL y el servidor vuelve a consultar
 * desde la página 1. Como todo vive en la URL, cada quien puede guardar su vista en favoritos.
 */
export function ListFilters({ basePath, params, searchLabel, staff, dates, facets = [] }: Props) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [q, setQ] = useState(params.q)
  // En móvil los filtros se pliegan detrás de un botón; abiertos si ya hay alguno activo.
  const [open, setOpen] = useState(false)
  const latest = useRef(params)
  latest.current = params

  const go = (next: Partial<ListParams>) =>
    start(() => router.push(listHref(basePath, params, { ...next, page: 1 }), { scroll: false }))

  // Si la URL cambia por fuera (pestaña, atrás), el campo la sigue.
  useEffect(() => setQ((cur) => (cur.trim() === params.q ? cur : params.q)), [params.q])

  useEffect(() => {
    if (q.trim() === latest.current.q) return
    const t = setTimeout(() => {
      start(() => router.replace(listHref(basePath, latest.current, { q: q.trim(), page: 1 }), { scroll: false }))
    }, 350)
    return () => clearTimeout(t)
  }, [q, basePath, router])

  const active =
    (params.desde || params.hasta ? 1 : 0) + Object.keys(params.f).length + (params.asignado !== "todos" ? 1 : 0)

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          aria-label={searchLabel}
          placeholder={searchLabel}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-8"
        />
        {pending ? (
          <Spinner
            aria-label="Buscando"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground"
          />
        ) : null}
      </div>

      {dates || facets.length > 0 || staff ? (
        <Button
          variant="outline"
          className="sm:hidden"
          aria-expanded={open}
          aria-controls="list-filters-more"
          onClick={() => setOpen((v) => !v)}
        >
          <ListFilter />
          Filtros{active ? ` (${active})` : ""}
        </Button>
      ) : null}

      <div
        id="list-filters-more"
        className={cn("flex w-full flex-wrap items-center gap-2 sm:contents", !open && "max-sm:hidden")}
      >
        {/* La key reinicia el modo "rango" cuando se limpian las fechas desde fuera. */}
        {dates ? <DateFilter key={params.desde || params.hasta ? "con" : "sin"} params={params} onChange={go} /> : null}

        {facets.map((facet) => (
          <Select
            key={facet.key}
            value={params.f[facet.key] ?? "todos"}
            onValueChange={(v) => {
              const f = { ...params.f }
              if (v === "todos") delete f[facet.key]
              else f[facet.key] = v
              go({ f })
            }}
          >
            <SelectTrigger
              className={cn("w-full sm:w-auto sm:min-w-40", params.f[facet.key] && "border-primary/60")}
              aria-label={`Filtrar por ${facet.label.toLowerCase()}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">{facet.allLabel}</SelectItem>
              {facet.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {staff ? (
          <Select value={params.asignado} onValueChange={(v) => go({ asignado: v })}>
            <SelectTrigger
              className={cn("w-full sm:w-auto sm:min-w-44", params.asignado !== "todos" && "border-primary/60")}
              aria-label="Filtrar por asignado"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Cualquier asignado</SelectItem>
              <SelectItem value="sin">Sin asignar</SelectItem>
              {staff.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {hasFilters(params) ? (
          <Button
            variant="ghost"
            onClick={() =>
              start(() => router.push(listHref(basePath, clearFilters(params)), { scroll: false }))
            }
          >
            <X />
            Limpiar filtros
          </Button>
        ) : null}
      </div>
    </div>
  )
}

/** Atajos de fecha (Hoy, 7 días...) o rango libre con dos campos de fecha nativos. */
function DateFilter({ params, onChange }: { params: ListParams; onChange: (next: Partial<ListParams>) => void }) {
  const today = todayMty()
  const preset =
    DATE_PRESETS.find((p) => {
      const r = presetRange(p.value, today)
      return r && r[0] === params.desde && r[1] === params.hasta
    })?.value ?? (params.desde || params.hasta ? "rango" : "todas")
  const [custom, setCustom] = useState(false)
  const showRange = preset === "rango" || custom

  return (
    <>
      <Select
        value={custom ? "rango" : preset}
        onValueChange={(v) => {
          setCustom(v === "rango")
          if (v === "todas") onChange({ desde: "", hasta: "" })
          const r = presetRange(v, today)
          if (r) onChange({ desde: r[0], hasta: r[1] })
        }}
      >
        <SelectTrigger
          className={cn("w-full sm:w-auto sm:min-w-40", preset !== "todas" && "border-primary/60")}
          aria-label="Filtrar por fecha de recepción"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Cualquier fecha</SelectItem>
          {DATE_PRESETS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
          <SelectItem value="rango">Rango de fechas</SelectItem>
        </SelectContent>
      </Select>
      {showRange ? (
        <div className="flex w-full items-center gap-1.5 sm:w-auto">
          <Input
            type="date"
            aria-label="Desde"
            value={params.desde}
            max={params.hasta || today}
            onChange={(e) => onChange({ desde: e.target.value })}
            className="w-full sm:w-38"
          />
          <span className="text-sm text-muted-foreground">a</span>
          <Input
            type="date"
            aria-label="Hasta"
            value={params.hasta}
            min={params.desde || undefined}
            max={today}
            onChange={(e) => onChange({ hasta: e.target.value })}
            className="w-full sm:w-38"
          />
        </div>
      ) : null}
    </>
  )
}

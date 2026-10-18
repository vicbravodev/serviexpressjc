"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { listHref, type ListParams } from "@/lib/admin/list"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

type Props = {
  basePath: string
  params: ListParams
  searchLabel: string
  /** Sin `staff` no se muestra el filtro de asignado (p. ej. Usuarios). */
  staff?: Array<{ id: string; name: string }>
}

/** Búsqueda y asignado: escriben en la URL y el servidor vuelve a consultar desde la página 1. */
export function ListFilters({ basePath, params, searchLabel, staff }: Props) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [q, setQ] = useState(params.q)
  const latest = useRef(params)
  latest.current = params

  // Si la URL cambia por fuera (pestaña, atrás), el campo la sigue.
  useEffect(() => setQ((cur) => (cur.trim() === params.q ? cur : params.q)), [params.q])

  useEffect(() => {
    if (q.trim() === latest.current.q) return
    const t = setTimeout(() => {
      start(() => router.replace(listHref(basePath, latest.current, { q: q.trim(), page: 1 }), { scroll: false }))
    }, 350)
    return () => clearTimeout(t)
  }, [q, basePath, router])

  return (
    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
      <div className="relative min-w-0 flex-1 sm:w-80 sm:flex-none">
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
      {staff ? (
        <Select
          value={params.asignado}
          onValueChange={(v) => start(() => router.push(listHref(basePath, params, { asignado: v, page: 1 }), { scroll: false }))}
        >
          <SelectTrigger className="w-full sm:w-48" aria-label="Filtrar por asignado">
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
    </div>
  )
}

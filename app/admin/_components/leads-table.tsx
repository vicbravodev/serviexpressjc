"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { initials, leadStatusMeta, LEAD_STATUS_META, type LeadStatus } from "@/lib/admin/meta"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type LeadRow = {
  id: string
  folio: string
  fecha: string
  contacto: string
  tel: string
  origen: string
  destino: string
  servicio: string
  unidad: string
  carga: string
  tons: string
  urgencia: string
  urgente: boolean
  status: string
  asignadoId: string | null
  asignadoName: string | null
}

type Props = {
  rows: LeadRow[]
  staff: Array<{ id: string; name: string }>
}

export function LeadsTable({ rows, staff }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState("todos")
  const [search, setSearch] = useState("")
  const [asignado, setAsignado] = useState("todos")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((l) => {
      if (tab !== "todos" && l.status !== tab) return false
      if (asignado === "sin") {
        if (l.asignadoId) return false
      } else if (asignado !== "todos" && l.asignadoId !== asignado) {
        return false
      }
      if (q) {
        const hay = `${l.contacto} ${l.folio} ${l.origen} ${l.destino} ${l.carga} ${l.tel}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [rows, tab, search, asignado])

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="todos">Todas</TabsTrigger>
            {(Object.keys(LEAD_STATUS_META) as LeadStatus[]).map((s) => (
              <TabsTrigger key={s} value={s}>
                {s === "new" ? "Nuevas" : s === "contacted" ? "Contactadas" : s === "in_progress" ? "En proceso" : s === "won" ? "Ganadas" : "Perdidas"}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Buscar contacto, ruta o folio"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select value={asignado} onValueChange={setAsignado}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Asignado a" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Asignado a: todos</SelectItem>
              {staff.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
              <SelectItem value="sin">Sin asignar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Package />
              </EmptyMedia>
              <EmptyTitle>Sin cotizaciones con estos filtros</EmptyTitle>
              <EmptyDescription>Ajusta la búsqueda o selecciona otro estatus para ver resultados.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Urgencia</TableHead>
                <TableHead>Estatus</TableHead>
                <TableHead>Asignado a</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => {
                const meta = leadStatusMeta(l.status)
                return (
                  <TableRow
                    key={l.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/admin/leads/${l.id}`)}
                  >
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="whitespace-nowrap font-mono text-xs">{l.fecha}</span>
                        <span className="font-mono text-xs text-muted-foreground">{l.folio}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="whitespace-nowrap text-sm font-medium">{l.contacto}</span>
                        <span className="font-mono text-xs text-muted-foreground">{l.tel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm">
                        {l.origen} <span className="text-muted-foreground">→</span> {l.destino}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{l.servicio}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="whitespace-nowrap text-sm">{l.unidad}</span>
                        <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                          {l.carga} · {l.tons}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "whitespace-nowrap text-sm",
                          l.urgente ? "font-medium text-destructive" : "text-muted-foreground",
                        )}
                      >
                        {l.urgencia}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={meta.variant} className={meta.className}>
                        {meta.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {l.asignadoName ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-8">
                            <AvatarFallback>{initials(l.asignadoName)}</AvatarFallback>
                          </Avatar>
                          <span className="whitespace-nowrap text-sm">{l.asignadoName}</span>
                        </div>
                      ) : (
                        <span className="whitespace-nowrap text-sm text-muted-foreground">Sin asignar</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <div className="border-t p-2.5 px-4 font-mono text-xs tracking-[0.08em] text-muted-foreground">
            {filtered.length} RESULTADOS
          </div>
        </div>
      )}
    </>
  )
}

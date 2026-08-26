"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Handshake } from "lucide-react"
import { leadStatusMeta, LEAD_STATUS_META, initials, type LeadStatus } from "@/lib/admin/meta"
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

export type PartnerRow = {
  id: string
  folio: string
  nombre: string
  tel: string
  unidad: string
  status: string
  asignadoId: string | null
  asignadoName: string | null
}

type Props = {
  rows: PartnerRow[]
  staff: Array<{ id: string; name: string }>
}

const TAB_LABELS: Record<LeadStatus, string> = {
  new: "Nuevas",
  contacted: "Contactadas",
  in_progress: "En proceso",
  won: "Ganadas",
  lost: "Perdidas",
}

export function PartnerLeadsTable({ rows, staff }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState("todos")
  const [search, setSearch] = useState("")
  const [asignado, setAsignado] = useState("todos")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((p) => {
      if (tab !== "todos" && p.status !== tab) return false
      if (asignado === "sin") {
        if (p.asignadoId) return false
      } else if (asignado !== "todos" && p.asignadoId !== asignado) {
        return false
      }
      if (q) {
        const hay = `${p.nombre} ${p.folio} ${p.unidad} ${p.tel}`.toLowerCase()
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
                {TAB_LABELS[s]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Buscar nombre, unidad o teléfono"
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
                <Handshake />
              </EmptyMedia>
              <EmptyTitle>Sin solicitudes con estos filtros</EmptyTitle>
              <EmptyDescription>Ajusta la búsqueda o selecciona otro estatus para ver resultados.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Estatus</TableHead>
                <TableHead>Asignado a</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const meta = leadStatusMeta(p.status)
                return (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/admin/socios/${p.id}`)}
                  >
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="whitespace-nowrap text-sm font-medium">{p.nombre}</span>
                        <span className="font-mono text-xs text-muted-foreground">{p.folio}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{p.tel}</span>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm">{p.unidad}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={meta.variant} className={meta.className}>
                        {meta.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {p.asignadoName ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-8">
                            <AvatarFallback>{initials(p.asignadoName)}</AvatarFallback>
                          </Avatar>
                          <span className="whitespace-nowrap text-sm">{p.asignadoName}</span>
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

"use client"

import { useRouter } from "next/navigation"
import { leadStatusMeta } from "@/lib/admin/meta"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type RecentLead = {
  id: string
  folio: string
  contacto: string
  origen: string
  destino: string
  status: string
}

export function RecentLeads({ rows }: { rows: RecentLead[] }) {
  const router = useRouter()
  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Aún no hay cotizaciones registradas.</p>
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Ruta</TableHead>
            <TableHead>Estatus</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((l) => {
            const meta = leadStatusMeta(l.status)
            return (
              <TableRow key={l.id} className="cursor-pointer" onClick={() => router.push(`/admin/leads/${l.id}`)}>
                <TableCell>
                  <span className="font-mono text-xs">{l.folio}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{l.contacto}</span>
                </TableCell>
                <TableCell>
                  <span className="whitespace-nowrap text-sm text-muted-foreground">
                    {l.origen} → {l.destino}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={meta.variant} className={meta.className}>
                    {meta.label}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

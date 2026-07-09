"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { addNote, updateApplicationStatus, updateAssignee, updateLeadStatus } from "@/lib/actions/admin"
import {
  applicationStatusMeta,
  APPLICATION_STATUSES,
  leadStatusMeta,
  LEAD_STATUSES,
} from "@/lib/admin/meta"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  kind: "lead" | "application"
  id: string
  status: string
  assigneeId: string | null
  staff: Array<{ id: string; name: string }>
}

export function ManagePanel({ kind, id, status, assigneeId, staff }: Props) {
  const [pending, start] = useTransition()
  const [nota, setNota] = useState("")
  const [motivoOpen, setMotivoOpen] = useState(false)
  const [motivo, setMotivo] = useState("")
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)

  const entityType = kind === "lead" ? "load_request" : "job_application"
  const statuses = kind === "lead" ? LEAD_STATUSES : APPLICATION_STATUSES
  const metaOf = kind === "lead" ? leadStatusMeta : applicationStatusMeta
  const needsMotivo = (s: string) => (kind === "lead" ? s === "lost" : s === "rejected")

  const applyStatus = (nuevo: string, razon?: string) =>
    start(async () => {
      try {
        if (kind === "lead") await updateLeadStatus(id, nuevo, razon)
        else await updateApplicationStatus(id, nuevo, razon)
        toast.success(`Estatus actualizado a ${metaOf(nuevo).label}`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo actualizar el estatus")
      }
    })

  const onStatusChange = (nuevo: string) => {
    if (nuevo === status) return
    if (needsMotivo(nuevo)) {
      setPendingStatus(nuevo)
      setMotivo("")
      setMotivoOpen(true)
      return
    }
    applyStatus(nuevo)
  }

  const onAssigneeChange = (v: string) =>
    start(async () => {
      const nuevoId = v === "sin" ? null : v
      if (nuevoId === assigneeId) return
      const nombre = staff.find((s) => s.id === nuevoId)?.name
      try {
        await updateAssignee(entityType, id, nuevoId, nombre)
        toast.success(nuevoId ? `Asignado a ${nombre}` : "Asignación removida")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo asignar")
      }
    })

  const onAddNote = () =>
    start(async () => {
      const body = nota.trim()
      if (!body) return
      try {
        await addNote(entityType, id, body)
        setNota("")
        toast.success("Nota agregada al historial")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo agregar la nota")
      }
    })

  const confirmMotivo = () => {
    const razon = motivo.trim() || "Sin motivo registrado"
    const nuevo = pendingStatus
    setMotivoOpen(false)
    setPendingStatus(null)
    if (nuevo) applyStatus(nuevo, razon)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Estatus</Label>
            <Select value={status} onValueChange={onStatusChange} disabled={pending}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {metaOf(s).label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Asignado a</Label>
            <Select value={assigneeId ?? "sin"} onValueChange={onAssigneeChange} disabled={pending}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sin asignar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sin">Sin asignar</SelectItem>
                {staff.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="det-nota">Agregar nota</Label>
            <Textarea
              id="det-nota"
              placeholder="Escribe el seguimiento de esta gestión"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={onAddNote} disabled={pending || !nota.trim()}>
                Agregar nota
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={motivoOpen} onOpenChange={(open) => !open && setMotivoOpen(false)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>{kind === "lead" ? "Marcar como perdida" : "Rechazar postulación"}</DialogTitle>
              <DialogDescription>Registra el motivo, quedará en el historial de auditoría.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="motivo">Motivo</Label>
              <Textarea
                id="motivo"
                placeholder="Ej. Cerró con otro transportista por tarifa"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMotivoOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmMotivo} disabled={pending}>
                {kind === "lead" ? "Marcar perdida" : "Rechazar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

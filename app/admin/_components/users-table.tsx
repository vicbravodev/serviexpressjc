"use client"

import { useState, useTransition } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { createUser, setUserActive, updateUserRole } from "@/lib/actions/admin"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Controles de la lista de Usuarios: cada fila se gestiona en su lugar, sin vista de detalle.

/** Las acciones devuelven `{ error }` en vez de lanzar (Next oculta el mensaje en producción). */
const ok = ({ error }: { error?: string }) => {
  if (error) throw new Error(error)
}

type User = { id: string; nombre: string; rol: "admin" | "user"; activo: boolean }

export function RoleSelect({ user, disabled }: { user: User; disabled?: boolean }) {
  const [pending, start] = useTransition()
  const onChange = (v: string) =>
    start(async () => {
      try {
        ok(await updateUserRole(user.id, v as "admin" | "user"))
        toast.success(`${user.nombre} ahora es ${v === "admin" ? "Admin" : "Usuario"}`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo actualizar el rol")
      }
    })
  return (
    <Select value={user.rol} onValueChange={onChange} disabled={disabled || pending}>
      <SelectTrigger size="sm" className="w-[120px]" aria-label={`Rol de ${user.nombre}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="user">Usuario</SelectItem>
      </SelectContent>
    </Select>
  )
}

/** Activar es inmediato; desactivar pide confirmación porque corta el acceso al panel. */
export function ActiveSwitch({ user, disabled }: { user: User; disabled?: boolean }) {
  const [pending, start] = useTransition()
  const [confirm, setConfirm] = useState(false)

  const apply = (active: boolean) =>
    start(async () => {
      try {
        ok(await setUserActive(user.id, active))
        toast.success(`${user.nombre} ${active ? "reactivado" : "desactivado"}`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo actualizar la cuenta")
      }
    })

  return (
    <>
      <label className="flex items-center gap-2">
        <Switch
          checked={user.activo}
          onCheckedChange={(checked) => (checked ? apply(true) : setConfirm(true))}
          disabled={disabled || pending}
        />
        <span className={user.activo ? "text-sm" : "text-sm text-muted-foreground"}>
          {user.activo ? "Activo" : "Inactivo"}
        </span>
      </label>
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar a {user.nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              La persona perderá acceso al panel de inmediato. Podrás reactivar la cuenta más adelante.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => apply(false)}
            >
              Desactivar cuenta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function NewUserButton() {
  const [pending, start] = useTransition()
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rol, setRol] = useState<"admin" | "user">("user")

  const confirmCreate = () =>
    start(async () => {
      try {
        ok(await createUser({ email, password, fullName: nombre, role: rol }))
        toast.success(`Cuenta creada para ${email.trim()}`)
        setOpen(false)
        setNombre("")
        setEmail("")
        setPassword("")
        setRol("user")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo crear la cuenta")
      }
    })

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Nuevo usuario
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Nuevo usuario</DialogTitle>
            <DialogDescription>La cuenta queda activa de inmediato con la contraseña asignada.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-nombre">Nombre</Label>
              <Input id="inv-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-email">Correo</Label>
              <Input
                id="inv-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@serviexpressjc.mx"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-pass">Contraseña</Label>
              <Input
                id="inv-pass"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="inv-pass-help"
              />
              <p id="inv-pass-help" className="text-xs text-muted-foreground">
                Mínimo 8 caracteres.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-rol">Rol</Label>
              <Select value={rol} onValueChange={(v) => setRol(v as "admin" | "user")}>
                <SelectTrigger id="inv-rol" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmCreate} disabled={pending || !email.trim() || password.length < 8}>
              Crear cuenta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

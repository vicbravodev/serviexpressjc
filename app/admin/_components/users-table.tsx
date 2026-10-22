"use client"

import { useState, useTransition } from "react"
import { ChevronDown, Plus } from "lucide-react"
import { toast } from "sonner"
import { createUser, setUserActive, updateUserPermissions, updateUserRole } from "@/lib/actions/admin"
import { SECTION_LABELS, SECTIONS, type Section } from "@/lib/admin/meta"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Controles de la lista de Usuarios: cada fila se gestiona en su lugar, sin vista de detalle.

/** Las acciones devuelven `{ error }` en vez de lanzar (Next oculta el mensaje en producción). */
const ok = ({ error }: { error?: string }) => {
  if (error) throw new Error(error)
}

type User = { id: string; nombre: string; rol: "admin" | "user"; activo: boolean; secciones: Section[] }

const sectionsSummary = (s: Section[]) =>
  s.length === 0 ? "Sin acceso" : s.length === SECTIONS.length ? "Todas" : s.map((k) => SECTION_LABELS[k]).join(", ")

/**
 * Qué secciones ve una cuenta "user". Cada casilla guarda al momento; el menú queda
 * abierto para marcar varias. Admin ve todo, así que solo se informa.
 */
export function SectionsMenu({ user, disabled }: { user: User; disabled?: boolean }) {
  const [pending, start] = useTransition()
  // Optimista: la casilla responde al clic y se revierte si la acción falla.
  const [value, setValue] = useState(user.secciones)
  if (user.rol === "admin") return <span className="text-sm text-muted-foreground">Todas (admin)</span>

  const toggle = (section: Section, on: boolean) => {
    const prev = value
    const next = SECTIONS.filter((s) => (s === section ? on : value.includes(s)))
    setValue(next)
    start(async () => {
      try {
        ok(await updateUserPermissions(user.id, next))
        toast.success(`${user.nombre}: ${on ? "ahora ve" : "ya no ve"} ${SECTION_LABELS[section]}`)
      } catch (e) {
        setValue(prev)
        toast.error(e instanceof Error ? e.message : "No se pudieron actualizar los permisos")
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          size="sm"
          className="max-w-56 justify-between font-normal"
          aria-label={`Secciones de ${user.nombre}: ${sectionsSummary(value)}`}
        >
          <span className={value.length === 0 ? "truncate text-muted-foreground" : "truncate"}>
            {sectionsSummary(value)}
          </span>
          <ChevronDown className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Puede ver</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SECTIONS.map((s) => (
          <DropdownMenuCheckboxItem
            key={s}
            checked={value.includes(s)}
            disabled={pending}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={(on) => toggle(s, on === true)}
          >
            {SECTION_LABELS[s]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
  const [secciones, setSecciones] = useState<Section[]>([])

  const confirmCreate = () =>
    start(async () => {
      try {
        ok(await createUser({ email, password, fullName: nombre, role: rol, permissions: secciones }))
        toast.success(`Cuenta creada para ${email.trim()}`)
        setOpen(false)
        setNombre("")
        setEmail("")
        setPassword("")
        setRol("user")
        setSecciones([])
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
            {rol === "user" ? (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1.5 text-sm font-medium">Puede ver</legend>
                {SECTIONS.map((s) => (
                  <Label key={s} className="font-normal">
                    <Checkbox
                      checked={secciones.includes(s)}
                      onCheckedChange={(on) =>
                        setSecciones((cur) => SECTIONS.filter((k) => (k === s ? on === true : cur.includes(k))))
                      }
                    />
                    {SECTION_LABELS[s]}
                  </Label>
                ))}
                <p className="text-xs text-muted-foreground">Puedes cambiarlo después desde la lista.</p>
              </fieldset>
            ) : (
              <p className="text-xs text-muted-foreground">Admin ve todas las secciones y gestiona usuarios.</p>
            )}
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

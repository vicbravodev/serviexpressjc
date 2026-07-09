"use client"

import { useState, useTransition } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { createUser, setUserActive, updateUserRole } from "@/lib/actions/admin"
import { initials } from "@/lib/admin/meta"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type UserRow = {
  id: string
  nombre: string
  email: string
  rol: "admin" | "user"
  activo: boolean
  alta: string
}

export function UsersTable({ users, selfId }: { users: UserRow[]; selfId: string }) {
  const [pending, start] = useTransition()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rol, setRol] = useState<"admin" | "user">("user")
  const [deactUser, setDeactUser] = useState<UserRow | null>(null)

  const activos = users.filter((u) => u.activo).length

  const onRol = (u: UserRow) => (v: string) =>
    start(async () => {
      try {
        await updateUserRole(u.id, v as "admin" | "user")
        toast.success(`Rol actualizado a ${v === "admin" ? "Admin" : "Usuario"}`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo actualizar el rol")
      }
    })

  const onToggle = (u: UserRow) => (checked: boolean) => {
    if (!checked && u.activo) {
      setDeactUser(u)
      return
    }
    start(async () => {
      try {
        await setUserActive(u.id, checked)
        toast.success(`${u.nombre} ${checked ? "reactivado" : "desactivado"}`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo actualizar la cuenta")
      }
    })
  }

  const confirmDeact = () => {
    const u = deactUser
    setDeactUser(null)
    if (!u) return
    start(async () => {
      try {
        await setUserActive(u.id, false)
        toast.success(`${u.nombre} desactivado`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo desactivar la cuenta")
      }
    })
  }

  const confirmCreate = () =>
    start(async () => {
      try {
        await createUser({ email, password, fullName: nombre, role: rol })
        toast.success(`Cuenta creada para ${email.trim()}`)
        setInviteOpen(false)
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
      <div className="flex justify-end">
        <Button onClick={() => setInviteOpen(true)}>
          <Plus />
          Nuevo usuario
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Alta</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const isSelf = u.id === selfId
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback>{initials(u.nombre)}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col gap-px">
                        <span className="whitespace-nowrap text-sm font-medium">{u.nombre}</span>
                        <span className="font-mono text-xs text-muted-foreground">{u.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={u.rol} onValueChange={onRol(u)} disabled={pending || isSelf}>
                      <SelectTrigger size="sm" className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">Usuario</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={u.activo} onCheckedChange={onToggle(u)} disabled={pending || isSelf} />
                      <span
                        className={cn(
                          "whitespace-nowrap text-xs",
                          u.activo ? "text-muted-foreground" : "text-destructive",
                        )}
                      >
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">{u.alta}</span>
                  </TableCell>
                  <TableCell>
                    {u.activo && !isSelf ? (
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setDeactUser(u)} disabled={pending}>
                          <span className="text-destructive">Desactivar</span>
                        </Button>
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="border-t p-2.5 px-4 font-mono text-xs tracking-[0.08em] text-muted-foreground">
          {users.length} CUENTAS · {activos} ACTIVAS
        </div>
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
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
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Rol</Label>
              <Select value={rol} onValueChange={(v) => setRol(v as "admin" | "user")}>
                <SelectTrigger className="w-full">
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
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmCreate} disabled={pending || !email.trim() || password.length < 8}>
              Crear cuenta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deactUser !== null} onOpenChange={(open) => !open && setDeactUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deactUser ? `¿Desactivar a ${deactUser.nombre}?` : "¿Desactivar cuenta?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              La persona perderá acceso al panel de inmediato. Podrás reactivar la cuenta más adelante.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={confirmDeact}>
              Desactivar cuenta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

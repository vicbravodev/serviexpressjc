"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser } from "@/lib/actions/admin"

export function UserForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"admin" | "user">("user")
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <h2 className="font-semibold">Nuevo usuario</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1"><Label htmlFor="u-name">Nombre</Label>
          <Input id="u-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-10" /></div>
        <div className="space-y-1"><Label htmlFor="u-email">Email</Label>
          <Input id="u-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10" /></div>
        <div className="space-y-1"><Label htmlFor="u-pass">Contraseña</Label>
          <Input id="u-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10" /></div>
        <div className="space-y-1"><Label htmlFor="u-role">Rol</Label>
          <select id="u-role" value={role} onChange={(e) => setRole(e.target.value as "admin" | "user")}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm">
            <option value="user">user (solo leads)</option>
            <option value="admin">admin (todo)</option>
          </select></div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        disabled={pending || !email || password.length < 8}
        onClick={() =>
          start(async () => {
            setError(null)
            try {
              await createUser({ email, password, fullName, role })
              setEmail(""); setPassword(""); setFullName(""); setRole("user")
            } catch (e) {
              setError(e instanceof Error ? e.message : "Error")
            }
          })
        }
      >
        {pending ? "Creando…" : "Crear usuario"}
      </Button>
    </div>
  )
}

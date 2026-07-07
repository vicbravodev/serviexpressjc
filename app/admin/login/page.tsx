"use client"

import { useActionState } from "react"
import { signIn, type SignInState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, {})
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-1 text-2xl font-bold">Panel JC Serviexpress</h1>
      <p className="mb-6 text-sm text-muted-foreground">Acceso restringido.</p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-11" />
        </div>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <Button type="submit" disabled={pending} className="h-11 w-full">
          {pending ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </div>
  )
}

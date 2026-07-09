"use client"

import { useActionState } from "react"
import { Truck } from "lucide-react"
import { signIn, type SignInState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, {})
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Truck className="size-6" />
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight">ServiExpress JC</p>
            <p className="text-sm text-muted-foreground">Panel administrativo</p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Acceso restringido al personal autorizado.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-11" />
              </div>
              {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
              <Button type="submit" disabled={pending} className="h-11 w-full">
                {pending ? "Entrando…" : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

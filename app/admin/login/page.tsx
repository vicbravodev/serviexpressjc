"use client"

import { useActionState } from "react"
import Image from "next/image"
import { AlertCircle } from "lucide-react"
import { signIn, type SignInState } from "@/lib/actions/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, {})
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/40 p-4">
      <div className="flex w-full max-w-[380px] flex-col gap-6">
        <div className="flex items-center gap-3">
          <Image src="/logo-white-bg.png" alt="" width={800} height={450} className="h-12 w-14 object-cover" priority />
          <div className="flex flex-col leading-tight">
            <h1 className="text-lg font-semibold">ServiExpress JC</h1>
            <p className="text-sm text-muted-foreground">Panel de operación</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Con la cuenta que te dio el administrador del panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="flex flex-col gap-4">
              {state.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              ) : null}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-correo">Correo</Label>
                <Input id="login-correo" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-pass">Contraseña</Label>
                <Input id="login-pass" name="password" type="password" autoComplete="current-password" required />
              </div>
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Entrando…" : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

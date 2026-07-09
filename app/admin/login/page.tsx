"use client"

import { useActionState } from "react"
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
    <div className="surface-steel relative min-h-screen overflow-hidden">
      <div className="bg-blueprint absolute inset-0" />
      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="flex w-full max-w-[400px] flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="animate-live-blink bg-yellow-accent inline-block size-2 rounded-full" />
              <span className="font-mono text-[11px] tracking-[0.16em] text-[oklch(0.85_0.01_240_/_0.78)]">
                PANEL DE OPERACIONES
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[26px] font-bold leading-tight tracking-tight text-[oklch(0.98_0.005_240)]">
                ServiExpress JC
              </span>
              <span className="text-[13px] text-[oklch(0.85_0.01_240_/_0.6)]">Sala de control · Carga MX–US</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Iniciar sesión</CardTitle>
              <CardDescription>Acceso exclusivo para el equipo operativo.</CardDescription>
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
                  <Input
                    id="login-correo"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@serviexpressjc.mx"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="login-pass">Contraseña</Label>
                  <Input
                    id="login-pass"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" disabled={pending} className="w-full">
                  {pending ? "Entrando…" : "Iniciar sesión"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center font-mono text-[10px] tracking-[0.14em] text-[oklch(0.85_0.01_240_/_0.4)]">
            USO INTERNO · SERVIEXPRESS JC · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}

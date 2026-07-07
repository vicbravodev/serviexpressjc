import Link from "next/link"
import type { ReactNode } from "react"
import { getSessionClaims } from "@/lib/admin/auth"
import { SignOutButton } from "./_components/sign-out-button"
import "../globals.css"

export const dynamic = "force-dynamic"

// app/admin/** vive fuera de app/[locale], así que no hereda su <html>/<body>.
// El root layout (app/layout.tsx) es un passthrough, así que este layout debe
// proveer el shell HTML propio para todo el segmento /admin (incluido /admin/login).
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const claims = await getSessionClaims()
  // Sin sesión: no renderizamos nav; las páginas internas hacen su propio requireStaff/redirect.
  // La página /admin/login renderiza su propio árbol y no necesita nav.
  const isStaff = claims && (claims.role === "admin" || claims.role === "user")

  if (!isStaff) {
    return (
      <html lang="es" suppressHydrationWarning>
        <body className="font-sans antialiased">{children}</body>
      </html>
    )
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-background text-foreground">
          <header className="border-b border-border">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
              <nav className="flex items-center gap-4 text-sm font-medium">
                <Link href="/admin">Inicio</Link>
                <Link href="/admin/leads">Leads</Link>
                {claims.role === "admin" ? <Link href="/admin/postulaciones">Postulaciones</Link> : null}
                {claims.role === "admin" ? <Link href="/admin/usuarios">Usuarios</Link> : null}
              </nav>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{claims.email} · {claims.role}</span>
                <SignOutButton />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  )
}

import type { ReactNode } from "react"
import { getSessionClaims } from "@/lib/admin/auth"
import { AdminShell } from "./_components/admin-shell"
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
        <AdminShell email={claims.email} role={claims.role}>
          {children}
        </AdminShell>
      </body>
    </html>
  )
}

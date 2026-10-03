import type { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { getSessionClaims } from "@/lib/admin/auth"
import { getPendingCounts } from "@/lib/admin/counts"
import { Toaster } from "@/components/ui/sonner"
import { AdminShell } from "./_components/admin-shell"
import "../globals.css"

export const dynamic = "force-dynamic"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

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
      <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="font-sans antialiased">
          {children}
          <Toaster position="bottom-right" />
        </body>
      </html>
    )
  }

  const counts = await getPendingCounts(claims.role === "admin")

  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <AdminShell
          user={{ email: claims.email, role: claims.role as "admin" | "user" }}
          counts={counts}
        >
          {children}
        </AdminShell>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}

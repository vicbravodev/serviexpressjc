"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Truck, ClipboardList, Users, LogOut, Menu, X } from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean }

const NAV: NavItem[] = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Solicitudes", icon: Truck },
  { href: "/admin/postulaciones", label: "Postulaciones", icon: ClipboardList, adminOnly: true },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, adminOnly: true },
]

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
}

function initials(email: string) {
  return email.slice(0, 2).toUpperCase()
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Truck className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-bold tracking-tight">ServiExpress JC</span>
        <span className="text-[11px] font-medium text-muted-foreground">Panel administrativo</span>
      </span>
    </Link>
  )
}

function NavLinks({ role, onNavigate }: { role: string; onNavigate?: () => void }) {
  const pathname = usePathname()
  const items = NAV.filter((i) => !i.adminOnly || role === "admin")
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r-full bg-primary transition-all",
                active ? "w-1" : "w-0",
              )}
            />
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function UserFooter({ email, role }: { email: string; role: string }) {
  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground">
          {initials(email)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{email}</p>
          <p className="text-xs capitalize text-muted-foreground">{role}</p>
        </div>
      </div>
      <form action={signOut} className="mt-1">
        <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </form>
    </div>
  )
}

export function AdminShell({
  email,
  role,
  children,
}: {
  email: string
  role: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-muted/30 text-foreground lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar — escritorio */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLinks role={role} />
        </div>
        <UserFooter email={email} role={role} />
      </aside>

      {/* Barra superior — móvil */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
        <Brand />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
      </header>

      {/* Panel móvil */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-sidebar shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Brand />
              <Button variant="ghost" size="icon" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavLinks role={role} onNavigate={() => setOpen(false)} />
            </div>
            <UserFooter email={email} role={role} />
          </div>
        </div>
      ) : null}

      <main className="min-w-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>
    </div>
  )
}

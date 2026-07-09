"use client"

import { type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, LayoutDashboard, LogOut, Shield, Users } from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import { folio, initials } from "@/lib/admin/meta"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type Props = {
  user: { email: string; role: "admin" | "user" }
  counts: { newLeads: number; newApplications: number | null }
  children: ReactNode
}

const SECTION_TITLES: Record<string, string> = {
  "": "Tablero",
  leads: "Cotizaciones",
  postulaciones: "Postulaciones",
  usuarios: "Usuarios",
}

export function AdminShell({ user, counts, children }: Props) {
  const pathname = usePathname()
  // /admin[/seccion[/id]]
  const [, , section = "", detailId] = pathname.split("/")
  const isAdmin = user.role === "admin"
  const userName = user.email.split("@")[0].replace(/[.\-_]/g, " ")

  const crumbTitle = SECTION_TITLES[section] ?? "Tablero"
  const detailFolio = detailId ? folio(section === "postulaciones" ? "POS" : "COT", detailId) : null

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="surface-steel relative overflow-hidden rounded-lg">
            <div className="bg-blueprint absolute inset-0" />
            <div className="relative flex items-center justify-between gap-2 p-3 text-[oklch(0.98_0.005_240)]">
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">ServiExpress JC</span>
                <span className="font-mono text-[9.5px] tracking-[0.13em] text-[oklch(0.85_0.01_240_/_0.55)]">
                  SALA DE CONTROL
                </span>
              </div>
              <span className="rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.1em]">
                {isAdmin ? "ADMIN" : "USER"}
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Operación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={section === ""}>
                    <Link href="/admin">
                      <LayoutDashboard />
                      <span>Tablero</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={section === "leads"}>
                    <Link href="/admin/leads">
                      <FileText />
                      <span>Cotizaciones</span>
                      <span className="ml-auto font-mono text-xs text-muted-foreground">{counts.newLeads}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {counts.newApplications !== null ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={section === "postulaciones"}>
                      <Link href="/admin/postulaciones">
                        <Users />
                        <span>Postulaciones</span>
                        <span className="ml-auto font-mono text-xs text-muted-foreground">
                          {counts.newApplications}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : null}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {isAdmin ? (
            <SidebarGroup>
              <SidebarGroupLabel>Administración</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={section === "usuarios"}>
                      <Link href="/admin/usuarios">
                        <Shield />
                        <span>Usuarios</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-1 border-t pt-2">
            <div className="flex items-center gap-2 px-2 py-1">
              <Avatar className="size-8">
                <AvatarFallback>{initials(userName || user.email)}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col leading-snug">
                <span className="text-sm font-medium capitalize">{userName}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => signOut()}>
                  <LogOut />
                  <span>Cerrar sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background px-4">
          <SidebarTrigger className="size-7" />
          <Separator orientation="vertical" className="!h-4" />
          <div className="min-w-0 overflow-hidden whitespace-nowrap">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/admin">Admin</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {detailFolio ? (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={`/admin/${section}`}>{crumbTitle}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{detailFolio}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{crumbTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex flex-none items-center gap-2 whitespace-nowrap">
            <span className="animate-live-blink bg-yellow-accent inline-block size-[7px] rounded-full" />
            <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">EN VIVO</span>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

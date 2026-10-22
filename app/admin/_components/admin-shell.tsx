"use client"

import { type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Handshake, LayoutDashboard, LogOut, Shield, Users } from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import { BADGE_NEW, folio, initials, SECTION_LABELS, SECTIONS, type Section } from "@/lib/admin/meta"
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type Props = {
  user: { email: string; role: "admin" | "user" }
  /** null en las secciones que la persona no tiene: no se muestran. */
  counts: Record<Section, number | null>
  children: ReactNode
}

const SECTION_TITLES: Record<string, string> = { "": "Tablero", ...SECTION_LABELS, usuarios: "Usuarios" }

const SECTION_ICONS: Record<Section, typeof FileText> = { leads: FileText, socios: Handshake, postulaciones: Users }

const FOLIO_PREFIX: Record<string, "COT" | "POS" | "SOC"> = {
  postulaciones: "POS",
  socios: "SOC",
}

export function AdminShell({ user, counts, children }: Props) {
  const pathname = usePathname()
  // /admin[/seccion[/id]]
  const [, , section = "", detailId] = pathname.split("/")
  const isAdmin = user.role === "admin"
  const userName = user.email.split("@")[0].replace(/[.\-_]/g, " ")

  const crumbTitle = SECTION_TITLES[section] ?? "Tablero"
  const detailFolio = detailId ? folio(FOLIO_PREFIX[section] ?? "COT", detailId) : null

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/admin" className="flex items-center gap-2.5 rounded-md p-1.5 hover:bg-sidebar-accent">
            {/* El PNG trae margen transparente a los lados: object-cover centra solo el logo. */}
            <Image src="/logo-white-bg.png" alt="" width={800} height={450} className="h-10 w-12 object-cover" priority />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">ServiExpress JC</span>
              <span className="text-xs text-muted-foreground">Panel de operación</span>
            </span>
          </Link>
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
                {SECTIONS.map((key) => {
                  const n = counts[key]
                  if (n === null) return null
                  const Icon = SECTION_ICONS[key]
                  return (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton asChild isActive={section === key}>
                        <Link href={`/admin/${key}`}>
                          <Icon />
                          <span>{SECTION_LABELS[key]}</span>
                        </Link>
                      </SidebarMenuButton>
                      <PendingBadge n={n} />
                    </SidebarMenuItem>
                  )
                })}
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
                <span className="truncate text-sm font-medium capitalize">{userName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {isAdmin ? "Admin" : "Usuario"}, {user.email}
                </span>
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

      {/* min-w-0: sin esto el inset (flex-1) crece con la tabla y desborda la página. */}
      <SidebarInset className="min-w-0">
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
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

/** Pendientes por revisar (estatus "nuevo"). Sin pendientes no se muestra nada. */
function PendingBadge({ n }: { n: number | null }) {
  if (!n) return null
  return (
    <SidebarMenuBadge className={`rounded-full px-1.5 ${BADGE_NEW}`}>
      {n}
      <span className="sr-only"> {n === 1 ? "nueva" : "nuevas"}</span>
    </SidebarMenuBadge>
  )
}

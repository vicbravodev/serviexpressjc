import {
  LayoutDashboard,
  Truck,
  Package,
  BarChart3,
  MapPin,
  Settings,
} from "lucide-react"
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
} from "my-v0-project"

const operacion = [
  { titulo: "Tablero", icono: LayoutDashboard, activo: true },
  { titulo: "Embarques", icono: Package, badge: "24" },
  { titulo: "Unidades", icono: Truck, badge: "18" },
  { titulo: "Rutas", icono: MapPin },
  { titulo: "Reportes", icono: BarChart3 },
]

export const ConsolaDespacho = () => (
  <div className="h-96 relative overflow-hidden rounded-lg border">
    <SidebarProvider className="min-h-0 h-full items-stretch">
      <Sidebar collapsible="none" className="border-r">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Truck className="size-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">ServiExpress JC</span>
              <span className="text-muted-foreground text-xs">
                Consola de despacho
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Operación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {operacion.map((item) => (
                  <SidebarMenuItem key={item.titulo}>
                    <SidebarMenuButton isActive={item.activo}>
                      <item.icono />
                      <span>{item.titulo}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings />
                <span>Configuración</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-6">
        <h2 className="text-lg font-semibold">Embarques activos</h2>
        <p className="text-muted-foreground text-sm">
          Turno matutino · 24 embarques en ruta hacia la frontera.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">En ruta</p>
            <p className="text-2xl font-semibold">14</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">En cruce</p>
            <p className="text-2xl font-semibold">6</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  </div>
)

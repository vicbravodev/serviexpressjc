import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "my-v0-project"

const servicios = [
  {
    titulo: "Transporte nacional",
    detalle: "Carga completa y consolidada en toda la República Mexicana.",
  },
  {
    titulo: "Cruce internacional México–USA",
    detalle: "Logística transfronteriza con despacho aduanal en Nuevo Laredo.",
  },
  {
    titulo: "Carga especializada",
    detalle: "Acero, bobina y perfil estructural con unidades tipo plataforma.",
  },
  {
    titulo: "Rastreo en tiempo real",
    detalle: "Monitoreo GPS por unidad y notificaciones de ETA por embarque.",
  },
]

// Panel abierto forzado con defaultValue + viewport={false} para captura estática.
export const MenuServiciosAbierto = () => (
  <div className="flex min-h-80 items-start justify-center p-6">
    <NavigationMenu defaultValue="servicios" viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem value="servicios">
          <NavigationMenuTrigger>Servicios</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-72 flex-col gap-1 p-2">
              {servicios.map((s) => (
                <li key={s.titulo}>
                  <NavigationMenuLink>
                    <div className="text-sm font-medium leading-none">
                      {s.titulo}
                    </div>
                    <p className="text-muted-foreground text-xs leading-snug">
                      {s.detalle}
                    </p>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="cobertura">
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Cobertura
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem value="nosotros">
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Nosotros
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
)

export const BarraNavegacion = () => (
  <div className="flex min-h-32 items-center justify-center p-6">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Servicios
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Cobertura
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Nosotros
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Cotizar embarque
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
)

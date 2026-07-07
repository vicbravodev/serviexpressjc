import {
  Avatar,
  AvatarFallback,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "my-v0-project"
import { CalendarDays, MapPin, Truck } from "lucide-react"

export const PerfilOperador = () => (
  <div className="flex min-h-80 items-start justify-center p-6">
    <HoverCard open>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">
          @jose.ramirez
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-72">
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback>JR</AvatarFallback>
          </Avatar>
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold">José Ramírez</h4>
            <p className="text-muted-foreground text-sm">
              Operador titular · Licencia Federal tipo B
            </p>
            <div className="text-muted-foreground flex items-center gap-2 pt-1 text-xs">
              <Truck className="size-3" />
              Unidad 318 · Caja seca 53'
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <MapPin className="size-3" />
              En ruta: Monterrey → Laredo, TX
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <CalendarDays className="size-3" />6 años en ServiExpress
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </div>
)

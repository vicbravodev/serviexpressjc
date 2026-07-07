import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "my-v0-project"
import { PackageOpen } from "lucide-react"

export const SinEmbarques = () => (
  <Empty className="border">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <PackageOpen />
      </EmptyMedia>
      <EmptyTitle>Sin embarques programados</EmptyTitle>
      <EmptyDescription>
        No hay unidades asignadas para hoy. Genera una cotización para
        agendar tu primer traslado con seguimiento en tiempo real.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button>Cotizar embarque</Button>
    </EmptyContent>
  </Empty>
)

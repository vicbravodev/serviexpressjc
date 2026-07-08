import { Spinner, Button } from "my-v0-project"

export const Tamanos = () => (
  <div className="flex items-center gap-6 text-primary">
    <Spinner className="size-4" />
    <Spinner className="size-6" />
    <Spinner className="size-8" />
  </div>
)

export const EnContexto = () => (
  <div className="flex flex-col gap-4">
    <Button disabled>
      <Spinner />
      Generando cotización…
    </Button>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner className="size-4" />
      Sincronizando rastreo GPS de la flota…
    </div>
  </div>
)

import { Progress } from "my-v0-project"

export const Avance = () => (
  <div className="flex w-80 flex-col gap-2">
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>Embarque MTY → Houston</span>
      <span>68%</span>
    </div>
    <Progress value={68} />
  </div>
)

export const Etapas = () => (
  <div className="flex w-80 flex-col gap-5">
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">En patio</span>
      <Progress value={15} />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">En cruce fronterizo</span>
      <Progress value={50} />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">Entregado</span>
      <Progress value={100} />
    </div>
  </div>
)

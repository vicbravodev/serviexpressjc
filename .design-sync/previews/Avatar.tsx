import { Avatar, AvatarFallback, AvatarImage } from "my-v0-project"

export const Operadores = () => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarFallback>JC</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>MR</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>LG</AvatarFallback>
    </Avatar>
  </div>
)

export const OperadorConNombre = () => (
  <div className="flex items-center gap-3">
    <Avatar className="size-10">
      <AvatarImage src="/broken-operador.jpg" alt="Juan Carlos" />
      <AvatarFallback>JC</AvatarFallback>
    </Avatar>
    <div className="text-sm leading-tight">
      <p className="font-medium">Juan Carlos Medina</p>
      <p className="text-muted-foreground">Operador certificado B1</p>
    </div>
  </div>
)

import * as React from "react"
import { Toaster, toast } from "my-v0-project"

export const Notificacion = () => {
  React.useEffect(() => {
    const id = toast("Embarque confirmado", {
      description: "MTY → Houston · caja seca 53 pies · ETA 15:10 h",
      duration: Infinity,
    })
    return () => toast.dismiss(id)
  }, [])

  return (
    <div className="relative h-44 w-full">
      <Toaster position="top-center" expand visibleToasts={3} />
    </div>
  )
}

export const Exito = () => {
  React.useEffect(() => {
    const id = toast.success("Cotización enviada", {
      description: "Recibirás la tarifa por WhatsApp en unos minutos.",
      duration: Infinity,
    })
    return () => toast.dismiss(id)
  }, [])

  return (
    <div className="relative h-44 w-full">
      <Toaster position="top-center" richColors expand visibleToasts={3} />
    </div>
  )
}

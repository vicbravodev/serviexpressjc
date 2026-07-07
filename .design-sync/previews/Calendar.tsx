import { Calendar } from "my-v0-project"

export const FechaRecoleccion = () => (
  <Calendar
    mode="single"
    defaultMonth={new Date(2026, 6)}
    selected={new Date(2026, 6, 15)}
    className="rounded-md border"
  />
)

export const RangoEntrega = () => (
  <Calendar
    mode="range"
    defaultMonth={new Date(2026, 6)}
    selected={{ from: new Date(2026, 6, 14), to: new Date(2026, 6, 18) }}
    className="rounded-md border"
  />
)

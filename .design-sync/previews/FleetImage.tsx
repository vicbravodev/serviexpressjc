import { FleetImage } from "my-v0-project"

/* Real fleet photo by its public/fleet path. When the file isn't served (as in
   this static bundle) it degrades to the steel/blueprint panel with its mono
   caption — the graceful fallback the layout is designed around. */
export const Foto = () => (
  <FleetImage
    src="/fleet/kenworth-clasico.jpg"
    alt="Tractocamión Kenworth de la flota Servi Express"
    caption="Kenworth · Flota propia"
    className="h-64 w-96 rounded-xl"
  />
)

/* Fallback panel shown explicitly: the blueprint texture plus mono caption keep
   a card from ever looking broken while photos are pending. */
export const Respaldo = () => (
  <FleetImage
    src="/fleet/no-existe-todavia.jpg"
    alt="Cruce fronterizo Nuevo Laredo"
    caption="Cruce Nuevo Laredo → Laredo, TX"
    className="h-64 w-96 rounded-xl"
  />
)

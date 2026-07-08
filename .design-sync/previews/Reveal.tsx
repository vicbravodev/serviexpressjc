import { Reveal, RevealGroup, RevealChild, Card, CardContent, CardHeader, CardTitle } from "my-v0-project"

// The capture's frozen clock never advances whileInView/stagger transitions —
// seed prefers-reduced-motion so the primitives take their own settled,
// fully-visible branch (same pattern as the section previews).
if (typeof window !== "undefined") {
  const real = window.matchMedia?.bind(window)
  window.matchMedia = (query: string) =>
    /prefers-reduced-motion/.test(query)
      ? ({
          matches: true,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        } as MediaQueryList)
      : real
        ? real(query)
        : ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} } as unknown as MediaQueryList)
}

/* Single reveal: fades + lifts a card into view on mount. Captured at its
   settled frame (fully visible, no offset). */
export const Bloque = () => (
  <Reveal className="w-80">
    <Card>
      <CardHeader>
        <CardTitle>Cobertura binacional</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Rutas México–USA con cruce por Nuevo Laredo y monitoreo GPS las 24 horas
          desde la sala de control.
        </p>
      </CardContent>
    </Card>
  </Reveal>
)

/* Stagger group: RevealGroup is the flex parent, each RevealChild animates in
   sequence. Shown at rest so the whole staggered set is visible. */
export const Secuencia = () => {
  const metricas = [
    { valor: "5", etiqueta: "Talleres propios" },
    { valor: "32", etiqueta: "Estados de cobertura" },
    { valor: "24/7", etiqueta: "Monitoreo GPS" },
  ]
  return (
    <RevealGroup className="grid w-96 grid-cols-3 gap-3">
      {metricas.map((m) => (
        <RevealChild key={m.etiqueta}>
          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <p className="font-mono text-2xl font-bold text-foreground tabular-nums">{m.valor}</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.etiqueta}</p>
          </div>
        </RevealChild>
      ))}
    </RevealGroup>
  )
}

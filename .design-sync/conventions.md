# ServiExpress JC — conventions for building with this design system

React + Tailwind v4 + shadcn/ui, branded for a Mexico–USA freight carrier
("Sala de Control" / control-room aesthetic: light surfaces for marketing
content, dark graphite panels for telemetry). Copy is Mexican Spanish.

## Setup / wrapping

- UI-kit primitives (Button, Card, Table, Dialog…) need **no provider** — the
  tokens live in `styles.css`.
- The `Sections` and `Brand` groups (HeroSection, Footer, QuoteSimulator,
  ApplyForm, StatsSection…) read i18n context. Wrap them:
  ```jsx
  <NextIntlClientProvider locale="es" messages={DsMessages} timeZone="America/Monterrey">
    <HeroSection />
  </NextIntlClientProvider>
  ```
  `NextIntlClientProvider` and `DsMessages` (the real Spanish copy) are both
  package exports. Without the wrapper those components throw at render.
- Dark mode: add class `dark` to a root element (tokens flip automatically).
- Toasts: mount `<Toaster />` once and call `toast("…")` / `toast.success("…")`
  — **import `toast` from this package**, not from "sonner".
- Compound parts are all top-level exports: `CardHeader`, `DialogTrigger`,
  `TableRow`, `SelectItem`, etc.

## Styling idiom — Tailwind utilities over design tokens

Style with Tailwind classes bound to the theme tokens (never raw hex):

| Family | Real names |
|---|---|
| Surfaces | `bg-background` `bg-card` `bg-popover` `bg-muted` `bg-secondary` |
| Text | `text-foreground` `text-muted-foreground` `text-card-foreground` `text-primary-foreground` |
| Brand (royal blue) | `bg-primary` `text-primary` `border-primary` `ring-ring` |
| Signal yellow (use sparingly: live/highlight accents) | `text-yellow-accent` `bg-yellow-accent` `text-yellow-accent-bright` |
| State | `bg-destructive` `text-destructive` `border-border` `bg-input` |
| Charts | CSS vars `var(--chart-1)` … `var(--chart-5)` (blues-first ramp) |
| Radius | `rounded-md` `rounded-lg` `rounded-xl` (from `--radius: 0.75rem`) |
| Type | `font-sans` = Geist (ships with the DS), `font-mono` = Geist Mono |

Control-room utilities (this brand's signature, defined in the shipped CSS):
`surface-steel` (graphite panel gradient), `bg-blueprint` (fine grid for dark
panels), `bg-dotgrid` (dot grid for light surfaces), `animate-live-blink`
(telemetry dot), `animate-marquee` + `marquee-mask` (logo/data ticker),
`animate-scan` (monitor scanline), `animate-fade-in-up`, `animate-scale-in`,
`animate-fade-in`. Easing vars: `var(--ease-out)`, `var(--ease-out-quart)`,
`var(--ease-in-out)`.

The shipped stylesheet contains the utilities used across this library plus a
generous common-utility safelist (layout, spacing 0–16, text sizes, theme
colors). Prefer these families; avoid exotic or arbitrary-value classes — they
may not resolve. For anything unusual, inline `style={{}}` with `var(--token)`.

## Where the truth lives

- `styles.css` → tokens (`:root` + `.dark`) and all utilities via its imports.
- `guidelines/DESIGN.md` → the brand spec: named palette (azul-ruta,
  ámbar-señal…), typography scale, voice.
- Per component: `<Name>.d.ts` is the props contract; `<Name>.prompt.md` shows
  composition patterns.

## Idiomatic example

```jsx
<section className="bg-background py-12">
  <div className="mx-auto max-w-xl">
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Embarque MTY → Houston</CardTitle>
          <Badge>En ruta</Badge>
        </div>
        <CardDescription>Caja seca 53 pies · 18.2 ton · Acero</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Salida 06:40 h · ETA 15:10 h · Monitoreo GPS desde la sala de control.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Cotizar embarque</Button>
      </CardFooter>
    </Card>
  </div>
</section>
```

Dark telemetry panel: `<div className="surface-steel bg-blueprint rounded-xl p-6 text-white">…` with a `text-yellow-accent` stat and an `animate-live-blink` dot.

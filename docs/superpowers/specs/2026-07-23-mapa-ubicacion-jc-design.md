# Diseño: Mapa de ubicación de JC (sede Apodaca)

**Fecha:** 2026-07-23
**Estado:** Aprobado para plan

## Objetivo

Integrar un mapa de la ubicación física de Serviexpress JC (sede única en
Apodaca, N.L.) en la landing, para que un visitante que busca dónde están o
cómo llegar lo encuentre al final del flujo de contacto, antes del footer.

## Decisiones tomadas (con el usuario)

- **Integración:** Google **Maps Embed API** en un `<iframe>` (no el snippet de
  Store Locator, que es para múltiples sucursales, pesa mucho y rompe la
  estética del sitio).
- **Ubicación en la página:** componente propio renderizado entre `CTASection`
  y `Footer`.
- **Dirección:** actualizar a la versión verificada por Google en **todo el
  sitio** (footer + schema + mapa).
- **SEO:** agregar `geo { latitude, longitude }` al `localBusinessSchema`.

## Datos verificados (del place de Google)

- **placeId:** `ChIJhRqcmcPrYoYR2oaNwumNn9I`
- **Coords:** `lat 25.7626695, lng -100.2333454`
- **Dirección:** Carr. Mezquital Santa Rosa 3517 Int. C, Cd. Apodaca, N.L., México

## Arquitectura

### 1. Constantes en `lib/site.ts`

Añadir el place verificado como fuente única de verdad:

```ts
export const LOCATION = {
  placeId: "ChIJhRqcmcPrYoYR2oaNwumNn9I",
  lat: 25.7626695,
  lng: -100.2333454,
} as const

/** Key pública de Maps Embed API. Visible en el iframe (normal); debe ir
 *  restringida por referrer + solo Maps Embed API en Google Cloud. */
export const GOOGLE_MAPS_EMBED_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY ?? "AIzaSyANzhut33GBXlBcMvUzKzWORCAhG08MYdU"

/** URL del iframe de embed apuntando al placeId, con idioma por locale. */
export const mapsEmbedUrl = (locale: string) =>
  `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_EMBED_KEY}` +
  `&q=place_id:${LOCATION.placeId}&language=${locale}&region=MX`

/** URL de "Cómo llegar" (direcciones) al placeId, se abre en Google Maps. */
export const mapsDirectionsUrl = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.lat},${LOCATION.lng}` +
  `&destination_place_id=${LOCATION.placeId}`
```

Actualizar `ADDRESS`:

```ts
export const ADDRESS = {
  street: "Carr. Mezquital Santa Rosa 3517 Int. C",
  locality: "Apodaca",
  region: "Nuevo León",
  country: "MX",
} as const
```

### 2. Componente `components/location-section.tsx`

- `"use client"` no necesario si no usa hooks de estado; sí usa `useTranslations`
  y `useLocale` (client). Seguir el patrón de las otras secciones (client
  components con next-intl).
- `id="ubicacion"`, `scroll-mt-28` para anclaje.
- Estructura tipo "Sala de Control", reusando primitivas existentes
  (`Reveal`, `Card`, patrón de kicker mono + dot `animate-live-blink`):
  - **Columna izquierda (mapa):** `<iframe>` con
    - `src={mapsEmbedUrl(locale)}`
    - `loading="lazy"`, `referrerPolicy="no-referrer-when-downgrade"`
    - `title={t("mapAlt")}` (accesibilidad)
    - `allowFullScreen`
    - contenedor con `aspect-[4/3]` (o `16/10` en desktop), `rounded-2xl`,
      `border border-white/10`, `overflow-hidden`.
    - Overlay opcional: dot `animate-live-blink` + caption mono con la ciudad.
  - **Columna derecha (datos):** kicker mono ("Ubicación" / "Sede"), título,
    dirección (de messages), teléfono (`contactPhone(locale)`), email
    (`CONTACT_EMAIL`), y botón **"Cómo llegar"** (`Button asChild` →
    `TrackedLink` a `mapsDirectionsUrl()`, `target="_blank"`,
    `event="directions_click"`).

### 3. Wiring en `app/[locale]/page.tsx`

Importar y renderizar `<LocationSection />` entre `<CTASection />` y `<Footer />`.

### 4. i18n — namespace `Location`

En `messages/es.json` y `messages/en.json`:

```json
"Location": {
  "kicker": "Ubicación",              // en: "Location"
  "title": "Dónde estamos",           // en: "Where we are"
  "description": "...",               // 1 línea de contexto (sede + operación)
  "mapAlt": "Mapa de la sede de ServiExpress JC en Apodaca, N.L.",
  "directions": "Cómo llegar",        // en: "Get directions"
  "cityCaption": "Apodaca, N.L."
}
```

Actualizar también:
- `Footer.addressLine1` → `"Carr. Mezquital Santa Rosa 3517 Int. C"`
- `Footer.addressLine2` → `"Cd. Apodaca, N.L., México"` / en: `"...Mexico"`

### 5. Schema — `lib/schema.ts`

Añadir `geo` al objeto de LocalBusiness:

```ts
geo: {
  "@type": "GeoCoordinates",
  latitude: LOCATION.lat,
  longitude: LOCATION.lng,
},
```

(importar `LOCATION` desde `site.ts`; ajustar el comentario que hoy dice que el
geo se omite por no estar confirmado).

## Flujo de datos

`site.ts` (place + key + URLs) → `LocationSection` (iframe + botón) y
`schema.ts` (geo). i18n desde `messages/*`. Una sola fuente de verdad del place.

## Manejo de errores / bordes

- **Key ausente en env:** el fallback hardcodeado mantiene el mapa funcional en
  preview. La key es pública por naturaleza (va en el iframe).
- **iframe bloqueado / sin red:** degrada a un recuadro vacío; el botón "Cómo
  llegar" y la dirección en texto siguen dando la info. Aceptable.
- **Locale en/es:** `language` y `region` se pasan al embed; el botón de
  direcciones no depende de idioma.

## Verificación

- `pnpm build` / typecheck sin errores.
- Dev server: la sección renderiza, el iframe carga el place correcto, el botón
  abre direcciones, responsive en mobile/desktop, dark mode OK.
- Footer y schema muestran la dirección nueva; `geo` presente en el JSON-LD.

## Fuera de alcance (YAGNI)

- Buscador / autocompletar / "sucursal más cercana" (Store Locator): innecesario
  con una sola sede.
- Mapa interactivo con Maps JS + dependencias: descartado por peso; el embed
  cubre el caso.
- Horarios de oficina en el schema: no confirmados, se dejan fuera.

## Seguridad (acción previa a prod)

Restringir `AIzaSy…MYdU` en Google Cloud Console:
- **Application restriction:** HTTP referrers → `serviexpressjc.com.mx/*`,
  `*.serviexpressjc.com.mx/*`, `*.vercel.app/*`.
- **API restriction:** solo *Maps Embed API*.
Documentar la key también como `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` en Vercel.

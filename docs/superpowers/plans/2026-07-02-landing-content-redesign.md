# Rediseño de contenido, cotizador y formularios — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Experiencia calculada desde 2005, página consolidada de 11 a 9 secciones sin hechos duplicados, y conversión funcional: cotizador autoservicio con handoff a WhatsApp y postulación simple.

**Architecture:** Fuente única de datos de empresa en `lib/site.ts` consumida por i18n (ICU `{years}`), JSON-LD y footer. Se elimina `FeaturesSection`, se fusionan Clients+Testimonials en `SocialProofSection`, se destila About. El cotizador es un client component con modelo de tarifas transparente en `lib/quote.ts` (haversine × factor carretera); todo el handoff es `wa.me` prellenado, sin backend.

**Tech Stack:** Next.js 15 App Router, next-intl 4 (ICU), Tailwind v4, shadcn/ui (Select, Slider, Button, Label), motion.

## Global Constraints

- Sin em dashes en copy (DESIGN.md). Español de México, sin tecnicismos huecos.
- Paridad total `messages/es.json` ↔ `messages/en.json` (mismas claves).
- Prohibido: sombra permanente en reposo (excepto mapa de Coverage), grids de cards idénticas, gradient text, `border-left` grueso, `#000`/`#fff` como decisión nueva.
- Ámbar = un acento por pantalla. CTAs siempre azul (`bg-secondary` en este código).
- Verificación por tarea: `npx tsc --noEmit` + grep de aceptación; verificación visual al final con preview tools (no hay framework de tests en el repo y no se instala uno para esto).
- Commit por tarea.

---

### Task 1: Fuente única de empresa y años dinámicos

**Files:**
- Modify: `lib/site.ts`
- Modify: `messages/es.json`, `messages/en.json` (Metadata, Hero.badgeYears, About.subtitle, Stats.metrics[0].caption, CTA phonePh en)
- Modify: `app/[locale]/layout.tsx` (metadata + JSON-LD)
- Modify: `components/hero-section.tsx:151`, `components/stats-section.tsx:19`, `components/footer.tsx` (contacto desde constantes)
- Modify: `DESIGN.md`, `PRODUCT.md` (hecho "10+ años" → "desde 2005, calculado")

**Interfaces (Produces):**
```ts
// lib/site.ts
export const FOUNDING_YEAR = 2005
export const yearsInService: () => number            // new Date().getFullYear() - FOUNDING_YEAR
export const CONTACT_PHONE = "+13463669867"
export const CONTACT_PHONE_DISPLAY = "+1 346 366 9867"
export const WHATSAPP_PHONE: string                  // solo dígitos; env NEXT_PUBLIC_WHATSAPP_PHONE ?? "13463669867"
export const CONTACT_EMAIL = "contacto@serviexpressjc.com.mx"
export const ADDRESS: { street: string; locality: string; region: string; country: "MX" }
export const SOCIAL_LINKS: { instagram: string; facebook: string; linkedin: string }
export const whatsappUrl: (text: string) => string   // https://wa.me/<phone>?text=<encoded>
```

- [ ] **Step 1:** Ampliar `lib/site.ts` con las constantes de arriba (conservar `SITE_URL` y `localePath`).
- [ ] **Step 2:** Mensajes con ICU `{years}`:
  - es `Metadata.description`: "Transporte de carga nacional e internacional entre México y Estados Unidos. {years} años en ruta desde 2005, flota propia y monitoreo GPS 24/7."
  - en `Metadata.description`: "Domestic and cross-border freight between Mexico and the United States. {years} years on the road since 2005, company-owned fleet, 24/7 GPS tracking."
  - es `Hero.badgeYears`: " · {years} años en ruta" / en: " · {years} years on the road"
  - es `About.subtitle`: "Desde 2005 movemos carga nacional e internacional: {years} años de flota propia, operada y mantenida por nuestra propia gente." / en equivalente.
  - es `Stats.metrics[0].caption`: "Desde 2005, sin parar" / en: "Since 2005, nonstop"
  - en `CTA.quote.phonePh` y `CTA.apply.phonePh`: "e.g. (812) 555-0143" (dejar de usar el número real).
- [ ] **Step 3:** `layout.tsx`: `t("description", { years: yearsInService() })` en metadata y JSON-LD; quitar `generator: "v0.app"`; JSON-LD usa `CONTACT_EMAIL`, `CONTACT_PHONE`, `ADDRESS`, `SOCIAL_LINKS` y agrega `foundingDate: String(FOUNDING_YEAR)`.
- [ ] **Step 4:** `hero-section.tsx:151`: `t("badgeYears", { years: yearsInService() })`. `stats-section.tsx:19`: `{ icon: BadgeCheck, target: yearsInService() }` (sin `suffix: "+"`; el número exacto es la evidencia). `footer.tsx`: tel/mail/redes desde constantes.
- [ ] **Step 5:** Actualizar la mención "más de diez años / 10+ años" en `DESIGN.md` y `PRODUCT.md` por "desde 2005 (los años se calculan)".
- [ ] **Step 6:** Verificar: `npx tsc --noEmit` limpio y `grep -rn "10+ años\|10+ years\|más de una década\|more than a decade" --include="*.json" --include="*.tsx" --include="*.md" .` sin resultados (fuera de specs/plans). Commit `feat: experiencia dinámica desde 2005 y fuente única de datos de empresa`.

---

### Task 2: Consolidación de secciones

**Files:**
- Modify: `app/[locale]/page.tsx` (orden nuevo, sin Features/Clients/Testimonials)
- Create: `components/social-proof-section.tsx`
- Delete: `components/features-section.tsx`, `components/clients-section.tsx`, `components/testimonials-section.tsx`
- Modify: `components/about-section.tsx` (destilar), `messages/es.json` + `messages/en.json` (borrar `Features`, fusionar `Clients`+`Testimonials` → `SocialProof`, reescribir `About`, pilar 1 de `Talleres`, `Footer.services` a 4 items)

**Interfaces (Produces):** `SocialProofSection` server component con `id="clientes"` (ancla usada por header y footer).

- [ ] **Step 1:** Nuevo orden en `page.tsx`: Hero → Stats → Services → Coverage → Certifications → Talleres → About → SocialProof → CTA.
- [ ] **Step 2:** `SocialProofSection` (id="clientes", `bg-muted/30`): encabezado kicker/título/subtítulo; franja de logos como tira única con divisores hairline (no grid de tiles con hover-shadow); testimonios en composición asimétrica: cita destacada grande (2 columnas, con atribución de empresa) + 2 citas compactas apiladas; sin estrellas fabricadas; ámbar solo en las comillas de la cita destacada. Cards con `shadow-none`.
- [ ] **Step 3:** `About` destilado: se conserva kicker/título/subtítulo(desde 2005)/imagen de flota; misión y visión se funden en dos párrafos de prosa (`story1`, `story2` en messages) bajo un subtítulo mono "Nuestra casa"; se eliminan `missionTitle/missionText/visionTitle/visionText/valuesTitle/values` y las 3 Cards.
- [ ] **Step 4:** `Talleres.pillars[0]` deja de repetir el titular: es `{ "title": "Preventivo y correctivo", "caption": "Cada unidad se diagnostica y repara en casa" }` / en `{ "title": "Preventive & corrective", "caption": "Every truck diagnosed and serviced in-house" }`.
- [ ] **Step 5:** Borrar namespace `Features` en ambos locales; fusionar `Clients`+`Testimonials` en `SocialProof` (title, subtitle, logoAlt, more, items[3]); `Footer.services` queda con 4 items (sin "Monitoreo GPS 24/7") y `footer.tsx` mapea `[0,1,2,3]`.
- [ ] **Step 6:** Verificar `npx tsc --noEmit`; `grep -rn "Features\." components/ app/` sin usos; anclas `#clientes`, `#quienes-somos` siguen resolviendo. Commit `feat: consolida contenido, cada hecho vive en un solo lugar`.

---

### Task 3: Modelo de estimación `lib/quote.ts`

**Files:**
- Create: `lib/quote.ts`

**Interfaces (Produces):**
```ts
export type ServiceType = "nacional" | "internacional"
export type UnitType = "dryvan" | "flatbed" | "oversize"
export type City = { id: string; name: string; lat: number; lng: number; country: "MX" | "US" }
export const MX_CITIES: City[]   // Monterrey, Saltillo, Torreón, Chihuahua, SLP, Querétaro, León, Guadalajara, CDMX
export const US_CITIES: City[]   // Laredo, San Antonio, Houston, Dallas, Atlanta, Chicago, Kansas City, Detroit, Los Ángeles
export function estimateQuote(input: { service: ServiceType; originId: string; destinationId: string; unit: UnitType; tons: number }):
  { min: number; max: number; currency: "MXN" | "USD"; distanceKm: number } | null
```

- [ ] **Step 1:** Implementar con coordenadas reales de las ciudades, haversine, `ROAD_FACTOR = 1.3`, tarifas orientativas comentadas ("ajustar con tarifas reales del negocio"): MXN `base 3500 + km × {dryvan 32, flatbed 36, oversize 55}`; USD `base 350 + km × {2.1, 2.35, 3.6} + cruce 450`; factor de peso `≤15t ×1, ≤25t ×1.08, >25t ×1.18`; rango `±12%` redondeado a centenas (MXN) / decenas (USD). `null` si origen=destino o ids inválidos.
- [ ] **Step 2:** Verificación rápida de cordura con `node --experimental-strip-types` o cálculo manual: Monterrey→Houston ≈ 550 km línea recta ≈ 715 km carretera; dryvan 20 t ⇒ USD base 350 + 715×2.1×1.08 + 450 ≈ 2,421 ⇒ rango ~2,130–2,710 USD. Plausible.
- [ ] **Step 3:** Commit `feat: modelo de estimación de cotización con tarifas orientativas`.

---

### Task 4: Cotizador + formularios funcionales

**Files:**
- Create: `components/quote-simulator.tsx` (`"use client"`)
- Create: `components/apply-form.tsx` (`"use client"`)
- Rewrite: `components/cta-section.tsx` (server: layout + WhatsApp real)
- Modify: `messages/es.json` + `messages/en.json` (namespace `Quote` nuevo; `CTA.apply` simplificado; `CTA.whatsapp` con link real)

**Interfaces (Consumes):** `estimateQuote`, ciudades de `lib/quote.ts`; `whatsappUrl`, `CONTACT_PHONE`, `CONTACT_PHONE_DISPLAY` de `lib/site.ts`.

- [ ] **Step 1:** `QuoteSimulator`: una sola card sin wizard. Controles en orden: (1) chips servicio Nacional|Internacional (botones `aria-pressed`, alto ≥44px); (2) Select origen (MX_CITIES); (3) Select destino (MX o US según servicio); (4) chips unidad Caja seca 53'|Plataforma|Sobredimensionada; (5) Slider peso 1–35 t con valor visible. Resultado en vivo cuando origen≠destino: rango con `Intl.NumberFormat(locale)`, distancia aproximada, y disclaimer corto. CTA primario `bg-secondary` "Afinar con un agente" → `whatsappUrl(t("Quote.whatsappMessage", {...params, range}))` con `target="_blank" rel="noopener"`; secundario `tel:` con número visible. Estado vacío: texto que invita a completar ruta. Todos los strings por `useTranslations("Quote")`; `useLocale()` para formato de moneda.
- [ ] **Step 2:** `ApplyForm`: campos nombre (Input, required), teléfono (Input tel, required), puesto (Select: operador B1, operador nacional, técnico de taller, administrativo), experiencia (Select: <2, 2-5, 5-10, >10 años). Submit (client) valida y abre `whatsappUrl(t("CTA.apply.whatsappMessage", {...}))`; nota visible "adjunta tu CV en el chat". Sin input de archivo, sin email requerido.
- [ ] **Step 3:** `cta-section.tsx`: sección `py-24` con grid `lg:grid-cols-5`: cotizador (`id="cotizacion"`, col-span-3) y postulación (`id="postulate"`, col-span-2). Debajo, card de contacto directo con botón WhatsApp como `<a href={whatsappUrl(t("CTA.whatsapp.prefill"))}>` (verde marca, ícono `aria-hidden`), y teléfono/correo como enlaces. Cards `shadow-none`.
- [ ] **Step 4:** Mensajes `Quote` (es/en): labels de cada control, nombres visibles de unidades, `estimateTitle`, `estimateNote` (disclaimer: orientativo, un agente lo afina según báscula, maniobras, seguro y disponibilidad), `refine` (CTA), `call`, `empty`, `distance` ("≈ {km} km por carretera"), `whatsappMessage` plantilla completa con todos los parámetros y el rango. `CTA.apply.whatsappMessage` plantilla de postulación. `CTA.quote.*` viejo se elimina (el simulador lo reemplaza).
- [ ] **Step 5:** Verificar `npx tsc --noEmit`; en preview: estimado Monterrey→Houston visible, botón abre wa.me con mensaje íntegro, postulación válida abre wa.me. Commit `feat: cotizador autoservicio con handoff a WhatsApp y postulación simple`.

---

### Task 5: Polish de drift (sombras, ámbar, limpieza)

**Files:**
- Modify: `components/stats-section.tsx:93` (quitar `shadow-2xl shadow-black/40`), `components/about-section.tsx:24` (ídem), `components/talleres-section.tsx:17` (ídem), `components/hero-section.tsx:173` (quitar `shadow-lg shadow-black/20`)
- Delete (si `grep` confirma 0 referencias): `public/modern-truck-on-highway-at-sunset.jpg`, `public/map-of-mexico-and-usa-with-transportation-routes.jpg`, logos placeholder de v0 (`abstract-retail-logo.png`, `automotive-company-logo.png`, `food-company-logo.png`, `generic-tech-logo.png`, `logistics-company-logo.png`, `manufacturing-company-logo.png`, `placeholder-user.jpg`, `placeholder.jpg`, `placeholder-logo.png`)

- [ ] **Step 1:** Quitar las sombras en reposo listadas (el `shadow-2xl` del mapa de Coverage se conserva).
- [ ] **Step 2:** `grep -rn "<asset>" app/ components/ lib/` por cada asset; borrar solo los no referenciados.
- [ ] **Step 3:** `npm run build` limpio. Commit `fix: plano en reposo y limpieza de assets de plantilla`.

---

### Task 6: Verificación integral

- [ ] **Step 1:** `preview_start` + revisar consola sin errores en `/` y `/en`.
- [ ] **Step 2:** Snapshot: orden de secciones correcto, "21" visible en badge y stats, sin sección Features, social proof unificada.
- [ ] **Step 3:** Interacción: simulador end-to-end (servicio→ruta→unidad→peso→rango→wa.me), postulación, anclas de navegación.
- [ ] **Step 4:** `preview_resize` móvil 375px: sin scroll horizontal, touch targets ≥44px, slider usable. Reduced motion ok.
- [ ] **Step 5:** Screenshot de evidencia + `/code-review`-style pass sobre el diff. Commit final si hay fixes.

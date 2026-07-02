# Internacionalización ES/EN de la landing — Diseño

**Fecha:** 2026-07-02
**Objetivo:** Publicar la landing en español (México/Latinoamérica) e inglés (nativo, EE.UU.), con switcher de idioma en la UI y SEO de primera clase para posicionar en México y USA.

## Contexto

- Next.js 15.5 (App Router), React 19, Tailwind v4, pnpm. Landing de una sola página (`app/page.tsx`) compuesta por 13 componentes de sección; ~6 son client components.
- Todo el copy está hardcodeado en español dentro de los componentes (~1,800 líneas en `components/*.tsx`), incluyendo formularios de cotización y postulación, `alt` de imágenes, `aria-label`s y metadata en `app/layout.tsx`.
- `html lang="es"` fijo. No hay librería de i18n, ni sitemap, ni robots, ni JSON-LD.
- La voz de marca (PRODUCT.md) es español de México, cercana y directa; eso debe preservarse en ES y tener un equivalente nativo en EN (no traducción literal).

## Decisión de arquitectura

**next-intl con segmento dinámico `app/[locale]/`** y `localePrefix: "as-needed"`:

- `/` → español (idioma default, **sin prefijo**: preserva las URLs ya indexadas y el share history).
- `/en` → inglés.
- Locales: `es` y `en` (en metadata/hreflang se declaran como `es-MX` y `en-US`).

### Alternativas descartadas

1. **Toggle client-side (Context/estado, una sola URL):** Google no indexa la versión en inglés como página propia; incumple el requisito SEO. Descartado.
2. **Dominios o subdominios separados (`.mx` / `.com`):** máxima señal geográfica pero duplica hosting/deploys/analytics y divide autoridad de dominio; innecesario para una landing. Descartado.

## Componentes del diseño

### 1. Infraestructura next-intl

- Dependencia nueva: `next-intl` (v4, compatible con Next 15 / React 19).
- `next.config.mjs` → envuelto con `createNextIntlPlugin`.
- `i18n/routing.ts`: `defineRouting({ locales: ["es", "en"], defaultLocale: "es", localePrefix: "as-needed" })`.
- `i18n/request.ts`: carga de mensajes por locale para server components.
- `i18n/navigation.ts`: `Link`, `usePathname`, `useRouter` locale-aware para el switcher.
- `middleware.ts`: middleware de next-intl. Detección por cookie `NEXT_LOCALE` y `Accept-Language` solo en la primera visita; Googlebot recibe siempre el contenido del URL solicitado (sin redirecciones por User-Agent), patrón aceptado por Google.
- Reestructura: `app/layout.tsx` + `app/page.tsx` → `app/[locale]/layout.tsx` + `app/[locale]/page.tsx`. El layout raíz mínimo (`app/layout.tsx`) solo re-exporta children si next-intl lo requiere; íconos (`icon.png`, `apple-icon.png`, `favicon.ico`) permanecen en `app/`.
- **SSG:** `generateStaticParams()` devuelve ambos locales y `setRequestLocale(locale)` en layout y page para render estático de las dos versiones.

### 2. Mensajes de traducción

- `messages/es.json` y `messages/en.json`, organizados por namespace = componente: `Header`, `Hero`, `Stats`, `Clients`, `Features`, `Services`, `Certifications`, `Talleres`, `About`, `Coverage`, `Testimonials`, `CTA`, `Footer`, `Metadata`.
- Incluyen **todo** el texto visible al usuario: headings, párrafos, CTAs, labels y placeholders de formularios, `alt` de imágenes, `aria-label`s, nombres de navegación.
- Arrays estructurados (servicios, stats, testimonios, nav items) se modelan como objetos en el JSON y se consumen con `useTranslations`/`getTranslations`; los datos no-textuales (íconos, imágenes, hrefs) permanecen en los componentes.
- TypeScript: augmentación de tipos de next-intl con el shape de `es.json` para autocompletado y detección de claves faltantes en compile time.

### 3. Calidad de traducción (criterio editorial)

- **EN nativo de industria freight/logistics EE.UU.:** "cross-border freight", "FTL / full truckload", "24/7 GPS tracking", "company-owned fleet", "B1-certified drivers", "door-to-door", "Get a quote", "Drive with us" / "Apply now". Tono: directo, confiable, humano — mismo carácter de marca, no traducción palabra a palabra. Números/unidades en formato US cuando aplique.
- **ES:** se conserva el copy actual (voz MX validada); pasada de afinación ligera de español latinoamericano — consistencia de tuteo, naturalidad, sin calcos — solo donde mejore, sin reescrituras gratuitas.
- Los IDs de anclas (`#servicios`, `#cotizacion`, `#postulate`, etc.) **no cambian** entre idiomas: son fragmentos sin peso SEO y evitan romper enlaces existentes.

### 4. Switcher de idioma (UI)

- Componente `components/language-switcher.tsx` (client): toggle ES/EN en el header, desktop y menú móvil.
- Diseño acorde a la estética actual: texto `ES | EN` con el idioma activo resaltado (ámbar/yellow-accent), área táctil ≥44px, `aria-label` localizado, estados para header transparente (sobre video) y sólido (scrolled).
- Cambio de idioma = `router.replace(pathname, { locale, scroll: false })` de next-intl al mismo pathname en el otro locale; la persistencia de preferencia vía cookie `NEXT_LOCALE` la maneja el middleware. `scroll: false` mantiene la posición de lectura al alternar.

### 5. SEO (requisito central)

- `generateMetadata({ params })` por locale en `app/[locale]/layout.tsx`:
  - `title` y `description` localizados y optimizados por mercado (keywords: "transporte de carga México Estados Unidos" / "cross-border trucking Mexico USA", "freight carrier Laredo", etc.).
  - `metadataBase` + `alternates.canonical` por locale.
  - `alternates.languages`: hreflang `es-MX` → `/`, `en-US` → `/en`, `x-default` → `/`.
  - Open Graph y Twitter Card localizados: `og:locale` (`es_MX`/`en_US`), `og:locale:alternate`, imagen OG (foto real de flota existente en `public/fleet/`).
- `app/sitemap.ts`: ambas URLs con `alternates.languages` (Next genera los `xhtml:link`).
- `app/robots.ts`: allow all + referencia al sitemap.
- **JSON-LD** localizado en el layout: `Organization` (nombre, logo, contacto, `areaServed: MX, US`) + `Service` (transporte de carga transfronterizo). Refuerza entidad para ambos mercados sin depender de ccTLD.
- `<html lang>` dinámico por locale.
- Verificación post-implementación: view-source de `/` y `/en` con hreflang recíprocos, canonical correcto y contenido estático (no client-only).

### 6. Manejo de errores / edge cases

- Locale inválido en URL (`/fr`) → `notFound()` en el layout.
- Claves de mensaje faltantes → error en build (config `onError` estricta de next-intl) para que nunca se publique texto a medias.
- `app/not-found.tsx` mínimo bilingüe (requerido al usar `notFound()`).

### 7. Testing / verificación

No hay suite de tests en el repo; la verificación es de build + comportamiento:

1. `pnpm build` sin errores y con ambas rutas prerenderizadas como estáticas (`/`, `/en`).
2. Preview: navegación, anclas, formularios y switcher funcionan en ambos idiomas; header transparente/sólido correcto.
3. HTML fuente de ambas rutas contiene hreflang, canonical, JSON-LD y copy correcto.
4. Sin regresiones visuales (el layout tolera textos EN más cortos/largos — revisar hero, stats, botones).

## Plan de fases (resumen)

1. **Infraestructura:** next-intl, routing, middleware, reestructura `app/[locale]/`, layout con SSG. Página sigue 100% en español vía `messages/es.json` (extracción incremental por sección).
2. **Extracción + traducción por sección:** mover copy de cada componente a `es.json`, escribir EN nativo en `en.json`, afinar ES donde aplique. Commits por grupos de secciones.
3. **Switcher de idioma** en header (desktop + móvil).
4. **SEO:** metadata localizada, hreflang, sitemap, robots, JSON-LD, OG.
5. **Verificación integral** (build, preview en ambos idiomas, revisión de fuente HTML).

## Fuera de alcance

- Traducción de PRODUCT.md/DESIGN.md o documentación interna.
- Localización del video del hero (la narración permanece en español; es material real de la empresa).
- Backend de formularios (hoy no envían a ningún endpoint; se localizan labels/placeholders únicamente).
- Más idiomas o dominios por país.

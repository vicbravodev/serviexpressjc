# SEO Overhaul ServiExpress JC — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Convertir la landing one-page en arquitectura multi-página bilingüe (ES raíz / EN `/en`) con higiene técnica SEO completa, JSON-LD por página y Core Web Vitals móviles sanos, sin tocar el diseño visual.

**Architecture:** Next.js 15.5.9 App Router + next-intl v4 ya con segmento `[locale]` (`localePrefix: "as-needed"`, ES sin prefijo). Se agregan `pathnames` localizados a next-intl, contenido largo en módulos TS tipados (`content/`), un template server-component de página de servicio/ruta que reusa Header/Footer/diseño actual, helper central de metadata (`lib/seo.ts`) y componente JSON-LD.

**Tech Stack:** Next 15 App Router, next-intl 4 (pathnames), Tailwind 4, TypeScript.

## Global Constraints

- Dominio canónico: `https://serviexpressjc.com.mx` (sin www) — ya en `lib/site.ts:SITE_URL`.
- No inventar datos: usar `lib/site.ts` (FOUNDING_YEAR 2005, teléfonos, dirección Apodaca, redes). Marcar `TODO:` donde falte (geo exacto, horarios).
- Titles ≤ 60 chars; descriptions 140–160 con CTA + señal local ("Base en Monterrey, cruce por Laredo").
- ES mexicano natural / EN B2B nativo; 600–1,000 palabras por página nueva.
- Mantener diseño visual (sala de control): las páginas nuevas reusan tokens/clases existentes.
- Commit atómico por fase, en esta rama (`claude/serviexpress-seo-overhaul-ca495c`), PR a main al final (regla: preview antes de prod).

## Estado ya cubierto por main (no rehacer)

- i18n por URL con next-intl (`/` ES, `/en` EN) + hreflang es-MX/en-US/x-default en layout.
- `app/robots.ts`, `app/sitemap.ts` (solo home — expandir), Organization JSON-LD en layout.
- next/font (Geist) con `display: swap`; footer con iconos sociales `aria-label` + `rel="noopener noreferrer"` (la premisa "URL cruda" del spec ya no aplica).
- 404 básica en `app/[locale]/not-found.tsx` (mejorar con enlaces a servicios).

### Task 1 — FASE 1: higiene técnica

**Files:** Modify `next.config.mjs` (redirect www→apex 301). Create `lib/seo.ts` (helper `pageMetadata`). Modify `messages/es.json`/`en.json` (descriptions 140–160 con señal local).

- [ ] Redirect host www.serviexpressjc.com.mx → serviexpressjc.com.mx (`redirects()` con `has: [{type: "host", value: "www.serviexpressjc.com.mx"}]`, permanent).
- [ ] `lib/seo.ts`: `pageMetadata({locale, href, title, description, ogImage?})` → canonical absoluto + `alternates.languages` con `getPathname` (soporta pathnames localizados) + OG/Twitter.
- [ ] Ajustar descriptions de Metadata (home) a 140–160 chars con "Base en Monterrey, cruce por Laredo" + CTA.
- [ ] `pnpm build` OK → commit `feat(seo): redirect 301 www→apex + helper central de metadata`.

### Task 2 — FASE 2: arquitectura multi-página (mayor impacto)

**Files:** Modify `i18n/routing.ts` (pathnames). Create `content/site-pages.ts` (tipos + contenido ES/EN de 6 servicios + 4 rutas). Create `components/seo/breadcrumbs.tsx`, `components/seo/faq-block.tsx`, `components/seo/related-links.tsx`, `components/seo/content-page.tsx` (template). Create `app/[locale]/{transporte-nacional,transporte-internacional-mexico-usa,transporte-de-acero,carga-sobredimensionada,caja-seca-53,plataforma}/page.tsx` y `app/[locale]/rutas/{monterrey-laredo,monterrey-houston,monterrey-dallas,monterrey-cdmx}/page.tsx`. Modify `app/sitemap.ts` (todas las rutas × 2 idiomas con alternates). Modify `messages/*.json` (Hero H1 nuevo + slogan como subtítulo, namespace `ContentPage` para chrome). Modify `components/hero-section.tsx` (slogan visual), `components/services-section.tsx`, `components/coverage-section.tsx` o home, `components/footer.tsx` (enlaces internos descriptivos a las 10 páginas).

Slugs EN localizados: `/mexico-domestic-trucking`, `/cross-border-trucking-mexico-usa`, `/steel-hauling-mexico-usa`, `/oversize-load-transport`, `/dry-van-53`, `/flatbed-trucking`, `/routes/monterrey-laredo|houston|dallas|mexico-city`.

- [ ] `routing.pathnames` con mapa interno (slug ES) → ES/EN.
- [ ] Contenido tipado por página: metaTitle, metaDescription, h1, kicker, intro, sections (h2 + párrafos + bullets), faqs (3–5), related (hrefs internos). 600–1,000 palabras por página/idioma. Datos duros solo de `lib/site.ts` (2005, B1, Laredo, GPS 24/7, Ternium/Serviacero como clientes ya citados en el sitio); distancias/tiempos de ruta con rangos típicos verificables (km reales de carretera).
- [ ] Template `ContentPage`: Header + breadcrumbs + H1 + prose + FAQ + CTA cotización (link a `/#cotizacion` locale-aware) + related links + Footer, todo server-rendered con estilos existentes.
- [ ] Home: H1 nuevo "Transporte de carga México–Estados Unidos con flota propia" (EN: "Mexico–U.S. cross-border trucking with our own fleet"); slogan actual pasa a línea visual sobre el subtítulo.
- [ ] Home enlaza las 10 páginas con anchor text descriptivo (services cards → páginas de servicio; bloque de rutas; footer services → links).
- [ ] Sitemap con 11 URLs × 2 idiomas + alternates + lastModified.
- [ ] Verificar language switcher con pathnames localizados.
- [ ] `pnpm build` OK → commits `feat(seo): rutas localizadas + contenido de 6 páginas de servicio y 4 de rutas` / `feat(seo): home como hub (H1 keyword, slogan subtítulo, enlaces internos)`.

### Task 3 — FASE 3: i18n/hreflang (verificación)

Ya implementado por Task 1–2 (getPathname genera hreflang recíproco por página). Solo verificar en HTML servido (`curl` de `/transporte-de-acero` y `/en/steel-hauling-mexico-usa`). Commit solo si hay fixes.

### Task 4 — FASE 4: JSON-LD

**Files:** Create `components/seo/json-ld.tsx`. Modify `app/[locale]/layout.tsx` (usar componente), `app/[locale]/page.tsx` (LocalBusiness), `components/seo/content-page.tsx` (Service/FAQPage/BreadcrumbList).

- [ ] `<JsonLd data={...}/>` con escape `</`.
- [ ] Home: LocalBusiness (name, address Apodaca, telephone MX/US, areaServed MX+TX, `TODO:` geo/horarios si faltan).
- [ ] Service + FAQPage + BreadcrumbList en template (rutas usan Service con serviceType de ruta).
- [ ] Validar shape contra schema.org; `pnpm build` → commit `feat(seo): JSON-LD LocalBusiness, Service, FAQPage y BreadcrumbList`.

### Task 5 — FASE 5: Core Web Vitals

**Files:** Modify `components/hero-section.tsx` (poster next/image priority + video `preload="none"` diferido con IntersectionObserver + reduced-motion), `components/stats-section.tsx` (valor final en SSR, animación solo como mejora), `components/fleet-image.tsx` (→ next/image con sizes), `next.config.mjs` (quitar `images.unoptimized` para AVIF/WebP en Vercel).

- [ ] Video: quitar `autoPlay`, `preload="none"`, cargar/reproducir cuando el hero es visible y sin `prefers-reduced-motion`/saveData; poster como `next/image` `priority` detrás del video.
- [ ] Stats: `useState(target)` inicial (HTML SSR = número real); animar 0→target solo al entrar en viewport sin reduced-motion.
- [ ] FleetImage con `next/image` + `sizes` correcto + lazy (mantener fallback onError).
- [ ] `pnpm build` y comparar tamaños/First Load JS vs línea base → commit `perf(seo): LCP sin video, stats SSR con valor real, next/image optimizado`.

### Task 6 — FASE 6: detalles finales

**Files:** Modify `app/[locale]/not-found.tsx` (enlaces a servicios principales). Create `SEO-CHECKLIST-POSTDEPLOY.md`. Verificar alts.

- [ ] 404 con enlaces a 4–6 páginas clave.
- [ ] Checklist post-deploy (GSC www+apex, GBP Apodaca, Bing Places, CANACAR/T21/TyT, evaluar `.com`, monitoreo GSC 2–4 semanas, env vars).
- [ ] Commit `feat(seo): 404 con rutas principales + checklist post-deploy`.
- [ ] Entregable final en respuesta: tabla keyword → URL → title → H1 (ES/EN) + lista consolidada de `TODO:`.

import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  // Español siempre por defecto: no autodetectar el idioma del navegador.
  // El visitante puede cambiar a inglés con el switcher o entrando a /en.
  localeDetection: false,
  // Slugs localizados: el nombre interno (y de carpeta en app/[locale]/) es el
  // slug en español; el slug en inglés adapta la keyword al mercado US.
  pathnames: {
    "/": "/",
    "/transporte-nacional": {
      es: "/transporte-nacional",
      en: "/mexico-domestic-trucking",
    },
    "/transporte-internacional-mexico-usa": {
      es: "/transporte-internacional-mexico-usa",
      en: "/cross-border-trucking-mexico-usa",
    },
    "/transporte-de-acero": {
      es: "/transporte-de-acero",
      en: "/steel-hauling-mexico-usa",
    },
    "/carga-sobredimensionada": {
      es: "/carga-sobredimensionada",
      en: "/oversize-load-transport",
    },
    "/caja-seca-53": {
      es: "/caja-seca-53",
      en: "/dry-van-53",
    },
    "/plataforma": {
      es: "/plataforma",
      en: "/flatbed-trucking",
    },
    "/rutas/monterrey-laredo": {
      es: "/rutas/monterrey-laredo",
      en: "/routes/monterrey-laredo",
    },
    "/rutas/monterrey-houston": {
      es: "/rutas/monterrey-houston",
      en: "/routes/monterrey-houston",
    },
    "/rutas/monterrey-dallas": {
      es: "/rutas/monterrey-dallas",
      en: "/routes/monterrey-dallas",
    },
    "/rutas/monterrey-cdmx": {
      es: "/rutas/monterrey-cdmx",
      en: "/routes/monterrey-mexico-city",
    },
  },
})

/** Rutas internas de páginas de contenido (claves de pathnames, sin la home). */
export const CONTENT_HREFS = [
  "/transporte-nacional",
  "/transporte-internacional-mexico-usa",
  "/transporte-de-acero",
  "/carga-sobredimensionada",
  "/caja-seca-53",
  "/plataforma",
  "/rutas/monterrey-laredo",
  "/rutas/monterrey-houston",
  "/rutas/monterrey-dallas",
  "/rutas/monterrey-cdmx",
] as const

export type ContentHref = (typeof CONTENT_HREFS)[number]

import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  // Español siempre por defecto: no autodetectar el idioma del navegador.
  // El visitante puede cambiar a inglés con el switcher o entrando a /en.
  localeDetection: false,
})

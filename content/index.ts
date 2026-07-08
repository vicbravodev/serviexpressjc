import type { ContentHref } from "@/i18n/routing"
import type { LocalizedPage, PageContent } from "./types"
import { SERVICE_PAGES } from "./services"
import { ROUTE_PAGES } from "./routes"

export type { PageContent, LocalizedPage, Section, Faq } from "./types"

export const CONTENT_PAGES: Record<string, LocalizedPage> = {
  ...SERVICE_PAGES,
  ...ROUTE_PAGES,
}

export function getPageContent(href: ContentHref, locale: string): PageContent {
  const page = CONTENT_PAGES[href]
  if (!page) throw new Error(`No hay contenido para ${href}`)
  return locale === "en" ? page.en : page.es
}

/** Hrefs de servicios (para hub de la home y footer). */
export const SERVICE_HREFS = Object.keys(SERVICE_PAGES) as ContentHref[]
/** Hrefs de rutas (para hub de la home). */
export const ROUTE_HREFS = Object.keys(ROUTE_PAGES) as ContentHref[]

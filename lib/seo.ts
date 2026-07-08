import type { Metadata } from "next"
import { getPathname } from "@/i18n/navigation"
import { SITE_URL } from "@/lib/site"

/** Href interno aceptado por next-intl (clave de routing.pathnames). */
type IntlHref = Parameters<typeof getPathname>[0]["href"]

/** URL absoluta canónica (sin www, https) de una página en un idioma. */
export function absoluteUrl(locale: "es" | "en", href: IntlHref): string {
  const path = getPathname({ locale, href })
  return `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL
}

type PageMetadataInput = {
  locale: string
  /** Ruta interna (clave de pathnames), p.ej. "/transporte-de-acero". */
  href: IntlHref
  /** ≤ 60 caracteres. */
  title: string
  /** 140–160 caracteres, con CTA y señal local. */
  description: string
  ogImage?: string
  ogImageAlt?: string
}

/**
 * Patrón único de metadata por página: canonical absoluto, hreflang recíproco
 * es-MX / en-US + x-default (siempre el español, versión raíz) y OG/Twitter.
 */
export function pageMetadata({
  locale,
  href,
  title,
  description,
  ogImage = "/fleet/flota-patio.jpg",
  ogImageAlt = "Flota propia de ServiExpress JC",
}: PageMetadataInput): Metadata {
  const l = locale === "es" ? "es" : "en"
  const canonical = absoluteUrl(l, href)
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "es-MX": absoluteUrl("es", href),
        "en-US": absoluteUrl("en", href),
        "x-default": absoluteUrl("es", href),
      },
    },
    openGraph: {
      type: "website",
      siteName: "ServiExpress JC",
      url: canonical,
      title,
      description,
      locale: l === "es" ? "es_MX" : "en_US",
      alternateLocale: l === "es" ? "en_US" : "es_MX",
      images: [{ url: ogImage, width: 1600, height: 829, alt: ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

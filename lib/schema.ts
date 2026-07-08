import type { ContentHref } from "@/i18n/routing"
import type { Faq, PageContent } from "@/content"
import { absoluteUrl } from "@/lib/seo"
import {
  SITE_URL,
  FOUNDING_YEAR,
  CONTACT_EMAIL,
  CONTACT_PHONE_MX,
  CONTACT_PHONE_US,
  ADDRESS,
  SOCIAL_LINKS,
} from "@/lib/site"

/**
 * Schemas JSON-LD del sitio. Solo datos reales de lib/site.ts; los campos sin
 * dato confirmado (geo exacto, código postal, horario de oficina) se omiten
 * deliberadamente — ver SEO-CHECKLIST-POSTDEPLOY.md.
 */

const AREA_MEXICO = { "@type": "Country", name: "Mexico" }
const AREA_USA = { "@type": "Country", name: "United States" }
const AREA_TEXAS = { "@type": "State", name: "Texas", containedInPlace: AREA_USA }

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: ADDRESS.street,
  addressLocality: ADDRESS.locality,
  addressRegion: ADDRESS.region,
  addressCountry: ADDRESS.country,
}

const contactPoints = [
  {
    "@type": "ContactPoint",
    telephone: CONTACT_PHONE_MX,
    contactType: "customer service",
    areaServed: "MX",
    availableLanguage: ["Spanish", "English"],
  },
  {
    "@type": "ContactPoint",
    telephone: CONTACT_PHONE_US,
    contactType: "customer service",
    areaServed: "US",
    availableLanguage: ["English", "Spanish"],
  },
]

export function organizationSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "ServiExpress JC",
    legalName: "Serviexpress JC LLC",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-white-bg.png`,
    description,
    foundingDate: String(FOUNDING_YEAR),
    email: CONTACT_EMAIL,
    address: postalAddress,
    contactPoint: contactPoints,
    areaServed: [AREA_MEXICO, AREA_USA],
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook, SOCIAL_LINKS.linkedin],
  }
}

/**
 * LocalBusiness para la home. schema.org no tiene subtipo de autotransporte
 * de carga (MovingCompany es mudanzas), así que se usa LocalBusiness genérico
 * ligado a la Organization.
 */
export function localBusinessSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: "ServiExpress JC",
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    description,
    url: SITE_URL,
    image: `${SITE_URL}/fleet/flota-patio.jpg`,
    telephone: CONTACT_PHONE_MX,
    email: CONTACT_EMAIL,
    address: postalAddress,
    areaServed: [AREA_MEXICO, AREA_TEXAS],
    foundingDate: String(FOUNDING_YEAR),
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook, SOCIAL_LINKS.linkedin],
  }
}

export function serviceSchema(locale: "es" | "en", href: ContentHref, c: PageContent) {
  // Páginas puramente nacionales solo sirven México.
  const domesticOnly = href === "/transporte-nacional" || href === "/rutas/monterrey-cdmx"
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: c.h1,
    serviceType: c.serviceType,
    description: c.metaDescription,
    url: absoluteUrl(locale, href),
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ServiExpress JC",
      url: SITE_URL,
    },
    areaServed: domesticOnly ? [AREA_MEXICO] : [AREA_MEXICO, AREA_USA],
  }
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}

export function breadcrumbSchema(locale: "es" | "en", href: ContentHref, homeName: string, pageName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeName, item: absoluteUrl(locale, "/") },
      { "@type": "ListItem", position: 2, name: pageName, item: absoluteUrl(locale, href) },
    ],
  }
}

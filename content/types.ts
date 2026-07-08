import type { ContentHref } from "@/i18n/routing"

export type Faq = { q: string; a: string }

export type Subsection = { h3: string; paragraphs: string[]; bullets?: string[] }

export type Section = {
  h2: string
  paragraphs: string[]
  bullets?: string[]
  subsections?: Subsection[]
}

export type PageContent = {
  /** Nombre corto para breadcrumbs y enlaces internos. */
  breadcrumb: string
  /** Etiqueta mono corta sobre el H1 (lenguaje sala de control). */
  kicker: string
  /** ≤ 60 caracteres. */
  metaTitle: string
  /** 140–160 caracteres, con CTA y señal local. */
  metaDescription: string
  h1: string
  intro: string[]
  image: { src: string; alt: string }
  sections: Section[]
  faqs: Faq[]
  related: { href: ContentHref; label: string }[]
  /** serviceType para el JSON-LD de Service. */
  serviceType: string
}

export type LocalizedPage = { es: PageContent; en: PageContent }

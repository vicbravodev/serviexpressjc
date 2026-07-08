import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import type { ContentHref } from "@/i18n/routing"
import { getPageContent } from "@/content"
import { pageMetadata } from "@/lib/seo"
import { ContentPage } from "@/components/seo/content-page"

type Props = { params: Promise<{ locale: string }> }

/**
 * Fábrica de rutas de contenido: cada app/[locale]/<slug>/page.tsx solo
 * declara su href interno y re-exporta generateMetadata + el componente.
 */
export function createContentRoute(href: ContentHref) {
  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const c = getPageContent(href, locale)
    return pageMetadata({
      locale,
      href,
      title: c.metaTitle,
      description: c.metaDescription,
      ogImage: c.image.src,
      ogImageAlt: c.image.alt,
    })
  }

  async function Page({ params }: Props) {
    const { locale } = await params
    setRequestLocale(locale)
    return <ContentPage href={href} locale={locale} />
  }

  return { generateMetadata, Page }
}

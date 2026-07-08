import type { MetadataRoute } from "next"
import { CONTENT_HREFS } from "@/i18n/routing"
import { absoluteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs = ["/", ...CONTENT_HREFS] as const
  const lastModified = new Date()

  return hrefs.flatMap((href) => {
    const es = absoluteUrl("es", href)
    const en = absoluteUrl("en", href)
    const languages = { "es-MX": es, "en-US": en, "x-default": es }
    const priority = href === "/" ? 1 : href.startsWith("/rutas") ? 0.7 : 0.8
    return [
      { url: es, lastModified, changeFrequency: "monthly" as const, priority, alternates: { languages } },
      { url: en, lastModified, changeFrequency: "monthly" as const, priority, alternates: { languages } },
    ]
  })
}

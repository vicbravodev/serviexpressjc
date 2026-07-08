import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { ContentHref } from "@/i18n/routing"
import { getPageContent } from "@/content"

const suggestedHrefs: ContentHref[] = [
  "/transporte-nacional",
  "/transporte-internacional-mexico-usa",
  "/transporte-de-acero",
  "/carga-sobredimensionada",
  "/caja-seca-53",
  "/rutas/monterrey-laredo",
]

export default function NotFoundPage() {
  const t = useTranslations("NotFound")
  const locale = useLocale()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-bold">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("description")}</p>
      </div>
      <Link href="/" className="text-primary underline underline-offset-4">
        {t("back")}
      </Link>
      <section className="w-full max-w-2xl">
        <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("explore")}</h2>
        <ul className="mt-4 grid gap-3 text-left sm:grid-cols-2">
          {suggestedHrefs.map((href) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-yellow-accent/60"
              >
                <span>{getPageContent(href, locale).breadcrumb}</span>
                <ArrowRight size={14} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

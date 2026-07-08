import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { ChevronRight } from "lucide-react"

type Crumb = { label: string }

/** Migas de pan: Inicio → página actual. Server component, texto siempre en HTML. */
export async function Breadcrumbs({ locale, current }: { locale: string; current: Crumb }) {
  const t = await getTranslations({ locale, namespace: "ContentPage" })
  return (
    <nav aria-label={t("breadcrumbsAria")} className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
      <Link href="/" className="transition-colors hover:text-white">
        {t("home")}
      </Link>
      <ChevronRight size={12} aria-hidden="true" className="text-white/40" />
      <span aria-current="page" className="text-yellow-accent-bright">
        {current.label}
      </span>
    </nav>
  )
}

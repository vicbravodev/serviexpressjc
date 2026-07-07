"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { trackEvent } from "@/lib/analytics"

export function LanguageSwitcher({ solid }: { solid: boolean }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("LanguageSwitcher")

  const switchTo = (next: "es" | "en") => {
    if (next === locale) return
    trackEvent("language_switch", { to: next, from: locale })
    router.replace(pathname, { locale: next, scroll: false })
  }

  const base = "min-h-11 min-w-11 px-2 font-mono text-sm font-medium uppercase tracking-wider transition-colors"
  const active = "text-yellow-accent"
  const idle = solid ? "text-foreground/60 hover:text-foreground" : "text-white/60 hover:text-white"

  return (
    <div className="flex items-center" role="group" aria-label={t("label")}>
      <button
        type="button"
        onClick={() => switchTo("es")}
        aria-pressed={locale === "es"}
        aria-label={t("switchToEs")}
        className={`${base} ${locale === "es" ? active : idle}`}
      >
        ES
      </button>
      <span aria-hidden="true" className={solid ? "text-foreground/30" : "text-white/30"}>|</span>
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        aria-label={t("switchToEn")}
        className={`${base} ${locale === "en" ? active : idle}`}
      >
        EN
      </button>
    </div>
  )
}

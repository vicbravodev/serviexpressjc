import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export default function NotFoundPage() {
  const t = useTranslations("NotFound")
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">404</p>
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <Link href="/" className="text-primary underline underline-offset-4">
        {t("back")}
      </Link>
    </main>
  )
}

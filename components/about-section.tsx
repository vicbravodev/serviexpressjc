import Image from "next/image"
import { Camera } from "lucide-react"
import { useTranslations } from "next-intl"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"
import { yearsInService } from "@/lib/site"

/**
 * TODO(cliente): foto real del equipo (horizontal, ≥2400px de ancho, gente de
 * ServiExpress JC, no stock). Al recibirla: guardarla en public/team/ y poner la
 * ruta aquí, p. ej. "/team/equipo.jpg". Mientras sea null, el slot solo se ve
 * en local y en Preview de Vercel; en producción no se renderiza.
 */
const TEAM_PHOTO: string | null = null
const SHOW_PENDING_SLOT = process.env.VERCEL_ENV !== "production"

export function AboutSection() {
  const t = useTranslations("About")

  return (
    <section id="quienes-somos" className="py-24">
      <div className="container mx-auto px-4">
        {/* Encabezado y misión/visión en una sola fila: el bloque se sostiene con o
            sin foto (en producción, mientras no llegue la foto, no queda un hueco). */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal className="lg:col-span-6">
            <h2 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">{t("title")}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {t("subtitle", { years: yearsInService() })}
            </p>
          </Reveal>

          <RevealGroup className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:col-span-6">
            <RevealChild className="border-t border-foreground/15 pt-4">
              <h3 className="font-semibold">{t("storyLabel1")}</h3>
              <p className="mt-2 leading-relaxed text-foreground/90">{t("story1")}</p>
            </RevealChild>
            <RevealChild className="border-t border-foreground/15 pt-4">
              <h3 className="font-semibold">{t("storyLabel2")}</h3>
              <p className="mt-2 leading-relaxed text-foreground/90">{t("story2")}</p>
            </RevealChild>
          </RevealGroup>
        </div>

        {/* Foto de equipo a ancho completo: la prueba de "gente real" */}
        {TEAM_PHOTO ? (
          <Reveal className="mt-12 overflow-hidden rounded-2xl md:mt-16">
            <Image
              src={TEAM_PHOTO}
              alt={t("teamPhotoAlt")}
              width={2400}
              height={1029}
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="aspect-[4/3] w-full object-cover md:aspect-[21/9]"
            />
          </Reveal>
        ) : (
          SHOW_PENDING_SLOT && (
            <div
              data-pending="team-photo"
              className="mt-12 flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-foreground/20 bg-muted/50 px-6 text-center md:mt-16 md:aspect-[21/9]"
            >
              <Camera aria-hidden className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm font-semibold">Pendiente: foto del equipo</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                La pasa el cliente. Horizontal, mínimo 2400 px de ancho, sin stock. Solo visible fuera de producción.
              </p>
            </div>
          )
        )}
      </div>
    </section>
  )
}

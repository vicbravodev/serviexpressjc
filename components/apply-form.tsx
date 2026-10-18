"use client"

import { useRef, useState, type FormEvent } from "react"
import { useLocale, useTranslations } from "next-intl"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WHATSAPP_PHONE_JOBS, whatsappUrl } from "@/lib/site"
import { submitApplication } from "@/lib/actions/leads"
import { trackEvent } from "@/lib/analytics"

const POSITIONS = ["b1", "national", "mechanic", "admin"] as const
const EXPERIENCES = ["lt2", "2to5", "5to10", "gt10"] as const

type Position = (typeof POSITIONS)[number]
type Experience = (typeof EXPERIENCES)[number]
type Field = "name" | "phone" | "position" | "experience"

/** Ids de los controles en orden de aparición: el primero con error recibe el foco. */
const FIELD_IDS: Record<Field, string> = {
  name: "apply-name",
  phone: "apply-phone",
  position: "apply-position",
  experience: "apply-experience",
}

function FieldError({ field, show, message }: { field: Field; show: boolean; message: string }) {
  if (!show) return null
  return (
    <p id={`${FIELD_IDS[field]}-error`} className="text-sm font-medium text-destructive">
      {message}
    </p>
  )
}

export function ApplyForm() {
  const t = useTranslations("CTA.apply")
  const locale = useLocale()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [position, setPosition] = useState<Position | "">("")
  const [experience, setExperience] = useState<Experience | "">("")
  // Los errores aparecen solo después del primer intento de envío, no mientras escribe.
  const [tried, setTried] = useState(false)

  // Mismas reglas que hasContact() en lib/site.ts, separadas por campo para decir qué falta.
  const errors: Record<Field, boolean> = {
    name: name.trim().length < 2,
    phone: phone.replace(/\D/g, "").length < 8,
    position: position === "",
    experience: experience === "",
  }
  const firstError = (Object.keys(FIELD_IDS) as Field[]).find((f) => errors[f])
  const show = (f: Field) => tried && errors[f]
  const invalidProps = (f: Field) =>
    show(f) ? { "aria-invalid": true, "aria-describedby": `${FIELD_IDS[f]}-error` } : {}

  // Evita filas duplicadas si el visitante reenvía los mismos datos (WhatsApp sí se reabre).
  const lastSubmitted = useRef("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (firstError) {
      setTried(true)
      document.getElementById(FIELD_IDS[firstError])?.focus()
      return
    }
    if (position === "" || experience === "") return // ya cubierto por firstError; estrecha los tipos

    trackEvent("whatsapp_click", { source: "apply" })

    // Persistir + CAPI (no bloquea el window.open de abajo). El lead solo cuenta
    // la primera vez que se envían estos datos: un reenvío no infla conversiones.
    const signature = JSON.stringify([name.trim(), phone.trim(), position, experience])
    if (lastSubmitted.current !== signature) {
      lastSubmitted.current = signature
      // Analytics: lead de postulación (GA4 + Vercel + Meta Pixel).
      // metaEventId deduplica el pixel contra la Conversions API server-side.
      const metaEventId = trackEvent("generate_lead", { lead_type: "job", position })
      void submitApplication({
        name: name.trim(),
        phone: phone.trim(),
        position,
        experience,
        locale,
        metaEventId,
      })
        // Si no se guardó, libera la firma para que un reintento sí persista.
        .then((r) => { if (!r.ok) lastSubmitted.current = "" })
        .catch(() => { lastSubmitted.current = "" })
    }

    const message = t("whatsappMessage", {
      name: name.trim(),
      phone: phone.trim(),
      position: t(`positions.${position}`),
      experience: t(`experiences.${experience}`),
    })
    window.open(whatsappUrl(message, WHATSAPP_PHONE_JOBS), "_blank", "noopener,noreferrer")
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="apply-name">{t("name")}</Label>
          <Input
            id="apply-name"
            name="nombre"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePh")}
            className="h-11"
            {...invalidProps("name")}
          />
          <FieldError field="name" show={show("name")} message={t("errors.name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apply-phone">{t("phone")}</Label>
          <Input
            id="apply-phone"
            name="telefono"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("phonePh")}
            className="h-11"
            {...invalidProps("phone")}
          />
          <FieldError field="phone" show={show("phone")} message={t("errors.phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apply-position">{t("position")}</Label>
          <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
            <SelectTrigger
              id="apply-position"
              className="w-full data-[size=default]:h-11"
              {...invalidProps("position")}
            >
              <SelectValue placeholder={t("positionPh")} />
            </SelectTrigger>
            <SelectContent>
              {POSITIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {t(`positions.${p}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError field="position" show={show("position")} message={t("errors.position")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apply-experience">{t("experience")}</Label>
          <Select value={experience} onValueChange={(v) => setExperience(v as Experience)}>
            <SelectTrigger
              id="apply-experience"
              className="w-full data-[size=default]:h-11"
              {...invalidProps("experience")}
            >
              <SelectValue placeholder={t("experiencePh")} />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCES.map((x) => (
                <SelectItem key={x} value={x}>
                  {t(`experiences.${x}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError field="experience" show={show("experience")} message={t("errors.experience")} />
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{t("cvNote")}</p>
        <Button type="submit" size="lg" className="h-12 w-full shrink-0 bg-secondary hover:bg-secondary/90 sm:w-auto">
          <MessageCircle aria-hidden className="mr-2 h-5 w-5" />
          {t("submit")}
        </Button>
      </div>
    </form>
  )
}

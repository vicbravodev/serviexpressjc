"use client"

import { useState, type FormEvent } from "react"
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

export function ApplyForm() {
  const t = useTranslations("CTA.apply")
  const locale = useLocale()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [position, setPosition] = useState<Position | "">("")
  const [experience, setExperience] = useState<Experience | "">("")

  const isValid = name.trim().length > 1 && phone.trim().length >= 8 && position !== "" && experience !== ""

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim().length <= 1 || phone.trim().length < 8 || position === "" || experience === "") return

    // Analytics: lead de postulación (GA4 + Vercel + Meta Pixel).
    // metaEventId deduplica el pixel contra la Conversions API server-side.
    const metaEventId = trackEvent("generate_lead", { lead_type: "job", position })
    trackEvent("whatsapp_click", { source: "apply" })

    // Persistir + CAPI (no bloquea el window.open de abajo).
    void submitApplication({
      name: name.trim(),
      phone: phone.trim(),
      position,
      experience,
      locale,
      metaEventId,
    })

    const message = t("whatsappMessage", {
      name: name.trim(),
      phone: phone.trim(),
      position: t(`positions.${position}`),
      experience: t(`experiences.${experience}`),
    })
    window.open(whatsappUrl(message, WHATSAPP_PHONE_JOBS), "_blank", "noopener,noreferrer")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="apply-position">{t("position")}</Label>
        <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
          <SelectTrigger id="apply-position" className="w-full data-[size=default]:h-11">
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="apply-experience">{t("experience")}</Label>
        <Select value={experience} onValueChange={(v) => setExperience(v as Experience)}>
          <SelectTrigger id="apply-experience" className="w-full data-[size=default]:h-11">
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
      </div>
      <p className="text-sm text-muted-foreground">{t("cvNote")}</p>
      <Button type="submit" size="lg" disabled={!isValid} className="h-12 w-full bg-secondary hover:bg-secondary/90">
        <MessageCircle aria-hidden className="mr-2 h-5 w-5" />
        {t("submit")}
      </Button>
    </form>
  )
}

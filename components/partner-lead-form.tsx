"use client"

import { useState, type FormEvent } from "react"
import { useLocale, useTranslations } from "next-intl"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WHATSAPP_PHONE_JOBS, whatsappUrl } from "@/lib/site"
import { submitPartnerLead } from "@/lib/actions/leads"
import { trackEvent, trackGoogleConversion } from "@/lib/analytics"

const UNIT_TYPES = ["tractor", "plataforma", "ambos"] as const
type UnitType = (typeof UNIT_TYPES)[number]

export function PartnerLeadForm() {
  const t = useTranslations("Partners.form")
  const locale = useLocale()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [unitType, setUnitType] = useState<UnitType | "">("")

  const isValid = name.trim().length > 1 && phone.trim().length >= 8 && unitType !== ""

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim().length <= 1 || phone.trim().length < 8 || unitType === "") return

    // Conversión Google Ads: acción distinta a la del cotizador (ver lib/analytics.ts).
    trackGoogleConversion("conversion_event_partner_lead")
    const metaEventId = trackEvent("generate_lead", { lead_type: "partner", unit_type: unitType })
    trackEvent("whatsapp_click", { source: "partners" })

    void submitPartnerLead({
      name: name.trim(),
      phone: phone.trim(),
      unitType,
      locale,
      metaEventId,
    })

    const message = t("whatsappMessage", {
      name: name.trim(),
      phone: phone.trim(),
      unitType: t(`unitTypes.${unitType}`),
    })
    window.open(whatsappUrl(message, WHATSAPP_PHONE_JOBS), "_blank", "noopener,noreferrer")
  }

  return (
    <Card id="solicitud" className="scroll-mt-28 border-border p-6 shadow-none sm:p-8">
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("kicker")}</span>
      <h2 className="mb-2 mt-2 text-2xl font-bold sm:text-3xl">{t("title")}</h2>
      <p className="mb-6 text-muted-foreground">{t("description")}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="partner-name">{t("name")}</Label>
          <Input
            id="partner-name"
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
          <Label htmlFor="partner-phone">{t("phone")}</Label>
          <Input
            id="partner-phone"
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
          <Label htmlFor="partner-unit">{t("unitType")}</Label>
          <Select value={unitType} onValueChange={(v) => setUnitType(v as UnitType)}>
            <SelectTrigger id="partner-unit" className="w-full data-[size=default]:h-11">
              <SelectValue placeholder={t("unitTypePh")} />
            </SelectTrigger>
            <SelectContent>
              {UNIT_TYPES.map((u) => (
                <SelectItem key={u} value={u}>
                  {t(`unitTypes.${u}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={!isValid}
          className="h-12 w-full bg-[#25D366] text-white hover:bg-[#20BA5A]"
        >
          <MessageCircle aria-hidden className="mr-2 h-5 w-5" />
          {t("submit")}
        </Button>
      </form>
    </Card>
  )
}

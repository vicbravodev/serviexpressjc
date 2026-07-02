"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MX_CITIES, US_CITIES, cityById, estimateQuote, type ServiceType, type UnitType } from "@/lib/quote"
import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY, whatsappUrl } from "@/lib/site"
import { cn } from "@/lib/utils"

const SERVICES: ServiceType[] = ["nacional", "internacional"]
const UNITS: UnitType[] = ["dryvan", "flatbed", "oversize"]

export function QuoteSimulator() {
  const t = useTranslations("Quote")
  const locale = useLocale()
  const [service, setService] = useState<ServiceType>("internacional")
  const [originId, setOriginId] = useState("mty")
  const [destinationId, setDestinationId] = useState("")
  const [unit, setUnit] = useState<UnitType>("dryvan")
  const [tons, setTons] = useState(20)

  const destinations = useMemo(
    () => (service === "internacional" ? US_CITIES : MX_CITIES.filter((c) => c.id !== originId)),
    [service, originId],
  )

  const pickService = (next: ServiceType) => {
    setService(next)
    setDestinationId("")
  }

  const pickOrigin = (next: string) => {
    setOriginId(next)
    if (next === destinationId) setDestinationId("")
  }

  const estimate = useMemo(
    () => (destinationId ? estimateQuote({ service, originId, destinationId, unit, tons }) : null),
    [service, originId, destinationId, unit, tons],
  )

  const currencyFormat = (value: number, currency: "MXN" | "USD") =>
    new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value)

  const range = estimate
    ? `${currencyFormat(estimate.min, estimate.currency)} ${t("rangeJoin")} ${currencyFormat(estimate.max, estimate.currency)} ${estimate.currency}`
    : ""

  const whatsappHref = estimate
    ? whatsappUrl(
        t("whatsappMessage", {
          service: t(`service.${service}`),
          origin: cityById(originId)?.name ?? "",
          destination: cityById(destinationId)?.name ?? "",
          unit: t(`unit.${unit}`),
          tons,
          range,
        }),
      )
    : undefined

  return (
    <div className="space-y-6">
      {/* Servicio */}
      <div className="space-y-2">
        <Label id="quote-service-label">{t("service.label")}</Label>
        <div role="group" aria-labelledby="quote-service-label" className="grid grid-cols-2 gap-2">
          {SERVICES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={service === s}
              onClick={() => pickService(s)}
              className={cn(
                "h-11 rounded-md border text-sm font-medium transition-colors active:scale-[0.97]",
                service === s
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-border bg-background text-foreground hover:border-secondary/50",
              )}
            >
              {t(`service.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Ruta */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quote-origin">{t("origin")}</Label>
          <Select value={originId} onValueChange={pickOrigin}>
            <SelectTrigger id="quote-origin" className="w-full data-[size=default]:h-11">
              <SelectValue placeholder={t("originPh")} />
            </SelectTrigger>
            <SelectContent>
              {MX_CITIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quote-destination">{t("destination")}</Label>
          <Select value={destinationId} onValueChange={setDestinationId}>
            <SelectTrigger id="quote-destination" className="w-full data-[size=default]:h-11">
              <SelectValue placeholder={t("destinationPh")} />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Unidad */}
      <div className="space-y-2">
        <Label id="quote-unit-label">{t("unit.label")}</Label>
        <div role="group" aria-labelledby="quote-unit-label" className="grid grid-cols-3 gap-2">
          {UNITS.map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
              className={cn(
                "h-11 rounded-md border px-2 text-sm font-medium transition-colors active:scale-[0.97]",
                unit === u
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-border bg-background text-foreground hover:border-secondary/50",
              )}
            >
              {t(`unit.${u}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Peso */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="quote-tons">{t("weight")}</Label>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">{t("tons", { tons })}</span>
        </div>
        <Slider
          id="quote-tons"
          value={[tons]}
          onValueChange={([v]) => setTons(v)}
          min={1}
          max={35}
          step={1}
          aria-label={t("weight")}
          className="py-2"
        />
      </div>

      {/* Resultado */}
      <div className="rounded-xl border border-border bg-muted/40 p-6">
        {estimate ? (
          <div className="space-y-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("estimateTitle")}
              </p>
              <p className="mt-1.5 text-2xl font-bold tabular-nums sm:text-3xl">
                {currencyFormat(estimate.min, estimate.currency)}
                <span className="text-muted-foreground">{` ${t("rangeJoin")} `}</span>
                {currencyFormat(estimate.max, estimate.currency)}
                <span className="ml-2 text-base font-semibold text-muted-foreground">{estimate.currency}</span>
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {t("distance", { km: estimate.distanceKm.toLocaleString(locale === "es" ? "es-MX" : "en-US") })}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("estimateNote")}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 bg-secondary hover:bg-secondary/90 sm:flex-1" asChild>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden className="mr-2 h-5 w-5" />
                  {t("refine")}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 bg-transparent" asChild>
                <a href={`tel:${CONTACT_PHONE}`}>
                  <Phone aria-hidden className="mr-2 h-4 w-4" />
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">{t("empty")}</p>
        )}
      </div>
    </div>
  )
}

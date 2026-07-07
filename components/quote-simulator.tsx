"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MX_CITIES, US_CITIES, cityById, routeDistanceKm, type ServiceType, type UnitType } from "@/lib/quote"
import { contactPhone, WHATSAPP_PHONE_MX, WHATSAPP_PHONE_US, whatsappUrl } from "@/lib/site"
import { cn } from "@/lib/utils"

const SERVICES: ServiceType[] = ["nacional", "internacional"]
const UNITS: UnitType[] = ["dryvan", "flatbed", "oversize"]
type Urgency = "normal" | "urgente"
const URGENCIES: Urgency[] = ["normal", "urgente"]

/** Internacional (MX → USA) tope a 20 t; nacional permite hasta 35 t. */
const maxTonsFor = (service: ServiceType) => (service === "internacional" ? 20 : 35)

export function QuoteSimulator() {
  const t = useTranslations("Quote")
  const locale = useLocale()
  const [service, setService] = useState<ServiceType>("internacional")
  const [originId, setOriginId] = useState("mty")
  const [destinationId, setDestinationId] = useState("")
  const [unit, setUnit] = useState<UnitType>("dryvan")
  const [tons, setTons] = useState(20)
  const [urgency, setUrgency] = useState<Urgency>("normal")
  const [cargo, setCargo] = useState("")

  const maxTons = maxTonsFor(service)

  const destinations = useMemo(
    () => (service === "internacional" ? US_CITIES : MX_CITIES.filter((c) => c.id !== originId)),
    [service, originId],
  )

  const pickService = (next: ServiceType) => {
    setService(next)
    setDestinationId("")
    setTons((prev) => Math.min(prev, maxTonsFor(next)))
  }

  const pickOrigin = (next: string) => {
    setOriginId(next)
    if (next === destinationId) setDestinationId("")
  }

  // Distancia aproximada por carretera: solo informativa, no es un precio.
  const distanceKm = useMemo(
    () => (destinationId ? routeDistanceKm(originId, destinationId) : null),
    [originId, destinationId],
  )

  // El recopilado está listo cuando hay ruta válida (origen ≠ destino).
  const ready = Boolean(destinationId && distanceKm !== null)

  const originName = cityById(originId)?.name ?? ""
  const destinationName = cityById(destinationId)?.name ?? ""
  const cargoText = cargo.trim() || t("cargo.unspecified")
  const distanceText = distanceKm !== null ? distanceKm.toLocaleString(locale === "es" ? "es-MX" : "en-US") : ""

  // Nacional → WhatsApp México; internacional (rutas a USA) → WhatsApp USA.
  const whatsappPhone = service === "nacional" ? WHATSAPP_PHONE_MX : WHATSAPP_PHONE_US
  // Botón de llamar: español muestra el número de México, inglés el de USA.
  const phone = contactPhone(locale)

  const whatsappHref = ready
    ? whatsappUrl(
        t("whatsappMessage", {
          service: t(`service.${service}`),
          origin: originName,
          destination: destinationName,
          unit: t(`unit.${unit}`),
          tons,
          urgency: t(`urgency.${urgency}`),
          cargo: cargoText,
          distance: distanceText,
        }),
        whatsappPhone,
      )
    : undefined

  const summaryRows = ready
    ? [
        { label: t("summary.service"), value: t(`service.${service}`) },
        { label: t("summary.route"), value: `${originName} → ${destinationName}` },
        { label: t("summary.unit"), value: t(`unit.${unit}`) },
        { label: t("summary.weight"), value: t("tons", { tons }) },
        { label: t("summary.urgency"), value: t(`urgency.${urgency}`) },
        { label: t("summary.cargo"), value: cargoText },
        { label: t("summary.distance"), value: t("distance", { km: distanceText }) },
      ]
    : []

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
          max={maxTons}
          step={1}
          aria-label={t("weight")}
          className="py-2"
        />
      </div>

      {/* Urgencia */}
      <div className="space-y-2">
        <Label id="quote-urgency-label">{t("urgency.label")}</Label>
        <div role="group" aria-labelledby="quote-urgency-label" className="grid grid-cols-2 gap-2">
          {URGENCIES.map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={urgency === u}
              onClick={() => setUrgency(u)}
              className={cn(
                "h-11 rounded-md border text-sm font-medium transition-colors active:scale-[0.97]",
                urgency === u
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-border bg-background text-foreground hover:border-secondary/50",
              )}
            >
              {t(`urgency.${u}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de mercancía */}
      <div className="space-y-2">
        <Label htmlFor="quote-cargo">{t("cargo.label")}</Label>
        <Input
          id="quote-cargo"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          placeholder={t("cargo.placeholder")}
          maxLength={120}
          className="h-11"
        />
      </div>

      {/* Recopilado de la solicitud (sin precios) */}
      <div className="rounded-xl border border-border bg-muted/40 p-6">
        {ready ? (
          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("summary.title")}
            </p>
            <dl className="divide-y divide-border/60">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4 py-2">
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd className="text-right text-sm font-medium text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("summaryNote")}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 bg-secondary hover:bg-secondary/90 sm:flex-1" asChild>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden className="mr-2 h-5 w-5" />
                  {t("send")}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 bg-transparent" asChild>
                <a href={`tel:${phone.tel}`}>
                  <Phone aria-hidden className="mr-2 h-4 w-4" />
                  {phone.display}
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

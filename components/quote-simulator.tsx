"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"
import { MessageCircle, Phone } from "lucide-react"
import { useCountUp } from "@/lib/use-count-up"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MX_CITIES, US_CITIES, cityById, routeDistanceKm, type ServiceType, type UnitType } from "@/lib/quote"
import { contactPhone as getContactPhone, hasContact, WHATSAPP_PHONE_MX, WHATSAPP_PHONE_US, whatsappUrl } from "@/lib/site"
import { cn } from "@/lib/utils"
import { submitLoadRequest } from "@/lib/actions/leads"
import { trackEvent, trackGoogleConversion } from "@/lib/analytics"

const SERVICES: ServiceType[] = ["nacional", "internacional"]
const UNITS: UnitType[] = ["dryvan", "flatbed", "oversize"]
type Urgency = "normal" | "urgente"
const URGENCIES: Urgency[] = ["normal", "urgente"]

/** Internacional (MX → USA) tope a 20 t; nacional permite hasta 35 t. */
const maxTonsFor = (service: ServiceType) => (service === "internacional" ? 20 : 35)

const EASE = [0.16, 1, 0.3, 1] as const
/** `footer` se pinta al pie del ticket (p. ej. el contacto directo por WhatsApp). */
export function QuoteSimulator({ footer }: { footer?: ReactNode }) {
  const t = useTranslations("Quote")
  const locale = useLocale()
  const [service, setService] = useState<ServiceType>("internacional")
  const [originId, setOriginId] = useState("mty")
  const [destinationId, setDestinationId] = useState("")
  const [unit, setUnit] = useState<UnitType>("dryvan")
  const [tons, setTons] = useState(20)
  const [urgency, setUrgency] = useState<Urgency>("normal")
  const [cargo, setCargo] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")

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

  // El buscador del mapa de cobertura precarga la ruta Monterrey → ciudad buscada.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const city = cityById((e as CustomEvent<string>).detail)
      if (!city || city.id === "mty") return
      pickService(city.country === "US" ? "internacional" : "nacional")
      setOriginId("mty")
      setDestinationId(city.id)
    }
    window.addEventListener("quote:prefill", onPrefill)
    return () => window.removeEventListener("quote:prefill", onPrefill)
  }, [])

  const pickOrigin = (next: string) => {
    setOriginId(next)
    if (next === destinationId) setDestinationId("")
  }

  // Distancia aproximada por carretera: solo informativa, no es un precio.
  const distanceKm = useMemo(
    () => (destinationId ? routeDistanceKm(originId, destinationId) : null),
    [originId, destinationId],
  )

  // El resumen se arma cuando hay ruta válida (origen ≠ destino).
  const routeReady = Boolean(destinationId && distanceKm !== null)

  // Nombre y teléfono son obligatorios para enviar la solicitud (sin ellos el
  // lead no sirve para dar seguimiento).
  const contactValid = hasContact(contactName, contactPhone)

  // Listo para enviar: ruta válida + contacto completo.
  const ready = routeReady && contactValid

  // Funnel: registra una sola vez cuando el visitante arma una ruta válida.
  const quoteReadyFired = useRef(false)
  useEffect(() => {
    if (routeReady && !quoteReadyFired.current) {
      quoteReadyFired.current = true
      trackEvent("quote_ready", { service })
    }
  }, [routeReady, service])

  // Evita filas duplicadas en load_requests cuando el visitante vuelve a tocar
  // "Enviar" con los mismos datos (p. ej. regresa de WhatsApp y reintenta).
  const lastSubmitted = useRef("")

  const reduce = useReducedMotion()

  const originName = cityById(originId)?.name ?? ""
  const destinationName = cityById(destinationId)?.name ?? ""
  const cargoText = cargo.trim() || t("cargo.unspecified")
  const distanceText = distanceKm !== null ? distanceKm.toLocaleString(locale === "es" ? "es-MX" : "en-US") : ""

  // Distancia con roll-up al fijar/cambiar de ruta (solo display; el mensaje de
  // WhatsApp usa siempre el valor final `distanceText`).
  const distanceCount = useCountUp(distanceKm, routeReady, 900)
  const distanceCountText = distanceCount.toLocaleString(locale === "es" ? "es-MX" : "en-US")

  // Nacional → WhatsApp México; internacional (rutas a USA) → WhatsApp USA.
  const whatsappPhone = service === "nacional" ? WHATSAPP_PHONE_MX : WHATSAPP_PHONE_US
  // Botón de llamar: español muestra el número de México, inglés el de USA.
  const phone = getContactPhone(locale)

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
          name: contactName.trim(),
          phone: contactPhone.trim(),
        }),
        whatsappPhone,
      )
    : undefined

  // Ticket de la solicitud: visible desde el inicio y se completa mientras el
  // visitante llena el formulario. Lo pendiente se muestra atenuado.
  const summaryRows = [
    {
      label: t("summary.route"),
      value: `${originName} → ${destinationName || t("pendingDestination")}`,
      wide: true,
      pending: !routeReady,
      big: true,
    },
    { label: t("summary.service"), value: t(`service.${service}`), wide: false, pending: false },
    { label: t("summary.unit"), value: t(`unit.${unit}`), wide: false, pending: false },
    { label: t("summary.weight"), value: t("tons", { tons }), wide: false, pending: false },
    { label: t("summary.urgency"), value: t(`urgency.${urgency}`), wide: false, pending: false },
    { label: t("summary.cargo"), value: cargoText, wide: true, pending: !cargo.trim() },
    {
      label: t("summary.distance"),
      value: routeReady ? t("distance", { km: distanceCountText }) : "—",
      wide: true,
      pending: !routeReady,
    },
  ]

  // Lo que falta para poder enviar; null cuando la solicitud está completa.
  const missing = !routeReady ? t("empty") : !contactValid ? t("contact.required") : null

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      {/* Formulario */}
      <div className="space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:col-span-7">
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
                  "flex h-11 min-w-0 items-center justify-center rounded-md border px-1 transition-colors active:scale-[0.97] sm:px-2",
                  unit === u
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-border bg-background text-foreground hover:border-secondary/50",
                )}
              >
                <span
                  className="min-w-0 break-words hyphens-auto text-center text-xs font-medium leading-tight sm:text-sm"
                >
                  {t(`unit.${u}`)}
                </span>
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
            valueText={t("tons", { tons })}
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

        {/* Contacto (obligatorio) para dar seguimiento al lead */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quote-contact-name">{t("contact.nameLabel")}</Label>
            <Input
              id="quote-contact-name"
              required
              aria-required="true"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder={t("contact.namePh")}
              autoComplete="name"
              maxLength={80}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote-contact-phone">{t("contact.phoneLabel")}</Label>
            <Input
              id="quote-contact-phone"
              type="tel"
              required
              aria-required="true"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder={t("contact.phonePh")}
              autoComplete="tel"
              maxLength={30}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Ticket de la solicitud (sin precios), a la misma altura que el formulario */}
      <aside className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8 lg:col-span-5">
        <h3 className="font-semibold">{t("summary.title")}</h3>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-dashed border-border pt-5">
          {summaryRows.map((row) => (
            <div key={row.label} className={cn("min-w-0", row.wide && "col-span-2")}>
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd
                className={cn(
                  "mt-0.5 break-words font-medium leading-snug transition-colors",
                  "big" in row ? "text-lg font-semibold" : "text-sm",
                  row.pending ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        {/* Región viva: el lector anuncia qué falta para enviar. */}
        <div aria-live="polite" className="mt-auto border-t border-dashed border-border pt-2">
          <AnimatePresence initial={false}>
            {missing && (
              <motion.p
                key="missing"
                initial={reduce ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="overflow-hidden pt-3 text-sm font-medium leading-relaxed text-secondary"
              >
                {missing}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          {ready ? (
            <Button size="lg" className="h-12 w-full bg-secondary hover:bg-secondary/90" asChild>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("whatsapp_click", { source: "quote", service })
                  const signature = JSON.stringify([
                    service, originId, destinationId, unit, tons, urgency, cargoText,
                    contactName.trim(), contactPhone.trim(),
                  ])
                  // Un reenvío con los mismos datos no cuenta como otro lead.
                  if (lastSubmitted.current === signature) return
                  lastSubmitted.current = signature
                  // Conversión Google Ads/GA4 + eventos estándar (GA4 + Vercel + Meta Pixel).
                  trackGoogleConversion("conversion_event_request_quote")
                  // metaEventId deduplica el pixel contra la Conversions API server-side.
                  const metaEventId = trackEvent("generate_lead", { lead_type: "quote", service, unit })
                  void submitLoadRequest({
                    service,
                    originId,
                    originName,
                    destinationId,
                    destinationName,
                    unit,
                    tons,
                    urgency,
                    cargo: cargoText,
                    distanceKm,
                    contactName,
                    contactPhone,
                    locale,
                    metaEventId,
                  })
                    // Si no se guardó, libera la firma para que un reintento sí persista.
                    .then((r) => { if (!r.ok) lastSubmitted.current = "" })
                    .catch(() => { lastSubmitted.current = "" })
                }}
              >
                <MessageCircle aria-hidden className="mr-2 h-5 w-5" />
                {t("send")}
              </a>
            </Button>
          ) : (
            <Button size="lg" disabled className="h-12 w-full bg-secondary" aria-label={missing ?? undefined}>
              <MessageCircle aria-hidden className="mr-2 h-5 w-5" />
              {t("send")}
            </Button>
          )}
          <Button size="lg" variant="outline" className="h-12 w-full bg-transparent" asChild>
            <a href={`tel:${phone.tel}`} onClick={() => trackEvent("phone_click", { source: "quote", locale })}>
              <Phone aria-hidden className="mr-2 h-4 w-4" />
              {phone.display}
            </a>
          </Button>
        </div>
        {footer && <div className="mt-6 border-t border-border pt-6">{footer}</div>}
      </aside>
    </div>
  )
}

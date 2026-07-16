import { track as vercelTrack } from "@vercel/analytics"

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>

/**
 * Mapea un evento interno a un evento de conversión de Meta Pixel.
 * `standard: true` usa fbq('track', …) (eventos estándar reconocidos por Meta),
 * `false` usaría fbq('trackCustom', …). Devuelve `null` cuando el evento no es
 * una conversión que interese enviar a Meta (p. ej. reproducir el video o cambiar idioma).
 */
type MetaMapping = {
  event: string
  standard: boolean
  /**
   * true → el evento también se envía por Conversions API desde una Server Action
   * (con PII), así que trackEvent NO lo reenvía por beacon: solo devuelve el
   * eventID para que quien llama lo pase a esa action y Meta deduplique.
   */
  forwarded: boolean
  params: Record<string, string | number>
}

function toMetaEvent(name: string, params: AnalyticsParams): MetaMapping | null {
  const category = (params.service ?? params.position ?? params.source) as string | undefined
  const metaParams: Record<string, string | number> = {}
  if (category) metaParams.content_category = category

  switch (name) {
    case "generate_lead":
      // Cotización → Lead; postulación de operador → SubmitApplication.
      // Ambos se envían también por CAPI desde la Server Action del formulario.
      return params.lead_type === "job"
        ? { event: "SubmitApplication", standard: true, forwarded: true, params: metaParams }
        : { event: "Lead", standard: true, forwarded: true, params: metaParams }
    case "whatsapp_click":
    case "phone_click":
      return { event: "Contact", standard: true, forwarded: false, params: metaParams }
    case "quote_ready":
      // Señal de intención (arma una ruta válida): sirve para optimización y retargeting.
      return { event: "ViewContent", standard: true, forwarded: false, params: metaParams }
    default:
      return null
  }
}

/** ID compartido entre Pixel y CAPI para que Meta deduplique el mismo evento. */
function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/** Reenvía un evento sin PII a la Conversions API vía beacon del mismo origen. */
function beaconToCapi(event: string, eventId: string, customData: Record<string, string | number>) {
  if (typeof window === "undefined") return
  try {
    const payload = JSON.stringify({
      eventName: event,
      eventId,
      eventSourceUrl: window.location.href,
      customData,
    })
    const url = "/api/conversions"
    // sendBeacon sobrevive a navegaciones (tel:, target=_blank), fetch keepalive de respaldo.
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }))
    } else {
      void fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      })
    }
  } catch {
    // Beacon no disponible — ignorar; el pixel ya disparó.
  }
}

/**
 * Dispara el evento de conversión en Meta Pixel (window.fbq) con un eventID, y
 * lo reenvía a CAPI por beacon salvo que una Server Action ya se encargue (leads).
 * Devuelve el eventID cuando quien llama debe pasarlo a esa action; si no, undefined.
 */
function forwardToMeta(name: string, params: AnalyticsParams): string | undefined {
  if (typeof window === "undefined") return undefined
  const meta = toMetaEvent(name, params)
  if (!meta) return undefined

  const eventId = newEventId()
  if (typeof window.fbq === "function") {
    window.fbq(meta.standard ? "track" : "trackCustom", meta.event, meta.params, { eventID: eventId })
  }
  if (!meta.forwarded) {
    beaconToCapi(meta.event, eventId, meta.params)
    return undefined
  }
  return eventId
}

/**
 * Envía un evento a GA4 (window.gtag), Vercel Analytics y Meta (Pixel + CAPI).
 * No-op seguro si alguno no cargó (SSR, bloqueadores, etc.).
 *
 * Devuelve el `eventID` de Meta cuando el evento debe deduplicarse contra la
 * Conversions API server-side (leads de formulario): quien llama debe pasarlo a
 * la Server Action correspondiente. Para el resto de eventos devuelve undefined.
 */
export function trackEvent(name: string, params: AnalyticsParams = {}): string | undefined {
  // Google Analytics (GA4)
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params)
  }
  // Vercel Analytics: solo acepta propiedades planas; descartamos null/undefined.
  const clean: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== null && v !== undefined) clean[k] = v
  }
  try {
    vercelTrack(name, clean)
  } catch {
    // Vercel Analytics no disponible — ignorar.
  }
  // Meta Pixel + Conversions API.
  return forwardToMeta(name, params)
}

/**
 * Dispara una conversión de Google Ads/GA4 con el nombre exacto provisto por Google.
 * Solo va a gtag (las conversiones de Ads son específicas de Google).
 */
export function trackGoogleConversion(conversionName: string, params: AnalyticsParams = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", conversionName, params)
  }
}

import { track as vercelTrack } from "@vercel/analytics"

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>

/**
 * Envía un evento a GA4 (window.gtag) y a Vercel Analytics a la vez.
 * No-op seguro si alguno no cargó (SSR, bloqueadores, etc.).
 */
export function trackEvent(name: string, params: AnalyticsParams = {}) {
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

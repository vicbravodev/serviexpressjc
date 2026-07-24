export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://serviexpressjc.com.mx"

/** Ruta pública por locale: es vive en la raíz (localePrefix as-needed). */
export const localePath = (locale: string) => (locale === "es" ? "/" : `/${locale}`)

/** Año de fundación de JC Serviexpress. Los años de experiencia SIEMPRE se calculan desde aquí. */
export const FOUNDING_YEAR = 2005

/** Años completos de operación. Nunca hardcodear "10+"/"20+" en copy: usar este valor vía ICU {years}. */
export const yearsInService = () => new Date().getFullYear() - FOUNDING_YEAR

/** Teléfono USA (formato E.164 para tel: y visible). */
export const CONTACT_PHONE_US = "+13463669867"
export const CONTACT_PHONE_US_DISPLAY = "+1 346 366 9867"
/** Teléfono México (formato E.164 para tel: y visible). */
export const CONTACT_PHONE_MX = "+528115526349"
export const CONTACT_PHONE_MX_DISPLAY = "+52 81 1552 6349"

/** Teléfono de contacto según idioma: español → México, inglés → USA. */
export const contactPhone = (locale: string) =>
  locale === "es"
    ? { tel: CONTACT_PHONE_MX, display: CONTACT_PHONE_MX_DISPLAY }
    : { tel: CONTACT_PHONE_US, display: CONTACT_PHONE_US_DISPLAY }

export const CONTACT_EMAIL = "contacto@serviexpressjc.com.mx"

/** WhatsApp de contacto directo (México): +52 81 1524 8593. Solo dígitos con código de país (formato wa.me); override sin deploy vía env. */
export const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "5218115248593"

/** WhatsApp para cotizaciones NACIONALES (México): +52 1 81 1552 6349. */
export const WHATSAPP_PHONE_MX = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_MX ?? "5218115526349"

/** WhatsApp para cotizaciones INTERNACIONALES / USA: +1 346 366 9867. */
export const WHATSAPP_PHONE_US = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_US ?? "13463669867"

/** WhatsApp para POSTULACIONES de operadores (México): +52 81 1524 8593. */
export const WHATSAPP_PHONE_JOBS = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_JOBS ?? "5218115248593"

export const whatsappUrl = (text: string, phone: string = WHATSAPP_PHONE) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(text)}`

export const ADDRESS = {
  street: "Carr. Mezquital Santa Rosa 3517 Int. C",
  locality: "Apodaca",
  region: "Nuevo León",
  country: "MX",
} as const

/** Sede física verificada por Google (place único). Fuente de verdad del mapa y del geo del schema. */
export const LOCATION = {
  placeId: "ChIJhRqcmcPrYoYR2oaNwumNn9I",
  lat: 25.7626695,
  lng: -100.2333454,
} as const

/**
 * Key pública de Google Maps Embed API. Va visible en el iframe (es normal);
 * su seguridad depende de restringirla en Google Cloud por referrer HTTP y a
 * solo "Maps Embed API". Override sin deploy vía env.
 */
export const GOOGLE_MAPS_EMBED_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY ?? "AIzaSyANzhut33GBXlBcMvUzKzWORCAhG08MYdU"

/** URL del iframe de embed apuntando al placeId, con idioma según locale. */
export const mapsEmbedUrl = (locale: string) =>
  `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_EMBED_KEY}` +
  `&q=place_id:${LOCATION.placeId}&language=${locale}&region=MX`

/** URL de "Cómo llegar" (direcciones) al placeId; se abre en Google Maps. */
export const mapsDirectionsUrl = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.lat},${LOCATION.lng}` +
  `&destination_place_id=${LOCATION.placeId}`

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/serviexpressjc1",
  facebook: "https://facebook.com/serviexpressjc",
  linkedin: "https://linkedin.com/company/serviexpressjc",
} as const

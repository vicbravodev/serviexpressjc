export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://serviexpressjc.com.mx"

/** Ruta pública por locale: es vive en la raíz (localePrefix as-needed). */
export const localePath = (locale: string) => (locale === "es" ? "/" : `/${locale}`)

/** Año de fundación de JC Serviexpress. Los años de experiencia SIEMPRE se calculan desde aquí. */
export const FOUNDING_YEAR = 2005

/** Años completos de operación. Nunca hardcodear "10+"/"20+" en copy: usar este valor vía ICU {years}. */
export const yearsInService = () => new Date().getFullYear() - FOUNDING_YEAR

export const CONTACT_PHONE = "+13463669867"
export const CONTACT_PHONE_DISPLAY = "+1 346 366 9867"
export const CONTACT_EMAIL = "contacto@serviexpressjc.com.mx"

/** Solo dígitos con código de país (formato wa.me). Confirmar con el negocio; override sin deploy vía env. */
export const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "13463669867"

export const whatsappUrl = (text: string) => `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`

export const ADDRESS = {
  street: "Carretera Mezquital Santa Rosa Km 05",
  locality: "Apodaca",
  region: "Nuevo León",
  country: "MX",
} as const

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/serviexpressjc1",
  facebook: "https://facebook.com/serviexpressjc",
  linkedin: "https://linkedin.com/company/serviexpressjc",
} as const

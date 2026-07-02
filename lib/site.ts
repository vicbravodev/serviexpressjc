export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://serviexpressjc.com.mx"

/** Ruta pública por locale: es vive en la raíz (localePrefix as-needed). */
export const localePath = (locale: string) => (locale === "es" ? "/" : `/${locale}`)

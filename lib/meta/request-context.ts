import "server-only"
import { cookies, headers } from "next/headers"
import type { MetaUserData } from "@/lib/meta/capi"

/**
 * Extrae del request actual los datos de match que aporta el navegador:
 * cookies del pixel (_fbp / _fbc), IP del cliente, user-agent y URL de origen.
 * Se usa en Server Actions para enriquecer los eventos de CAPI.
 */
export async function metaRequestContext(): Promise<{
  userData: Pick<MetaUserData, "fbp" | "fbc" | "clientIp" | "userAgent">
  eventSourceUrl: string | null
}> {
  const [c, h] = await Promise.all([cookies(), headers()])
  const forwardedFor = h.get("x-forwarded-for")
  return {
    userData: {
      fbp: c.get("_fbp")?.value ?? null,
      fbc: c.get("_fbc")?.value ?? null,
      clientIp: forwardedFor ? forwardedFor.split(",")[0].trim() : null,
      userAgent: h.get("user-agent"),
    },
    eventSourceUrl: h.get("referer"),
  }
}

import "server-only"
import { createHash } from "node:crypto"

/**
 * Meta Conversions API (server-side).
 *
 * Envía eventos de conversión directamente desde el servidor a Meta, en paralelo
 * con el Meta Pixel del navegador. Ambos comparten `event_id` para que Meta
 * deduplique (no cuenta doble). El lado servidor es a prueba de bloqueadores y
 * aporta mejor calidad de match (IP, user-agent, teléfono/nombre hasheados).
 *
 * Requiere la variable de entorno META_CAPI_ACCESS_TOKEN. Sin token, es un no-op
 * silencioso (permite dev/preview sin CAPI configurado).
 */

const GRAPH_VERSION = process.env.META_GRAPH_VERSION ?? "v21.0"
const PIXEL_ID = process.env.META_PIXEL_ID ?? "1923289228312662"
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE

export type MetaStandardEvent = "Lead" | "SubmitApplication" | "Contact" | "ViewContent"

export type MetaUserData = {
  email?: string | null
  phone?: string | null
  fullName?: string | null
  /** Cookie _fbp del navegador (no se hashea). */
  fbp?: string | null
  /** Cookie _fbc del navegador (no se hashea). */
  fbc?: string | null
  /** IP del cliente (no se hashea). */
  clientIp?: string | null
  /** User-Agent del cliente (no se hashea). */
  userAgent?: string | null
}

export type ServerEventInput = {
  eventName: MetaStandardEvent
  /** Debe coincidir con el eventID del pixel para deduplicar. */
  eventId?: string
  eventSourceUrl?: string | null
  customData?: Record<string, string | number>
  userData?: MetaUserData
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

/** Normaliza un teléfono a E.164 sin `+`. Asume MX (52) para números de 10 dígitos. */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return null
  if (digits.length === 10) return `52${digits}`
  return digits
}

/** Construye el bloque user_data con los PII hasheados (SHA-256) según exige Meta. */
function buildUserData(u: MetaUserData): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {}
  if (u.email) {
    const em = u.email.trim().toLowerCase()
    if (em) out.em = [sha256(em)]
  }
  if (u.phone) {
    const ph = normalizePhone(u.phone)
    if (ph) out.ph = [sha256(ph)]
  }
  if (u.fullName) {
    const parts = u.fullName.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (parts.length > 0) out.fn = [sha256(parts[0])]
    if (parts.length > 1) out.ln = [sha256(parts[parts.length - 1])]
  }
  // Estos NO se hashean.
  if (u.fbp) out.fbp = u.fbp
  if (u.fbc) out.fbc = u.fbc
  if (u.clientIp) out.client_ip_address = u.clientIp
  if (u.userAgent) out.client_user_agent = u.userAgent
  return out
}

/**
 * Envía un evento a la Conversions API. Nunca lanza: registra el error y sigue,
 * para no romper el flujo (guardado del lead, respuesta al usuario, etc.).
 */
export async function sendServerEvent(input: ServerEventInput): Promise<void> {
  if (!ACCESS_TOKEN) return // CAPI no configurado — no-op.

  const event = {
    event_name: input.eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    ...(input.eventId ? { event_id: input.eventId } : {}),
    ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
    user_data: buildUserData(input.userData ?? {}),
    ...(input.customData ? { custom_data: input.customData } : {}),
  }

  const body = JSON.stringify({
    data: [event],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000)
  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        signal: controller.signal,
      },
    )
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      console.error(`Meta CAPI ${input.eventName}:`, res.status, text.slice(0, 300))
    }
  } catch (e) {
    console.error(`Meta CAPI ${input.eventName}:`, e)
  } finally {
    clearTimeout(timeout)
  }
}

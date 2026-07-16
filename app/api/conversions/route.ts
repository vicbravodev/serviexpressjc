import { NextResponse, type NextRequest } from "next/server"
import { sendServerEvent, type MetaStandardEvent } from "@/lib/meta/capi"

export const runtime = "nodejs"

/**
 * Beacon de conversiones para eventos disparados en el cliente sin PII
 * (Contact, ViewContent). Los eventos con datos personales (Lead,
 * SubmitApplication) NO pasan por aquí: se envían desde las Server Actions,
 * donde el teléfono/nombre se hashean con contexto de servidor garantizado.
 *
 * El allow-list evita que este endpoint público se use para falsear
 * conversiones de alto valor.
 */
const ALLOWED: ReadonlySet<string> = new Set<MetaStandardEvent>(["Contact", "ViewContent"])

/** Solo se reenvían estos campos de custom_data, truncados, para evitar inyección. */
function sanitizeCustomData(input: unknown): Record<string, string> | undefined {
  if (!input || typeof input !== "object") return undefined
  const src = input as Record<string, unknown>
  const out: Record<string, string> = {}
  for (const key of ["content_category", "content_name"] as const) {
    const v = src[key]
    if (typeof v === "string" && v) out[key] = v.slice(0, 100)
  }
  return Object.keys(out).length > 0 ? out : undefined
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const eventName = body.eventName
  if (typeof eventName !== "string" || !ALLOWED.has(eventName)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const forwardedFor = req.headers.get("x-forwarded-for")
  await sendServerEvent({
    eventName: eventName as MetaStandardEvent,
    eventId: typeof body.eventId === "string" ? body.eventId : undefined,
    eventSourceUrl:
      typeof body.eventSourceUrl === "string" ? body.eventSourceUrl : req.headers.get("referer"),
    customData: sanitizeCustomData(body.customData),
    userData: {
      fbp: req.cookies.get("_fbp")?.value ?? null,
      fbc: req.cookies.get("_fbc")?.value ?? null,
      clientIp: forwardedFor ? forwardedFor.split(",")[0].trim() : null,
      userAgent: req.headers.get("user-agent"),
    },
  })

  return NextResponse.json({ ok: true })
}

"use server"

import { after } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { sendServerEvent } from "@/lib/meta/capi"
import { metaRequestContext } from "@/lib/meta/request-context"

export type LoadRequestInput = {
  service: string
  originId: string
  originName: string
  destinationId: string
  destinationName: string
  unit: string
  tons: number
  urgency: string
  cargo: string
  distanceKm: number | null
  contactName: string
  contactPhone: string
  locale: string
  /** eventID del Pixel para deduplicar contra la Conversions API. */
  metaEventId?: string
}

export type ApplicationInput = {
  name: string
  phone: string
  position: string
  experience: string
  locale: string
  /** eventID del Pixel para deduplicar contra la Conversions API. */
  metaEventId?: string
}

export type PartnerLeadInput = {
  name: string
  phone: string
  unitType: string
  locale: string
  /** eventID del Pixel para deduplicar contra la Conversions API. */
  metaEventId?: string
}

/**
 * Normaliza texto de entrada pública: string, sin espacios extremos y con tope de
 * longitud. Las Server Actions son endpoints públicos; el maxLength del input no
 * protege contra una invocación directa con payloads enormes.
 */
function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function cleanInt(value: unknown, min: number, max: number): number | null {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) return null
  return Math.min(Math.max(Math.round(n), min), max)
}

const hasContact = (name: string, phone: string) => name.length >= 2 && phone.replace(/\D/g, "").length >= 8

/**
 * Meta CAPI se envía con `after()`: corre después de responder, así el usuario no
 * espera el round-trip a graph.facebook.com (hasta 3 s de timeout) en cada envío.
 * El contexto (cookies/headers) se lee antes, mientras el request sigue vivo.
 */
async function sendLeadEventAfterResponse(
  eventName: "Lead" | "SubmitApplication",
  eventId: string | undefined,
  category: string,
  phone: string,
  fullName: string,
) {
  const { userData, eventSourceUrl } = await metaRequestContext()
  after(() =>
    sendServerEvent({
      eventName,
      eventId: clean(eventId, 100) || undefined,
      eventSourceUrl,
      customData: { content_category: category },
      userData: { ...userData, phone, fullName },
    }),
  )
}

export async function submitLoadRequest(input: LoadRequestInput): Promise<{ ok: boolean }> {
  try {
    // Nombre y teléfono son obligatorios: sin contacto el lead no sirve.
    const contactName = clean(input.contactName, 80)
    const contactPhone = clean(input.contactPhone, 30)
    if (!hasContact(contactName, contactPhone)) {
      console.error("submitLoadRequest: falta nombre o teléfono de contacto")
      return { ok: false }
    }
    const service = clean(input.service, 40)

    const supabase = createClient(await cookies())
    const { error } = await supabase.from("load_requests").insert({
      service,
      origin_id: clean(input.originId, 40),
      origin_name: clean(input.originName, 120),
      destination_id: clean(input.destinationId, 40),
      destination_name: clean(input.destinationName, 120),
      unit: clean(input.unit, 40),
      tons: cleanInt(input.tons, 0, 100),
      urgency: clean(input.urgency, 40),
      cargo: clean(input.cargo, 200),
      distance_km: cleanInt(input.distanceKm, 0, 20000),
      contact_name: contactName,
      contact_phone: contactPhone,
      locale: clean(input.locale, 5),
    })
    if (error) console.error("submitLoadRequest:", error.message)

    // Meta Conversions API: Lead (server-side, deduplicado por metaEventId).
    await sendLeadEventAfterResponse("Lead", input.metaEventId, service, contactPhone, contactName)

    return { ok: !error }
  } catch (e) {
    console.error("submitLoadRequest:", e)
    return { ok: false }
  }
}

export async function submitApplication(input: ApplicationInput): Promise<{ ok: boolean }> {
  try {
    const name = clean(input.name, 80)
    const phone = clean(input.phone, 30)
    if (!hasContact(name, phone)) {
      console.error("submitApplication: falta nombre o teléfono")
      return { ok: false }
    }
    const position = clean(input.position, 40)

    const supabase = createClient(await cookies())
    const { error } = await supabase.from("job_applications").insert({
      name,
      phone,
      position,
      experience: clean(input.experience, 40),
      locale: clean(input.locale, 5),
    })
    if (error) console.error("submitApplication:", error.message)

    // Meta Conversions API: SubmitApplication (server-side, deduplicado por metaEventId).
    await sendLeadEventAfterResponse("SubmitApplication", input.metaEventId, position, phone, name)

    return { ok: !error }
  } catch (e) {
    console.error("submitApplication:", e)
    return { ok: false }
  }
}

export async function submitPartnerLead(input: PartnerLeadInput): Promise<{ ok: boolean }> {
  try {
    const name = clean(input.name, 80)
    const phone = clean(input.phone, 30)
    if (!hasContact(name, phone)) {
      console.error("submitPartnerLead: falta nombre o teléfono")
      return { ok: false }
    }

    const supabase = createClient(await cookies())
    const { error } = await supabase.from("partner_leads").insert({
      name,
      phone,
      unit_type: clean(input.unitType, 40),
      locale: clean(input.locale, 5),
    })
    if (error) console.error("submitPartnerLead:", error.message)

    // Meta Conversions API: Lead (server-side, deduplicado por metaEventId).
    await sendLeadEventAfterResponse("Lead", input.metaEventId, "socio_comercial", phone, name)

    return { ok: !error }
  } catch (e) {
    console.error("submitPartnerLead:", e)
    return { ok: false }
  }
}

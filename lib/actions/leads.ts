"use server"

import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

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
  contactName?: string
  contactPhone?: string
  locale: string
}

export type ApplicationInput = {
  name: string
  phone: string
  position: string
  experience: string
  locale: string
}

export async function submitLoadRequest(input: LoadRequestInput): Promise<{ ok: boolean }> {
  try {
    const supabase = createClient(await cookies())
    const { error } = await supabase.from("load_requests").insert({
      service: input.service,
      origin_id: input.originId,
      origin_name: input.originName,
      destination_id: input.destinationId,
      destination_name: input.destinationName,
      unit: input.unit,
      tons: input.tons,
      urgency: input.urgency,
      cargo: input.cargo,
      distance_km: input.distanceKm,
      contact_name: input.contactName?.trim() || null,
      contact_phone: input.contactPhone?.trim() || null,
      locale: input.locale,
    })
    if (error) console.error("submitLoadRequest:", error.message)
    return { ok: !error }
  } catch (e) {
    console.error("submitLoadRequest:", e)
    return { ok: false }
  }
}

export async function submitApplication(input: ApplicationInput): Promise<{ ok: boolean }> {
  try {
    const supabase = createClient(await cookies())
    const { error } = await supabase.from("job_applications").insert({
      name: input.name.trim(),
      phone: input.phone.trim(),
      position: input.position,
      experience: input.experience,
      locale: input.locale,
    })
    if (error) console.error("submitApplication:", error.message)
    return { ok: !error }
  } catch (e) {
    console.error("submitApplication:", e)
    return { ok: false }
  }
}

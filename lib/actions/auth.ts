"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export type SignInState = { error?: string }

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  if (!email || !password) return { error: "Ingresa email y contraseña." }

  const supabase = createClient(await cookies())
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: "Credenciales inválidas." }
  redirect("/admin")
}

export async function signOut(): Promise<void> {
  const supabase = createClient(await cookies())
  await supabase.auth.signOut()
  redirect("/admin/login")
}

import "server-only"
import { createClient } from "@supabase/supabase-js"

/** Cliente service_role: saltea RLS. Solo para Server Actions de gestión (crear usuarios, etc.). */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada")
  return createClient(url!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

/**
 * Refresca la sesión Supabase y devuelve la respuesta.
 * Si `rewriteTo` viene, la respuesta es un rewrite a esa URL (subdominio admin → /admin/*).
 */
export async function updateSession(request: NextRequest, rewriteTo?: URL) {
  const makeResponse = () =>
    rewriteTo ? NextResponse.rewrite(rewriteTo, { request }) : NextResponse.next({ request })

  let supabaseResponse = makeResponse()

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = makeResponse()
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  // IMPORTANTE: refresca el token. No poner código entre createServerClient y esta llamada.
  await supabase.auth.getClaims()

  return supabaseResponse
}

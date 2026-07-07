import createMiddleware from "next-intl/middleware"
import { type NextRequest } from "next/server"
import { routing } from "./i18n/routing"
import { updateSession } from "./utils/supabase/middleware"

const intlMiddleware = createMiddleware(routing)
const ADMIN_HOST = process.env.NEXT_PUBLIC_ADMIN_HOST

function isAdminHost(host: string | null): boolean {
  if (!host) return false
  const hostname = host.split(":")[0]
  if (ADMIN_HOST && hostname === ADMIN_HOST.split(":")[0]) return true
  return hostname.startsWith("admin.")
}

export default async function middleware(request: NextRequest) {
  const host = request.headers.get("host")
  const { pathname } = request.nextUrl
  const adminHost = isAdminHost(host)
  // Anclado: solo /admin exacto o /admin/*, no /administracion u otras rutas.
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/")

  if (adminHost || isAdminPath) {
    // Subdominio admin: reescribe la raíz (rutas sin prefijo /admin) hacia /admin/*.
    if (adminHost && !isAdminPath) {
      const url = request.nextUrl.clone()
      url.pathname = `/admin${pathname === "/" ? "" : pathname}`
      return updateSession(request, url)
    }
    // Path /admin en cualquier host (fallback + dev local): sin rewrite, solo refresca sesión.
    return updateSession(request)
  }

  return intlMiddleware(request)
}

export const config = {
  // Todo excepto api, internals de Next y archivos estáticos (contienen punto)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
}

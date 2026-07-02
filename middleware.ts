import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Todo excepto api, internals de Next y archivos estáticos (contienen punto)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
}

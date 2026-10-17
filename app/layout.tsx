import type React from "react"
import type { Metadata } from "next"

// URLs estáticas y estables (public/, sin hash) para que Google las cachee como favicon.
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

// Root layout mínimo. app/[locale]/layout.tsx aporta <html>/<body> con locale, fuentes y
// analytics para el sitio de marketing. app/admin/** no tiene ancestro con <html>/<body>
// (vive fuera de app/[locale]), así que ese layout provee su propio shell mínimo.
// Este root layout existe solo para satisfacer el requisito de Next.js de un layout raíz;
// no debe renderizar <html>/<body> porque [locale]/layout.tsx ya lo hace para sus rutas.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}

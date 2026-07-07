import type React from "react"

// Root layout mínimo. app/[locale]/layout.tsx aporta <html>/<body> con locale, fuentes y
// analytics para el sitio de marketing. app/admin/** no tiene ancestro con <html>/<body>
// (vive fuera de app/[locale]), así que ese layout provee su propio shell mínimo.
// Este root layout existe solo para satisfacer el requisito de Next.js de un layout raíz;
// no debe renderizar <html>/<body> porque [locale]/layout.tsx ya lo hace para sus rutas.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}

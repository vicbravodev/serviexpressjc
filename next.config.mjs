import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Optimización activa (Vercel): AVIF/WebP y tamaños responsivos.
    formats: ["image/avif", "image/webp"],
    // 68 = poster del hero (LCP más liviano); 75 = default de next/image.
    // Next 16 exige declarar los valores de quality usados.
    qualities: [68, 75],
  },
  // Canónico sin www: el redirect www → apex se configura a NIVEL DOMINIO en
  // Vercel (Settings → Domains: el apex sirve el sitio, www con "Redirect to"
  // hacia el apex). NO duplicarlo aquí con redirects(): si el dashboard
  // apuntara en sentido contrario se produciría un loop infinito
  // (ERR_TOO_MANY_REDIRECTS). Ver SEO-CHECKLIST-POSTDEPLOY.md §1.
}

export default withNextIntl(nextConfig)

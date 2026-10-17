import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Nadie debe enmarcar el sitio: evita clickjacking sobre el panel admin.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // 18 MB que no cambian entre deploys: sin esto Vercel lo revalida en cada visita.
        source: "/hero-videop.mp4",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ]
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

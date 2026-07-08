import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Dominio canónico sin www: 301 permanente desde www hacia el apex.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.serviexpressjc.com.mx" }],
        destination: "https://serviexpressjc.com.mx/:path*",
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)

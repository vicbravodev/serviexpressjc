import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { SITE_URL, localePath } from "@/lib/site"
import "../globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  const path = localePath(locale)

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    generator: "v0.app",
    alternates: {
      canonical: path,
      languages: {
        "es-MX": "/",
        "en-US": "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: "ServiExpress JC",
      url: path,
      title: t("title"),
      description: t("description"),
      locale: locale === "es" ? "es_MX" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_MX",
      images: [{ url: "/fleet/flota-patio.jpg", width: 1600, height: 1200, alt: "ServiExpress JC" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/fleet/flota-patio.jpg"],
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  const tMeta = await getTranslations({ locale, namespace: "Metadata" })
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ServiExpress JC",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-white-bg.png`,
    description: tMeta("description"),
    email: "contacto@serviexpressjc.com.mx",
    telephone: "+13463669867",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carretera Mezquital Santa Rosa Km 05",
      addressLocality: "Apodaca",
      addressRegion: "Nuevo León",
      addressCountry: "MX",
    },
    areaServed: [
      { "@type": "Country", name: "Mexico" },
      { "@type": "Country", name: "United States" },
    ],
    sameAs: [
      "https://instagram.com/serviexpressjc1",
      "https://facebook.com/serviexpressjc",
      "https://linkedin.com/company/serviexpressjc",
    ],
  }

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}

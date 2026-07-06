import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import {
  SITE_URL,
  localePath,
  FOUNDING_YEAR,
  yearsInService,
  CONTACT_EMAIL,
  contactPhone,
  ADDRESS,
  SOCIAL_LINKS,
} from "@/lib/site"
import "../globals.css"

const GA_MEASUREMENT_ID = "G-J6RD1ZV13R"

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

  const description = t("description", { years: yearsInService() })

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description,
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
      description,
      locale: locale === "es" ? "es_MX" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_MX",
      images: [{ url: "/fleet/flota-patio.jpg", width: 1600, height: 829, alt: "ServiExpress JC" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description,
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
    description: tMeta("description", { years: yearsInService() }),
    foundingDate: String(FOUNDING_YEAR),
    email: CONTACT_EMAIL,
    telephone: contactPhone(locale).tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.locality,
      addressRegion: ADDRESS.region,
      addressCountry: ADDRESS.country,
    },
    areaServed: [
      { "@type": "Country", name: "Mexico" },
      { "@type": "Country", name: "United States" },
    ],
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook, SOCIAL_LINKS.linkedin],
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}

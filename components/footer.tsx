import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link as LocaleLink } from "@/i18n/navigation"
import type { ContentHref } from "@/i18n/routing"
import { CONTACT_EMAIL, contactPhone, localePath, SOCIAL_LINKS } from "@/lib/site"

/** Orden alineado con Footer.services en messages/. */
const serviceHrefs: ContentHref[] = [
  "/transporte-nacional",
  "/transporte-internacional-mexico-usa",
  "/transporte-de-acero",
  "/carga-sobredimensionada",
  "/caja-seca-53",
  "/plataforma",
]

export function Footer() {
  const t = useTranslations("Footer")
  const tNav = useTranslations("Header.nav")
  const locale = useLocale()
  const phone = contactPhone(locale)
  // Los anclajes viven en la home: desde páginas internas se navega a /#seccion.
  const home = localePath(locale)
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image src="/logo-blue-bg.png" alt="ServiExpress JC" width={180} height={60} className="h-12 w-auto" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              ServiExpress <span className="text-yellow-accent">JC</span>
            </h3>
            <p className="text-primary-foreground/80 mb-4 leading-relaxed">
              {t("tagline")}
            </p>
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("quickLinksTitle")}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`${home}#inicio`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {tNav("inicio")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${home}#quienes-somos`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {tNav("quienesSomos")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${home}#servicios`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {tNav("servicios")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${home}#cobertura`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {tNav("cobertura")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">{t("servicesTitle")}</h4>
            <ul className="space-y-2">
              {serviceHrefs.map((href, i) => (
                <li key={href}>
                  <LocaleLink
                    href={href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {t(`services.${i}`)}
                  </LocaleLink>
                </li>
              ))}
              <li className="text-primary-foreground/80">{t("servicesExtra")}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("contactTitle")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-sm">
                  {t("addressLine1")}
                  <br />
                  {t("addressLine2")}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} className="flex-shrink-0" />
                <a
                  href={`tel:${phone.tel}`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {phone.display}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="flex-shrink-0" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/75">
          <p>&copy; {new Date().getFullYear()} ServiExpress JC LLC. {t("rights")}</p>
        </div>
      </div>
    </footer>
  )
}

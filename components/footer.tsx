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
    <footer className="border-t border-border bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Image src="/logo-white-bg.png" alt="ServiExpress JC" width={48} height={48} className="h-12 w-auto" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              ServiExpress <span className="text-primary">JC</span>
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {t("tagline")}
            </p>
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-border text-foreground/80 hover:border-primary/40 hover:text-primary flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-border text-foreground/80 hover:border-primary/40 hover:text-primary flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-border text-foreground/80 hover:border-primary/40 hover:text-primary flex items-center justify-center transition-colors"
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
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tNav("inicio")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${home}#quienes-somos`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tNav("quienesSomos")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${home}#servicios`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tNav("servicios")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${home}#cobertura`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
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
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(`services.${i}`)}
                  </LocaleLink>
                </li>
              ))}
              <li className="text-muted-foreground">{t("servicesExtra")}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("contactTitle")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="flex-shrink-0 mt-0.5 text-primary" />
                <span className="text-muted-foreground text-sm">
                  {t("addressLine1")}
                  <br />
                  {t("addressLine2")}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} className="flex-shrink-0 text-primary" />
                <a
                  href={`tel:${phone.tel}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {phone.display}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="flex-shrink-0 text-primary" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="break-all text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ServiExpress JC LLC. {t("rights")}</p>
        </div>
      </div>
    </footer>
  )
}

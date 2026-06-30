import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"

export function Footer() {
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
              Eficiencia sobre ruedas, compromiso sin fronteras
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/serviexpressjc1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/serviexpressjc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://linkedin.com/company/serviexpressjc"
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
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#inicio"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="#quienes-somos"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link
                  href="#servicios"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="#cobertura"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Cobertura
                </Link>
              </li>
              <li>
                <Link
                  href="#clientes"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Clientes
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Transporte Nacional</li>
              <li>Transporte Internacional</li>
              <li>Monitoreo GPS 24/7</li>
              <li>Servicio Puerta a Puerta</li>
              <li>Refaccionaria Los César</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-sm">
                  Carretera Mezquital Santa Rosa Km 05
                  <br />
                  Apodaca, N.L., México
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} className="flex-shrink-0" />
                <a
                  href="tel:+13463669867"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  +1 346 366 9867
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="flex-shrink-0" />
                <a
                  href="mailto:contacto@serviexpressjc.com.mx"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                >
                  contacto@serviexpressjc.com.mx
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/75">
          <p>&copy; {new Date().getFullYear()} ServiExpress JC LLC. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

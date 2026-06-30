import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Briefcase } from "lucide-react"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <RevealGroup className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Cotización */}
          <RevealChild className="h-full">
          <Card id="cotizacion" className="h-full p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h3 className="text-2xl font-bold mb-2">Solicita tu Cotización</h3>
            <p className="text-muted-foreground mb-6">
              Obtén una cotización personalizada para tus necesidades de transporte
            </p>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cot-nombre">Nombre completo</Label>
                  <Input id="cot-nombre" name="nombre" autoComplete="name" required placeholder="Ej. María Hernández" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cot-email">Correo electrónico</Label>
                  <Input id="cot-email" name="email" type="email" autoComplete="email" required placeholder="nombre@empresa.com" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cot-telefono">Teléfono</Label>
                  <Input id="cot-telefono" name="telefono" type="tel" autoComplete="tel" placeholder="Ej. 81 1234 5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cot-empresa">Empresa</Label>
                  <Input id="cot-empresa" name="empresa" autoComplete="organization" placeholder="Nombre de tu empresa" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cot-origen">Origen</Label>
                  <Input id="cot-origen" name="origen" placeholder="Ciudad de origen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cot-destino">Destino</Label>
                  <Input id="cot-destino" name="destino" placeholder="Ciudad de destino" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cot-detalles">Detalles de la carga</Label>
                <Textarea id="cot-detalles" name="detalles" rows={4} placeholder="Tipo, peso y dimensiones de la carga" />
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                Enviar solicitud
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </form>
          </Card>
          </RevealChild>

          {/* Postúlate */}
          <RevealChild className="h-full">
          <Card id="postulate" className="h-full p-8 bg-gradient-to-br from-secondary/5 to-primary/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Únete a Nuestro Equipo</h3>
                <p className="text-muted-foreground">Buscamos operadores certificados y personal comprometido</p>
              </div>
            </div>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="post-nombre">Nombre completo</Label>
                  <Input id="post-nombre" name="nombre" autoComplete="name" required placeholder="Ej. Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-email">Correo electrónico</Label>
                  <Input id="post-email" name="email" type="email" autoComplete="email" required placeholder="nombre@correo.com" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="post-telefono">Teléfono</Label>
                  <Input id="post-telefono" name="telefono" type="tel" autoComplete="tel" placeholder="Ej. 81 1234 5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-puesto">Puesto de interés</Label>
                  <Input id="post-puesto" name="puesto" placeholder="Ej. Operador B1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-experiencia">Tu experiencia</Label>
                <Textarea id="post-experiencia" name="experiencia" rows={4} placeholder="Cuéntanos sobre tu experiencia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-cv">Adjuntar CV (opcional)</Label>
                <Input id="post-cv" name="cv" type="file" accept=".pdf,.doc,.docx" />
              </div>
              <Button type="submit" className="w-full bg-transparent" size="lg" variant="outline">
                Enviar postulación
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </form>
          </Card>
          </RevealChild>
        </RevealGroup>

        {/* WhatsApp CTA */}
        <Reveal className="mt-12 text-center">
          <Card className="p-8 max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10">
            <h3 className="text-2xl font-bold mb-4">¿Necesitas ayuda inmediata?</h3>
            <p className="text-muted-foreground mb-6">Contáctanos por WhatsApp y te responderemos en minutos</p>
            <Button size="lg" className="bg-[#25D366] hover:bg-[#20BA5A] text-white">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Chatear en WhatsApp
            </Button>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}

import { Shield, Award, FileCheck, Truck } from "lucide-react"
import { useTranslations } from "next-intl"
import { Reveal } from "@/components/motion-primitives"

const certIcons = [Shield, Award, FileCheck, Truck]

export function CertificationsSection() {
  const t = useTranslations("Certifications")

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">{t("title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">{t("subtitle")}</p>
        </Reveal>

        <Reveal className="max-w-6xl mx-auto rounded-2xl border border-border bg-border overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
          {certIcons.map((Icon, index) => (
            <div key={index} className="group bg-card p-8 flex flex-col items-start gap-4 transition-colors duration-300 hover:bg-muted/40">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold leading-snug">{t(`items.${index}.title`)}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{t(`items.${index}.description`)}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

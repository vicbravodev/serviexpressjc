import type { ReactNode } from "react"
import { MessageCircle, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StatusMeta } from "@/lib/admin/meta"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./cells"
import { PageBody } from "./page-header"

// Piezas compartidas por las vistas de detalle (cotización, socio, postulación).

/** wa.me necesita lada de país; los teléfonos del sitio se capturan a 10 dígitos (México). */
function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "")
  // ponytail: asume México para 10 dígitos; si llegan números de EE. UU. sin lada, guardar la lada en el form.
  return `https://wa.me/${digits.length === 10 ? `52${digits}` : digits}`
}

export function DetailPage({
  folio,
  status,
  flag,
  title,
  subtitle,
  phone,
  fields,
  manage,
  history,
}: {
  folio: string
  status: StatusMeta
  /** Marca extra junto al estatus (p. ej. "Urgente"). */
  flag?: ReactNode
  title: string
  subtitle?: ReactNode
  phone?: string | null
  fields: ReactNode
  manage: ReactNode
  history: ReactNode
}) {
  return (
    <PageBody narrow>
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{folio}</span>
            <StatusBadge meta={status} />
            {flag}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {phone ? (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={`tel:${phone.replace(/\s/g, "")}`}>
                <Phone />
                Llamar
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={whatsappHref(phone)} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                WhatsApp
              </a>
            </Button>
          </div>
        ) : null}
      </header>

      {/* Escritorio: datos e historial a la izquierda, gestión fija a la derecha.
          Móvil: datos, gestión, historial. */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="det-datos" className="rounded-xl border bg-card p-5 lg:col-start-1">
          <h2 id="det-datos" className="mb-4 text-sm font-semibold">
            Datos de la solicitud
          </h2>
          {fields}
        </section>
        <aside className="lg:sticky lg:top-20 lg:col-start-2 lg:row-span-2 lg:row-start-1">{manage}</aside>
        <section aria-labelledby="det-historial" className="lg:col-start-1">
          <h2 id="det-historial" className="mb-3 text-sm font-semibold">
            Historial
          </h2>
          {history}
        </section>
      </div>
    </PageBody>
  )
}

export type Field = { label: string; value: ReactNode; wide?: boolean }

export function Fields({ items }: { items: Field[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
      {items.map((f) => (
        <div key={f.label} className={cn("flex flex-col gap-0.5", f.wide && "col-span-2")}>
          <dt className="text-xs text-muted-foreground">{f.label}</dt>
          <dd className="text-sm tabular-nums">{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}

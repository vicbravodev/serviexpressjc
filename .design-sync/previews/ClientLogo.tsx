import { ClientLogo } from "my-v0-project"

/* Wordmark fallback: the common state today, since most official logos are still
   pending. A clean typographic name inside the shared logo tile. */
export const Wordmark = () => (
  <div className="flex items-center justify-center rounded-xl border border-border bg-card px-8 py-10">
    <ClientLogo name="Ternium" alt="Logo de Ternium" />
  </div>
)

/* The real social-proof strip: several clients as wordmarks on a hairline grid,
   exactly how the section renders while logos are being collected. */
export const Franja = () => {
  const clientes = ["Ternium", "Serviacero", "Kingspan", "Papalotes", "Aceros VS", "SCX"]
  return (
    <div className="grid w-[520px] grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
      {clientes.map((name) => (
        <div key={name} className="flex items-center justify-center bg-card px-6 py-8">
          <ClientLogo name={name} alt={`Logo de ${name}`} />
        </div>
      ))}
    </div>
  )
}

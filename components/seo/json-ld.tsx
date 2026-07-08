/**
 * Inyecta un bloque JSON-LD. El escape de "<" evita cierre prematuro del
 * script si algún texto contuviera HTML.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}

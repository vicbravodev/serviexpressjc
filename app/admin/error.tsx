"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { PageBody } from "./_components/page-header"

// Fallo de consulta: se dice que falló, no se disfraza de lista vacía.
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PageBody>
      <div className="rounded-xl border bg-card">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No pudimos cargar esta vista</EmptyTitle>
            <EmptyDescription>
              Puede ser la conexión o el servicio de datos. Tus cambios guardados no se perdieron.
              {error.digest ? ` Referencia: ${error.digest}.` : null}
            </EmptyDescription>
          </EmptyHeader>
          <div className="flex gap-2">
            <Button onClick={reset}>Reintentar</Button>
            <Button variant="outline" asChild>
              <Link href="/admin">Ir al tablero</Link>
            </Button>
          </div>
        </Empty>
      </div>
    </PageBody>
  )
}

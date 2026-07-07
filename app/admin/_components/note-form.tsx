"use client"

import { useRef, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { addNote } from "@/lib/actions/admin"

export function NoteForm({ entityType, entityId }: { entityType: "load_request" | "job_application"; entityId: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  return (
    <div className="space-y-2">
      <textarea
        ref={ref}
        rows={3}
        placeholder="Agregar nota de seguimiento…"
        className="w-full rounded-md border border-border bg-background p-3 text-sm"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        onClick={() =>
          start(async () => {
            const v = ref.current?.value ?? ""
            if (!v.trim()) return
            setError(null)
            try {
              await addNote(entityType, entityId, v)
              if (ref.current) ref.current.value = ""
            } catch (e) {
              setError(e instanceof Error ? e.message : "Error")
            }
          })
        }
        disabled={pending}
      >
        {pending ? "Guardando…" : "Agregar nota"}
      </Button>
    </div>
  )
}

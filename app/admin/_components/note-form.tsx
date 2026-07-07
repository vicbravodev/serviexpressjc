"use client"

import { useRef, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { addNote } from "@/lib/actions/admin"

export function NoteForm({ entityType, entityId }: { entityType: "load_request" | "job_application"; entityId: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [pending, start] = useTransition()
  return (
    <div className="space-y-2">
      <textarea
        ref={ref}
        rows={3}
        placeholder="Agregar nota de seguimiento…"
        className="w-full rounded-md border border-border bg-background p-3 text-sm"
      />
      <Button
        onClick={() =>
          start(async () => {
            const v = ref.current?.value ?? ""
            if (!v.trim()) return
            await addNote(entityType, entityId, v)
            if (ref.current) ref.current.value = ""
          })
        }
        disabled={pending}
      >
        {pending ? "Guardando…" : "Agregar nota"}
      </Button>
    </div>
  )
}

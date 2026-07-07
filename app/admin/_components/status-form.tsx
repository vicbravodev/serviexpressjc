"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateLeadStatus, updateApplicationStatus } from "@/lib/actions/admin"

type Props =
  | { kind: "lead"; id: string; current: string; options: string[] }
  | { kind: "application"; id: string; current: string; options: string[] }

export function StatusForm(props: Props) {
  const [status, setStatus] = useState(props.current)
  const [lostReason, setLostReason] = useState("")
  const [pending, start] = useTransition()

  const submit = () =>
    start(async () => {
      if (props.kind === "lead") await updateLeadStatus(props.id, status, lostReason)
      else await updateApplicationStatus(props.id, status)
    })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {props.options.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
            className={
              "rounded-md border px-3 py-1.5 text-sm " +
              (status === s ? "border-foreground bg-foreground text-background" : "border-border")
            }
          >
            {s}
          </button>
        ))}
      </div>
      {props.kind === "lead" && status === "lost" ? (
        <Input
          value={lostReason}
          onChange={(e) => setLostReason(e.target.value)}
          placeholder="Motivo de la pérdida"
          className="h-10"
        />
      ) : null}
      <Button onClick={submit} disabled={pending || status === props.current && !(props.kind === "lead" && status === "lost")}>
        {pending ? "Guardando…" : "Actualizar status"}
      </Button>
    </div>
  )
}

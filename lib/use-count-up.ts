"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

/**
 * Roll-up numérico 0→target (o valor previo→target) con easeOutQuart.
 *
 * - SSR/HTML inicial: SIEMPRE el valor real (Google no debe indexar "0").
 * - El roll-up corre solo en cliente, como mejora visual.
 * - Bajo `prefers-reduced-motion` salta directo al valor final.
 * - Si `target` cambia, anima desde el valor mostrado hasta el nuevo target.
 *
 * @param target Valor destino, o null para deshabilitar (no numérico).
 * @param active Arranca la animación cuando pasa a true (p. ej. al entrar en viewport).
 */
export function useCountUp(target: number | null, active: boolean, duration = 1400) {
  const [value, setValue] = useState(target ?? 0)
  const fromRef = useRef(target ?? 0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (target === null || !active) return
    if (reduce) {
      setValue(target)
      fromRef.current = target
      return
    }
    const from = fromRef.current
    if (from === target) return
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const p = Math.min((now - start) / duration, 1)
      // easeOutQuart para un conteo decidido, desacelerando
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(Math.round(from + (target - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration, reduce])

  return value
}

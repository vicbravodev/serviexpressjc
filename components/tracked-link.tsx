"use client"

import { forwardRef, type AnchorHTMLAttributes } from "react"
import { trackEvent, type AnalyticsParams } from "@/lib/analytics"

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string
  params?: AnalyticsParams
}

/**
 * Ancla que emite un evento de analytics al hacer clic (GA4 + Vercel vía trackEvent).
 * Usa forwardRef para funcionar dentro de `<Button asChild>` (Radix Slot).
 */
export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(function TrackedLink(
  { event, params, onClick, children, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      onClick={(e) => {
        trackEvent(event, params)
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </a>
  )
})

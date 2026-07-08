// Extra bundle exports for design-sync previews: the i18n provider the custom
// sections need, plus the real Spanish messages so translated copy renders.
import "./process-shim"
export { NextIntlClientProvider } from "next-intl"
// The sonner `toast` emitter must come from the SAME module instance as the
// bundled <Toaster> — a preview importing "sonner" directly gets its own copy
// whose store the bundle's Toaster never sees.
export { toast } from "sonner"

// Stub Next.js app-router contexts so components using next/link prefetch or
// next-intl navigation (Header, LanguageSwitcher) can render outside Next.
// Must live in THIS bundle: a preview's own `next` import is a different
// module instance whose contexts the bundled components never read.
import * as React from "react"
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"
import {
  PathnameContext,
  SearchParamsContext,
} from "next/dist/shared/lib/hooks-client-context.shared-runtime"

const stubRouter = {
  push() {},
  replace() {},
  prefetch() {
    return Promise.resolve()
  },
  back() {},
  forward() {},
  refresh() {},
} as never

export const DsRouterProvider = ({ children }: { children?: React.ReactNode }) =>
  React.createElement(
    AppRouterContext.Provider,
    { value: stubRouter },
    React.createElement(
      PathnameContext.Provider,
      { value: "/" },
      React.createElement(
        SearchParamsContext.Provider,
        { value: new URLSearchParams() as never },
        children,
      ),
    ),
  )
import esMessages from "../messages/es.json"
export const DsMessages = esMessages

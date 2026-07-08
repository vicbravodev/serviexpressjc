import { DsRouterProvider, LanguageSwitcher } from "my-v0-project"

/* LanguageSwitcher reads next-intl navigation (usePathname/useRouter), which
   throws without an app router — DsRouterProvider stubs those contexts from
   inside the bundle. */

/* Solid variant: for the sticky header over a light background — muted idle
   labels, yellow accent on the active locale. */
export const Solido = () => (
  <DsRouterProvider>
    <div className="flex items-center justify-center rounded-xl border border-border bg-background px-8 py-6">
      <LanguageSwitcher solid={true} />
    </div>
  </DsRouterProvider>
)

/* Over-hero variant (solid=false): white/60 labels tuned for the dark hero
   video behind the transparent top bar. */
export const SobreHero = () => (
  <DsRouterProvider>
    <div className="flex items-center justify-center rounded-xl surface-steel px-8 py-6">
      <LanguageSwitcher solid={false} />
    </div>
  </DsRouterProvider>
)

# design-sync notes — servi-express-landing-page

Repo-specific gotchas for future syncs. This is an app repo (Next.js 15 landing
page), not a packaged library — the sync runs in synth-entry mode.

- **Self-link required**: `node_modules/my-v0-project` must be a symlink to the
  repo root (`ln -sfn ../. node_modules/my-v0-project`). pnpm may drop it on
  install — recreate before building. Without it the converter dies reading
  `node_modules/my-v0-project/package.json`.
- **buildCmd compiles Tailwind v4**: `node .design-sync/build-css.mjs` compiles
  `app/globals.css` (via `.design-sync/tw-entry.css`) into
  `.design-sync/.cache/compiled.css` = `cfg.cssEntry`. Re-run it whenever
  `app/globals.css` or any component/preview classes change. `styles/globals.css`
  is a stale v0 leftover — the app imports `app/globals.css`; ignore styles/.
- **process shim**: Next client internals (next/link, next/image) and
  `lib/site.ts` read `process.env` at module init. `.design-sync/process-shim.ts`
  (imported first from `ds-extras.ts`; extraEntries execute before the main
  synth entry) defines `window.process`. Without it every card throws
  `process is not defined`.
- **source-kit fork**: `.design-sync/overrides/source-kit.mjs` excludes legacy
  `components/ui/toast.tsx` + `toaster.tsx` from the synth barrel — both export
  `Toaster` (collides with `ui/sonner.tsx`); esbuild drops ambiguous names and
  `window.ServiExpressDS.Toaster` came out undefined. The sonner Toaster is the
  shipped one. Fork needs `.design-sync/node_modules → ../.ds-sync/node_modules`
  symlink (fresh-clone setup) for its bare `ts-morph` import.
- **Fonts**: Geist/Geist Mono woff2 harvested from `.next/static/media` (the
  app's own next/font build output) into `.design-sync/fonts/` + `geist.css`.
  The metric-adjusted `local("Arial")` fallback faces ship via `tw-entry.css`
  (the extraFonts parser only carries url() faces).
- **Component curation**: discovery finds ~304 PascalCase exports (every shadcn
  subcomponent). `componentSrcMap` nulls all subcomponents — cards exist only
  for the ~70 family primaries + brand components + page sections. Subcomponents
  still ship as bundle exports. Groups come from stub docs in
  `.design-sync/docs/<kebab>.md` (frontmatter `category:`).
- **Playwright**: chromium cache pins build 1228 → playwright 1.61.0 in .ds-sync.
- **A failed build validates stale output**: always check the build's own exit
  before reading validate results (a fork import error left ds-bundle stale once).

## Preview-authoring knowledge (from wave 1)

- The capture harness screenshots each cell's DOM subtree statically after
  networkidle — no clicks/hovers. Overlays must be OPEN at render: Dialog/
  AlertDialog/Sheet/Drawer/DropdownMenu → `open modal={false}`; Popover/
  HoverCard → `open`; Menubar → `defaultValue` + `MenubarMenu value`;
  ContextMenu has NO open prop — dispatch a synthetic `contextmenu` MouseEvent
  from a mount effect at the trigger's center. Wrap overlay stories in
  `min-h-80/96` with the trigger at the top so downward content isn't clipped.
- sonner `toast()` in a preview MUST be imported from "my-v0-project" (the
  bundle re-exports it via ds-extras.ts). Importing "sonner" directly bundles a
  second module instance whose store the bundle's <Toaster> never sees — blank
  cells that look like a portal/capture problem but aren't.
- Previews may use React hooks (`import * as React from "react"` — react is
  externalized to window.React).
- Tailwind classes must exist in the compiled CSS: safelist in tw-entry.css
  covers common utilities (h-1..h-3 added after a Skeleton h-3 collapse);
  prefer values the library already uses.
- Spinner inherits currentColor — needs `text-primary` for brand color.
- ToggleGroup default variant overflows with text labels; prefer
  `variant="outline"` + px-3 items in previews.
- Components needing explicit size to be visible: ChartContainer
  (`min-h-[220px] w-full`), ScrollArea (h-48), ResizablePanelGroup (h-64),
  Carousel (max-w-*), AspectRatio (wrapper width).
- `pnpm install` (pnpm 11) scaffolds a template `pnpm-workspace.yaml`
  (allowBuilds placeholders) — deleted; it's not repo content and its literal
  "set this to true or false" values are invalid config.

## Preview-authoring knowledge (from wave 2)

- Motion-gated content (Reveal/whileInView/useInView, framer `motion/react`):
  the capture's frozen clock never settles entrance animations. Fix at the
  PREVIEW level: seed a `matchMedia` stub returning matches:true for
  prefers-reduced-motion at module top (the components' own reduce branch
  renders the settled frame). `<MotionConfig reducedMotion="always">` does NOT
  work — the bundled components resolve their own motion instance. StatsSection
  ignores reduce for opacity (useInView-gated) → its preview pins final frames
  with `[style*="opacity"] { opacity:1!important }` CSS.
- Router-bound components (Header, LanguageSwitcher — next-intl usePathname/
  useRouter): wrap the preview in `DsRouterProvider` (exported from
  ds-extras.ts — stubs AppRouterContext/PathnameContext/SearchParamsContext
  from the bundle's own next instance; a preview importing `next` directly gets
  a different module instance whose contexts never reach the components).
- `surface-steel` and `bg-blueprint` both set background-image — layer them on
  NESTED elements, never the same node (blueprint silently replaces the steel
  gradient).
- Arbitrary-value utilities (w-[420px]) are NOT in the compiled CSS — use
  standard scale (w-72/80/96).
- Sidebar: use `collapsible="none"` + h-96 container (renders inline, avoids
  the fixed/hidden-md branch); NavigationMenu opens statically via
  `defaultValue` + `NavigationMenuItem value` + `viewport={false}`.
- Sections with -mt-* hero overlap (StatsSection): neutralize with
  `section { margin-top: 0 !important }` in the preview.
- public/ assets (logos, fleet photos) 404 in cards — components degrade to
  their designed fallbacks (FleetImage steel panel, logo alt text); expected.

## Known render warns

- `[TOKENS_MISSING] --radix-navigation-menu-viewport-*, --radix-toast-swipe-*` —
  set at runtime by Radix, expected absent from static stylesheets.

## Re-sync risks

- `.next/static` fonts: harvest source disappears if `.next` is cleaned; the
  copies in `.design-sync/fonts/` are committed, so only re-harvest on a Geist
  version change.
- `DsMessages` inlines `messages/es.json` via `$ref` module `ds-extras.ts` —
  stays fresh automatically (bundled from source at build time).
- The compiled Tailwind CSS only contains classes used in repo sources +
  authored previews. Classes a design agent invents that appear nowhere in the
  repo won't resolve — conventions header must steer it to existing vocabulary.
- Sections (Header, Footer, HeroSection…) render through next/link / next/image
  in a non-Next runtime; verified today but a Next major bump could change
  client-side behavior — re-check those cards on Next upgrades.

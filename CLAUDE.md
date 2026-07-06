# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Landing page for **ServiExpress JC**, a Mexico–USA freight carrier (founded 2005). Single-page marketing site whose goal is to convert **two equal audiences**: B2B quote requests (shippers, 3PLs, brokers) and driver job applications. The design *is* the product — see `PRODUCT.md` (brand, audiences, principles) and `DESIGN.md` (full design system: colors, type, elevation, do's/don'ts). Read both before any visual or copy change.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`).

```bash
pnpm dev      # local dev server (Next.js)
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # eslint
```

There is **no test suite**. Note `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`. The `ignoreBuildErrors` flag is load-bearing: `next-intl` types `locale` as `string` while its APIs want the `"es" | "en"` union, so `tsc --noEmit` currently reports errors in `layout.tsx` / `page.tsx`. Don't flip the flag off without first fixing that locale typing, or the build breaks.

## Stack

Next.js 15 App Router · React 19 · Tailwind v4 (CSS-first, no `tailwind.config`) · shadcn/ui (new-york style, in `components/ui/`) · `next-intl` v4 · `motion` (Framer Motion) · deployed on Vercel. Path alias `@/*` maps to repo root.

## Architecture

### Single page, section components
The entire site is one route. `app/[locale]/page.tsx` composes the page by stacking section components from `components/` in order (Hero → Stats → Services → Coverage → Certifications → Talleres → About → SocialProof → CTA), wrapped by `Header`/`Footer`. To edit a part of the page, find its section component in `components/` — they map 1:1 to visible sections. `components/ui/` is shadcn primitives; don't confuse the two.

`app/[locale]/layout.tsx` owns fonts (Geist / Geist Mono via `next/font`), `<html lang>`, the `NextIntlClientProvider`, SEO metadata, and the JSON-LD `Organization`/`LocalBusiness` block. `app/[locale]/[...rest]/page.tsx` is a catch-all that 404s unknown paths under a valid locale.

### i18n is load-bearing (next-intl)
Locales are `es` (default) and `en`, configured in `i18n/routing.ts`. Key rules:
- **Spanish always wins by default** — `localeDetection: false` is intentional; do not re-enable browser detection. Visitors switch to English only via the switcher or by visiting `/en`.
- `localePrefix: "as-needed"` → Spanish lives at the root (`/`), English at `/en`.
- **All user-facing copy lives in `messages/es.json` and `messages/en.json`**, never hardcoded in components. Both files must stay key-for-key in sync. Namespaces are per-section (`Hero`, `Services`, `Quote`, …). `global.d.ts` types messages against `es.json`, so a key present in `es` but missing in `en` is a real bug.
- `middleware.ts` runs the next-intl middleware on everything except `api`, Next internals, and files with a dot.
- Use navigation helpers from `i18n/navigation.ts` (`Link`, `useRouter`, `usePathname`), **not** `next/link` / `next/navigation` directly, so locale prefixing stays correct.
- Server components call `setRequestLocale(locale)` before reading translations (see `page.tsx`/`layout.tsx`).

### Single source of truth: `lib/site.ts`
Business constants live here and must be imported, never duplicated:
- **Years in business are always computed** from `FOUNDING_YEAR` (2005) via `yearsInService()` and passed into copy through the ICU `{years}` param. Never hardcode "20+ años" anywhere.
- Contact phones are **locale- and route-dependent**: `contactPhone(locale)` → Spanish shows the Mexico number, English shows the USA number.
- WhatsApp routing splits by service type: **national quotes → Mexico WhatsApp (`WHATSAPP_PHONE_MX`), international quotes → USA WhatsApp (`WHATSAPP_PHONE_US`)**. Phone numbers are overridable via `NEXT_PUBLIC_*` env vars without a redeploy. Build links with `whatsappUrl(text, phone)`.
- Also holds `SITE_URL`, `ADDRESS` (incl. `postalCode`), `GEO`, `OPEN_24H`, `SOCIAL_LINKS`, `CONTACT_EMAIL`. `ADDRESS`/`GEO`/`OPEN_24H` feed the LocalBusiness JSON-LD and must stay consistent with the Google Business Profile (NAP consistency is a local-SEO ranking factor).

### Quote simulator: `lib/quote.ts` + `components/quote-simulator.tsx`
Self-service price estimator. City lists (`MX_CITIES`, `US_CITIES`) carry lat/lng; `estimateQuote()` computes a haversine distance × road factor and applies `RATE_CONFIG` (per-km rates by unit type, border fee for international, ± spread → a min/max range in MXN or USD). These are **orientation-only estimates**; a real agent finalizes the price. The simulator's CTA hands off to the correct WhatsApp line based on `service` (national vs international) per the routing rule above.

> Broader business context (per project memory): tariffs derive from a real Ternium rate sheet +15%, maintained via a gitignored xlsx and a `scripts/gen-tariff.py` generator that currently lives only in an unmerged worktree branch, not on `main`. Confirm current rate provenance before editing `RATE_CONFIG` numbers.

### Coverage map: generated, committed geometry
`components/coverage-section.tsx` renders a real geographic North-America SVG map. The geometry (`components/coverage-geo.ts`) is **generated output** produced by `scripts/gen-coverage-geo.mjs` and committed so runtime ships no map libraries (d3/topojson). Do not hand-edit `coverage-geo.ts`; regenerate it by following the header comment in the script (run from a scratch dir so d3 stays out of app deps).

### Images with graceful fallback: `FleetImage`
`components/fleet-image.tsx` renders real fleet/driver photos and, on load error, degrades to a blueprint-styled panel with a mono caption so layouts never look broken while assets are pending. Fleet photos live in `public/fleet/`, client logos in `public/clients/`. The convention matters — prefer `FleetImage` over raw `<img>` for fleet imagery. Note it uses a plain `<img>` (not `next/image`) and `next.config.mjs` has `images.unoptimized: true`, so images are served as-is; migrating to `next/image` is the pending win for Core Web Vitals.

## Design system enforcement (from DESIGN.md)

Theme tokens are CSS variables in `app/globals.css` (Tailwind v4 `@theme`); colors are oklch. When styling, honor the named rules — they're the brand:
- **One blue** (Azul Ruta) carries identity; **amber (Ámbar Señal) is scarce signal**, at most one accent per screen — never decoration.
- **Flat at rest**: cards get elevation only on hover, never a permanent shadow.
- **No gradient text** (`background-clip: text` is banned); emphasize with solid amber or weight within Geist.
- **No em dashes in copy** — use commas, colons, semicolons or parentheses.
- Real fleet/driver photography over stock; mobile is first-class, not a desktop reduction.
- Anti-references to avoid: SaaS/startup look (purple gradients, glassmorphism, hero-metric template, identical card grids), generic-carrier clichés (sunset-truck stock, flat corporate blue), cheap/amateur, cold-corporate.

Accessibility target is WCAG 2.1 AA: keyboard nav, visible focus, and `prefers-reduced-motion` collapses all motion to static states.

## Deploy workflow

Production branch is `main` (auto-deploys to prod via Vercel Git integration on GitHub `vicbravodev/serviexpressjc`). **Never push directly to `main`.** Do all work on a branch → open a PR → Vercel posts a Preview Deployment + status check → review on the preview URL → merge to `main` for production.

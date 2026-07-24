# Motion — transiciones smooth y modernas

**Fecha:** 2026-07-23
**Objetivo:** integrar Motion donde haga sentido para que la landing se sienta actual y profesional, con intensidad **sutil**. Reutiliza el sistema existente (`components/motion-primitives.tsx`, easing `[0.16,1,0.3,1]`, `useReducedMotion`). No introduce rebotes ni springs agresivos. Respeta `prefers-reduced-motion` (ya hay un bloque global que neutraliza animaciones CSS).

## Alcance aprobado

1. Skeleton shimmer (base + mapa de cobertura)
2. Cotizador animado
3. Header hide-on-scroll + menú móvil animado
4. Micro-interacciones globales (hover/tap en botones y tarjetas)

## 1. Skeleton shimmer

- **`app/globals.css`**: nueva keyframe `shimmer` (barrido de `background-position`) + utilidad `.animate-shimmer` con gradiente diagonal sobre `surface`. Cae a estático bajo reduced-motion (bloque global existente).
- **`components/ui/skeleton.tsx`**: reemplazar `animate-pulse` por `animate-shimmer` (mismo API, sin cambios de consumidores).
- CSS puro, sin runtime JS.

## 2. Placeholder del mapa + crossfade

- **`components/coverage-lazy.tsx`**: el bloque placeholder usa el shimmer nuevo. Al montar `CoverageSection`, crossfade con `AnimatePresence` (skeleton `opacity→0`, mapa `opacity 0→1, y 8→0`, 0.5s expo-out). Mantener `min-h` para no meter CLS y conservar ancla `#cobertura`.

## 3. Cotizador animado

- **`lib/use-count-up.ts`** (nuevo): extraer el `useCountUp` que hoy vive en `stats-section.tsx` a un hook compartido; stats lo importa desde ahí (sin cambio de comportamiento).
- **`components/quote-simulator.tsx`**:
  - Bloque de resumen: `AnimatePresence` entre estado vacío y "listo" (`opacity + y`, expo-out).
  - Filas del `<dl>`: stagger 0.06s (variants inline o `RevealGroup/Child`).
  - Distancia en km: roll-up con `useCountUp` al cambiar de valor.
  - Aviso "contacto requerido" y botón de envío: entran/salen con `AnimatePresence`.

## 4. Header + menú móvil

- **`components/header.tsx`**:
  - Convertir `<header>` en `motion.header`. Hide-on-scroll con `useScroll`/`useMotionValueEvent`: oculta (`y: "-100%"`) al bajar, reaparece (`y: 0`) al subir, transición suave (no spring rebotante). Mantener el sentinel de `isScrolled` para el fondo.
  - Menú móvil: envolver en `AnimatePresence` para animar apertura **y** cierre (height/opacity), stagger de items con variants (reemplaza `animationDelay` + `.animate-slide-in`).
  - Todo con `useReducedMotion`: sin ocultar el header ni animar altura si el usuario lo pide.

## 5. Micro-interacciones globales

- **`components/motion-primitives.tsx`**: nuevo `MotionCard` (o helper `hoverLift`) con `whileHover={{ y: -2 }}` + sombra y `whileTap={{ scale: 0.98 }}`, transición 0.2s, reduced-motion-aware.
- Aplicar a tarjetas de **servicios** (`services-section.tsx`) y **talleres** (`talleres-section.tsx`) y a los CTA principales.

## Principios transversales

- Easing único `[0.16,1,0.3,1]`; duraciones 0.2–0.6s.
- Solo `transform`/`opacity` (nada que dispare layout).
- `useReducedMotion` en toda pieza con JS; fallback estático.
- No romper SSR/SEO (contadores ya renderizan el valor real en HTML).

## Verificación

- Dev server + browser: revisar shimmer, crossfade del mapa, resumen del cotizador, header hide/show, menú móvil, hover de tarjetas.
- Consola sin errores; `prefers-reduced-motion` (emulado) desactiva movimiento.

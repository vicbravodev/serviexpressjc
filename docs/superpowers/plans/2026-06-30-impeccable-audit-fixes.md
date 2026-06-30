# Impeccable Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolver todos los hallazgos del `/impeccable audit` (P1 a P3) de la landing de ServiExpress JC para subir el Audit Health Score de 14/20 a 18+/20.

**Architecture:** Cambios localizados por componente sobre una landing Next.js 15 (App Router, RSC) con Tailwind v4 + shadcn/ui. No se introduce arquitectura nueva: se corrigen accesibilidad de formularios, contraste de tokens OKLCH, performance de medios, un anti-patrón de layout y targets táctiles. Se reusa el componente `Label` de shadcn (ya presente) y los tokens existentes en `app/globals.css`.

**Tech Stack:** Next.js 15.5.9, React 19, Tailwind v4 (`@tailwindcss/postcss`), shadcn/ui, lucide-react, motion 12 (`motion/react`), Geist (`next/font`), pnpm.

## Global Constraints

- **WCAG 2.1 AA**: contraste de texto normal ≥ 4.5:1, texto grande (≥18px bold / ≥24px) ≥ 3:1, controles e iconografía ≥ 3:1. Foco visible en todo control.
- **Color en OKLCH**: nunca `#000` ni `#fff`; todo neutro tintado hacia el azul (chroma 0.005–0.015). Token canónico en `app/globals.css`; no duplicar valores fuera de ahí.
- **Un solo acento (Ámbar Señal)**, escaso. No introducir colores nuevos. Excepción permitida: verde WhatsApp `#25D366` (solo su botón).
- **Sin gradient text** (`background-clip: text`), **sin side-stripe borders** (`border-left/right` > 1px de color), **sin em dashes** en copy visible (usar comas, dos puntos, paréntesis).
- **Copy en español es-MX.** Iconos solo de `lucide-react`.
- **Motion respeta `prefers-reduced-motion`** (ya implementado vía `useReducedMotion` + bloque CSS en `globals.css`); no romperlo.
- **Verificación (este repo no tiene test runner):** cada tarea se valida con (a) aserciones `grep`/`node` sobre el código, (b) `pnpm build`, y/o (c) checks en navegador vía el preview MCP (`preview_start`, `preview_eval`, `preview_screenshot`). No agregar jest/vitest: no está en el alcance.

---

## File Structure

- `components/cta-section.tsx` — Tarea 1: los dos formularios accesibles (cotización + postúlate).
- `app/globals.css` — Tarea 2: tokens de contraste AA (`--muted-foreground`, `--secondary`).
- `components/footer.tsx` — Tarea 2 (opacidad copyright) + Tarea 4 (iconos sociales 44px).
- `DESIGN.md` + `.impeccable/design.json` — Tarea 2: sincronizar el valor de `azul-ruta-claro` con el token corregido.
- `components/header.tsx` — Tarea 3: `aria-expanded`/`aria-controls` + target táctil del menú móvil.
- `components/clients-section.tsx`, `components/coverage-section.tsx` — Tarea 4: `loading="lazy"` + alt descriptivo.
- `components/hero-section.tsx` — Tarea 5: estrategia de carga del video.
- `components/features-section.tsx` — Tarea 6: romper el grid de cards idénticas.
- `public/` + `components/hero-section.tsx` + `components/coverage-section.tsx` — Tarea 7 (opcional, depende de assets reales).

---

## Task 1: Formularios accesibles (P1)

**Files:**
- Modify: `components/cta-section.tsx` (imports + ambos `<form>`, líneas 1-6 y 20-70)

**Interfaces:**
- Consumes: `Label` de `@/components/ui/label` (firma `React.ComponentProps<typeof LabelPrimitive.Root>`, acepta `htmlFor`), `Input` (`React.ComponentProps<'input'>`, acepta `id`/`name`/`required`), `Textarea` (acepta `id`/`name`).
- Produces: nada que consuman otras tareas.

- [ ] **Step 1: Escribir la verificación (debe fallar con el código actual)**

```bash
node -e "const s=require('fs').readFileSync('components/cta-section.tsx','utf8');
const inputs=(s.match(/<Input/g)||[]).length;
const textareas=(s.match(/<Textarea/g)||[]).length;
const ids=(s.match(/\bid=\"(cot|post)-/g)||[]).length;
const htmlFor=(s.match(/htmlFor=\"(cot|post)-/g)||[]).length;
const fields=inputs+textareas;
console.log({fields, ids, htmlFor});
if(ids<fields||htmlFor<fields){console.error('FAIL: faltan id/label en campos');process.exit(1)}
console.log('PASS');"
```

- [ ] **Step 2: Correr la verificación y confirmar que FALLA**

Run: el comando del Step 1.
Expected: `FAIL: faltan id/label en campos` (hoy 0 ids/htmlFor para 13 campos).

- [ ] **Step 3: Agregar el import de `Label`**

En `components/cta-section.tsx`, reemplazar la línea 3:

```tsx
import { Input } from "@/components/ui/input"
```

por:

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
```

- [ ] **Step 4: Reemplazar el `<form>` de Cotización**

Reemplazar el bloque actual (líneas 20-36, desde `<form className="space-y-4">` hasta `</form>` del primer Card) por:

```tsx
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cot-nombre">Nombre completo</Label>
                  <Input id="cot-nombre" name="nombre" autoComplete="name" required placeholder="Ej. María Hernández" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cot-email">Correo electrónico</Label>
                  <Input id="cot-email" name="email" type="email" autoComplete="email" required placeholder="nombre@empresa.com" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cot-telefono">Teléfono</Label>
                  <Input id="cot-telefono" name="telefono" type="tel" autoComplete="tel" placeholder="Ej. 81 1234 5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cot-empresa">Empresa</Label>
                  <Input id="cot-empresa" name="empresa" autoComplete="organization" placeholder="Nombre de tu empresa" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cot-origen">Origen</Label>
                  <Input id="cot-origen" name="origen" placeholder="Ciudad de origen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cot-destino">Destino</Label>
                  <Input id="cot-destino" name="destino" placeholder="Ciudad de destino" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cot-detalles">Detalles de la carga</Label>
                <Textarea id="cot-detalles" name="detalles" rows={4} placeholder="Tipo, peso y dimensiones de la carga" />
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                Enviar solicitud
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </form>
```

- [ ] **Step 5: Reemplazar el `<form>` de Postúlate**

Reemplazar el bloque actual (líneas 52-70, desde `<form className="space-y-4">` hasta `</form>` del segundo Card) por:

```tsx
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="post-nombre">Nombre completo</Label>
                  <Input id="post-nombre" name="nombre" autoComplete="name" required placeholder="Ej. Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-email">Correo electrónico</Label>
                  <Input id="post-email" name="email" type="email" autoComplete="email" required placeholder="nombre@correo.com" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="post-telefono">Teléfono</Label>
                  <Input id="post-telefono" name="telefono" type="tel" autoComplete="tel" placeholder="Ej. 81 1234 5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-puesto">Puesto de interés</Label>
                  <Input id="post-puesto" name="puesto" placeholder="Ej. Operador B1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-experiencia">Tu experiencia</Label>
                <Textarea id="post-experiencia" name="experiencia" rows={4} placeholder="Cuéntanos sobre tu experiencia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-cv">Adjuntar CV (opcional)</Label>
                <Input id="post-cv" name="cv" type="file" accept=".pdf,.doc,.docx" />
              </div>
              <Button type="submit" className="w-full bg-transparent" size="lg" variant="outline">
                Enviar postulación
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </form>
```

- [ ] **Step 6: Correr la verificación y confirmar que PASA**

Run: el comando del Step 1.
Expected: `{ fields: 13, ids: 13, htmlFor: 13 }` y `PASS`.

- [ ] **Step 7: Confirmar que compila**

Run: `pnpm build`
Expected: build exitoso, sin errores de tipo en `cta-section.tsx`.

- [ ] **Step 8: Commit**

```bash
git add components/cta-section.tsx
git commit -m "fix(a11y): asociar labels e ids a los campos de los formularios de cotización y postulación"
```

---

## Task 2: Contraste AA en tokens y CTAs (P1)

**Files:**
- Modify: `app/globals.css:21` (`--muted-foreground`), `app/globals.css:18` (`--secondary`)
- Modify: `components/footer.tsx` (opacidad del copyright)
- Modify: `DESIGN.md` (frontmatter `azul-ruta-claro`), `.impeccable/design.json` (`colorMeta.azul-ruta-claro.canonical`)

**Interfaces:**
- Consumes: nada.
- Produces: tokens `--muted-foreground` y `--secondary` corregidos; los consumen todas las secciones vía clases `text-muted-foreground` y `bg-secondary`/`text-secondary`.

- [ ] **Step 1: Escribir la verificación de contraste en navegador**

Crear `scratchpad/contrast-check.js` (script que el ejecutor pega en `preview_eval`):

```js
// Pegar como expression en preview_eval. Devuelve los ratios a verificar.
(()=>{
  function lum(rgb){const c=rgb.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]}
  function parse(s){const m=s.match(/[\d.]+/g).map(Number);return [m[0],m[1],m[2]]}
  function ratio(a,b){const L1=lum(parse(a)),L2=lum(parse(b));const hi=Math.max(L1,L2),lo=Math.min(L1,L2);return +((hi+0.05)/(lo+0.05)).toFixed(2)}
  // texto secundario sobre su fondo
  const p=[...document.querySelectorAll('.text-muted-foreground')].find(e=>e.offsetParent);
  const pBg=getComputedStyle(p.closest('section')||document.body).backgroundColor;
  const muted=ratio(getComputedStyle(p).color, pBg.includes('rgba(0, 0, 0, 0)')?'rgb(252,252,252)':pBg);
  // CTA: texto sobre fondo del botón
  const cta=[...document.querySelectorAll('button,a')].find(e=>/cotización|solicitud/i.test(e.textContent)&&getComputedStyle(e).backgroundColor!=='rgba(0, 0, 0, 0)');
  const ctaR=ratio(getComputedStyle(cta).color, getComputedStyle(cta).backgroundColor);
  return JSON.stringify({muted, cta:ctaR, mutedPass:muted>=4.5, ctaPass:ctaR>=4.5});
})()
```

- [ ] **Step 2: Correr la verificación y confirmar que FALLA**

Run: `preview_start` (name `dev`), luego `preview_eval` con el contenido de `scratchpad/contrast-check.js`.
Expected: `mutedPass:false` (≈4.0) y/o `ctaPass:false` (≈3.6) con los valores actuales.

- [ ] **Step 3: Oscurecer `--muted-foreground` (modo claro)**

En `app/globals.css`, reemplazar la línea 21:

```css
  --muted-foreground: oklch(0.5 0.01 240);
```

por:

```css
  --muted-foreground: oklch(0.42 0.012 240);
```

- [ ] **Step 4: Oscurecer `--secondary` (modo claro) para que el texto blanco de los CTAs pase AA**

En `app/globals.css`, reemplazar la línea 18:

```css
  --secondary: oklch(0.55 0.12 264);
```

por:

```css
  --secondary: oklch(0.42 0.14 264);
```

- [ ] **Step 5: Subir la opacidad del copyright del footer**

En `components/footer.tsx`, reemplazar:

```tsx
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
```

por:

```tsx
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/75">
```

- [ ] **Step 6: Sincronizar la documentación del token**

En `DESIGN.md`, en el frontmatter, reemplazar:

```yaml
  azul-ruta-claro: "oklch(0.55 0.12 264)"
```

por:

```yaml
  azul-ruta-claro: "oklch(0.42 0.14 264)"
```

En `DESIGN.md`, sección `## 2. Colors`, reemplazar el valor en la línea de Azul Ruta Claro:

```markdown
- **Azul Ruta Claro** (`oklch(0.55 0.12 264)`): variante más luminosa del mismo azul. Es el color de los **CTAs primarios**
```

por:

```markdown
- **Azul Ruta Claro** (`oklch(0.42 0.14 264)`): variante del azul, oscurecida para que el texto blanco de los **CTAs primarios** pase contraste AA. Es el color de los CTAs
```

En `.impeccable/design.json`, reemplazar `"canonical": "oklch(0.55 0.12 264)"` (dentro de `azul-ruta-claro`) por `"canonical": "oklch(0.42 0.14 264)"`.

- [ ] **Step 7: Correr la verificación y confirmar que PASA**

Run: recargar el preview (`preview_eval` con `window.location.reload()`), esperar, y re-correr el script del Step 1.
Expected: `mutedPass:true` y `ctaPass:true` (ambos ≥4.5).

- [ ] **Step 8: Commit**

```bash
git add app/globals.css components/footer.tsx DESIGN.md .impeccable/design.json
git commit -m "fix(a11y): oscurecer muted-foreground y secondary para cumplir contraste WCAG AA"
```

---

## Task 3: Accesibilidad del menú móvil (P2)

**Files:**
- Modify: `components/header.tsx` (botón hamburguesa + contenedor del menú móvil + targets táctiles de los links móviles)

**Interfaces:**
- Consumes: estado `isMobileMenuOpen` (ya existe en el componente).
- Produces: nada.

- [ ] **Step 1: Escribir la verificación**

```bash
node -e "const s=require('fs').readFileSync('components/header.tsx','utf8');
const checks={ariaExpanded:/aria-expanded=\{isMobileMenuOpen\}/.test(s), ariaControls:/aria-controls=\"mobile-menu\"/.test(s), menuId:/id=\"mobile-menu\"/.test(s)};
console.log(checks);
if(!checks.ariaExpanded||!checks.ariaControls||!checks.menuId){console.error('FAIL');process.exit(1)}
console.log('PASS');"
```

- [ ] **Step 2: Correr la verificación y confirmar que FALLA**

Run: comando del Step 1.
Expected: `FAIL` (hoy el botón solo tiene `aria-label`).

- [ ] **Step 3: Agregar `aria-expanded` y `aria-controls` al botón hamburguesa**

En `components/header.tsx`, reemplazar:

```tsx
          <button
            className={`md:hidden p-2 transition-colors duration-300 ${solid ? "text-foreground" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
```

por:

```tsx
          <button
            className={`md:hidden p-2 transition-colors duration-300 ${solid ? "text-foreground" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
```

- [ ] **Step 4: Darle `id` al contenedor del menú móvil y agrandar el target táctil de los links**

En `components/header.tsx`, reemplazar:

```tsx
          <div className="md:hidden py-4 border-t border-border animate-slide-in">
```

por:

```tsx
          <div id="mobile-menu" className="md:hidden py-4 border-t border-border animate-slide-in">
```

Y en el `Link` de cada item del menú móvil, reemplazar `py-1` por `py-3` para alcanzar ~44px de altura táctil:

```tsx
                  className={`relative text-base font-medium text-foreground/80 hover:text-foreground transition-colors py-1 group ${
```

por:

```tsx
                  className={`relative text-base font-medium text-foreground/80 hover:text-foreground transition-colors py-3 group ${
```

- [ ] **Step 5: Correr la verificación y confirmar que PASA**

Run: comando del Step 1.
Expected: `{ ariaExpanded: true, ariaControls: true, menuId: true }` y `PASS`.

- [ ] **Step 6: Verificar build**

Run: `pnpm build`
Expected: build exitoso.

- [ ] **Step 7: Commit**

```bash
git add components/header.tsx
git commit -m "fix(a11y): aria-expanded/aria-controls en el menú móvil y targets táctiles de 44px"
```

---

## Task 4: Performance de imágenes, alt text y targets táctiles (P2/P3)

**Files:**
- Modify: `components/clients-section.tsx` (alt descriptivo + `loading="lazy"`)
- Modify: `components/coverage-section.tsx` (`loading="lazy"` en el mapa)
- Modify: `components/footer.tsx` (iconos sociales a 44px)

**Interfaces:**
- Consumes: nada.
- Produces: nada.

- [ ] **Step 1: Escribir la verificación**

```bash
node -e "const fs=require('fs');
const c=fs.readFileSync('components/clients-section.tsx','utf8');
const cov=fs.readFileSync('components/coverage-section.tsx','utf8');
const f=fs.readFileSync('components/footer.tsx','utf8');
const checks={
  clientsLazy:/loading=\"lazy\"/.test(c),
  coverageLazy:/loading=\"lazy\"/.test(cov),
  altDescriptivo:/alt=\{\`Logotipo de/.test(c),
  socialSize:(f.match(/w-11 h-11/g)||[]).length>=3
};
console.log(checks);
if(Object.values(checks).some(v=>!v)){console.error('FAIL');process.exit(1)}
console.log('PASS');"
```

- [ ] **Step 2: Correr la verificación y confirmar que FALLA**

Run: comando del Step 1.
Expected: `FAIL` (hoy sin lazy, alt genérico, iconos `w-10 h-10`).

- [ ] **Step 3: Logos de clientes: alt descriptivo + lazy**

En `components/clients-section.tsx`, reemplazar:

```tsx
              <img
                src={client.logo || "/placeholder.svg"}
                alt={client.name}
                className="max-w-full h-12 md:h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
```

por:

```tsx
              <img
                src={client.logo || "/placeholder.svg"}
                alt={`Logotipo de ${client.name}`}
                loading="lazy"
                decoding="async"
                className="max-w-full h-12 md:h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
```

> Nota: cuando se tengan los nombres reales de los clientes, actualizar el array `clients` en este mismo archivo (líneas 6-13) con el nombre real; el alt se compone solo.

- [ ] **Step 4: Mapa de cobertura: lazy**

En `components/coverage-section.tsx`, reemplazar:

```tsx
            <img src="/map-of-mexico-and-usa-with-transportation-routes.jpg" alt="Mapa de cobertura" className="w-full h-full object-cover" />
```

por:

```tsx
            <img src="/map-of-mexico-and-usa-with-transportation-routes.jpg" alt="Mapa de rutas de transporte entre México y Estados Unidos" loading="lazy" decoding="async" className="w-full h-full object-cover" />
```

- [ ] **Step 5: Iconos sociales del footer a 44px**

En `components/footer.tsx`, reemplazar las tres ocurrencias de:

```tsx
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
```

por (usar `replace_all`):

```tsx
                className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
```

- [ ] **Step 6: Correr la verificación y confirmar que PASA**

Run: comando del Step 1.
Expected: todos `true`, `PASS`.

- [ ] **Step 7: Commit**

```bash
git add components/clients-section.tsx components/coverage-section.tsx components/footer.tsx
git commit -m "perf+a11y: lazy-loading e imágenes con alt descriptivo, iconos sociales a 44px"
```

---

## Task 5: Estrategia de carga del video del hero (P2)

**Files:**
- Modify: `components/hero-section.tsx` (atributo `preload` + autoplay condicional por ancho y `save-data`)

**Interfaces:**
- Consumes: `videoRef`, `videoLoaded`, `setVideoLoaded` (ya existen).
- Produces: nada.

- [ ] **Step 1: Escribir la verificación**

```bash
node -e "const s=require('fs').readFileSync('components/hero-section.tsx','utf8');
const checks={ preloadMetadata:/preload=\"metadata\"/.test(s), noPreloadAuto:!/preload=\"auto\"/.test(s), saveData:/saveData|connection/.test(s) };
console.log(checks);
if(!checks.preloadMetadata||!checks.noPreloadAuto||!checks.saveData){console.error('FAIL');process.exit(1)}
console.log('PASS');"
```

- [ ] **Step 2: Correr la verificación y confirmar que FALLA**

Run: comando del Step 1.
Expected: `FAIL` (hoy `preload="auto"`, sin chequeo de datos).

- [ ] **Step 3: Agregar detección de "ahorro de datos" y bajar `preload`**

En `components/hero-section.tsx`, dentro de `HeroSection`, agregar este efecto justo después del bloque `useEffect(() => { if (videoRef.current && videoRef.current.readyState >= 3) ... }, [])`:

```tsx
  useEffect(() => {
    // En conexiones con ahorro de datos, no autoreproducir el video pesado: se queda el poster.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData && videoRef.current) {
      videoRef.current.removeAttribute("autoplay")
      videoRef.current.pause()
    }
  }, [])
```

- [ ] **Step 4: Cambiar `preload="auto"` por `preload="metadata"`**

En `components/hero-section.tsx`, en la etiqueta `<video>`, reemplazar:

```tsx
          preload="auto"
```

por:

```tsx
          preload="metadata"
```

- [ ] **Step 5: Correr la verificación y confirmar que PASA**

Run: comando del Step 1.
Expected: `{ preloadMetadata: true, noPreloadAuto: true, saveData: true }`, `PASS`.

- [ ] **Step 6: Verificar en navegador que el hero sigue funcionando**

Run: `preview_eval` con `window.scrollTo(0,0)`, luego `preview_screenshot`.
Expected: el hero renderiza con video o poster; el titular y los CTAs son visibles; sin errores en `preview_console_logs` (level `error`).

- [ ] **Step 7: Commit**

```bash
git add components/hero-section.tsx
git commit -m "perf: preload=metadata y autoplay condicional (save-data) en el video del hero"
```

---

## Task 6: Romper el grid de cards idénticas en Features (P2)

**Files:**
- Modify: `components/features-section.tsx` (de grid de 6 cards a lista dividida de 2 columnas, sin contenedores de tarjeta)

**Interfaces:**
- Consumes: array `features` (ya existe: `{ icon, title, description }`), `Reveal`, `RevealGroup`, `RevealChild`.
- Produces: nada. (El import de `Card` deja de usarse y se elimina.)

- [ ] **Step 1: Escribir la verificación**

```bash
node -e "const s=require('fs').readFileSync('components/features-section.tsx','utf8');
const checks={ noCardImport:!/from \"@\/components\/ui\/card\"/.test(s), noCardJsx:!/<Card/.test(s), dividers:/border-b border-border/.test(s) };
console.log(checks);
if(Object.values(checks).some(v=>!v)){console.error('FAIL');process.exit(1)}
console.log('PASS');"
```

- [ ] **Step 2: Correr la verificación y confirmar que FALLA**

Run: comando del Step 1.
Expected: `FAIL` (hoy usa `<Card>` en grid).

- [ ] **Step 3: Eliminar el import de `Card`**

En `components/features-section.tsx`, eliminar la línea:

```tsx
import { Card } from "@/components/ui/card"
```

(Dejar el import de iconos de lucide y el de `motion-primitives`.)

- [ ] **Step 4: Reemplazar el grid de cards por una lista dividida de 2 columnas**

Reemplazar el bloque `<RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> ... </RevealGroup>` por:

```tsx
        <RevealGroup className="max-w-5xl mx-auto grid md:grid-cols-2 gap-x-12 border-t border-border">
          {features.map((feature, index) => (
            <RevealChild key={index} className="group flex gap-5 py-8 border-b border-border">
              <feature.icon
                className="w-6 h-6 text-primary shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </RevealChild>
          ))}
        </RevealGroup>
```

- [ ] **Step 5: Correr la verificación y confirmar que PASA**

Run: comando del Step 1.
Expected: `{ noCardImport: true, noCardJsx: true, dividers: true }`, `PASS`.

- [ ] **Step 6: Verificar build + apariencia**

Run: `pnpm build`; luego en el preview, hacer scroll a "¿Por qué elegir ServiExpress JC?" y `preview_screenshot`.
Expected: build exitoso; las 6 ventajas se ven como lista dividida en 2 columnas con ícono a la izquierda, sin cajas de tarjeta; el reveal escalonado sigue funcionando.

- [ ] **Step 7: Commit**

```bash
git add components/features-section.tsx
git commit -m "design: Features como lista dividida en 2 columnas, no grid de cards idénticas"
```

---

## Task 7 (opcional, depende de assets reales): Sustituir imaginería de stock del hero (P2)

> Esta tarea requiere **archivos reales** (video/foto de la flota y operadores de ServiExpress). El código solo apunta a los nuevos nombres de archivo. Ejecutar solo cuando los assets existan en `public/`. Si aún no hay assets, dejar esta tarea sin marcar; no es bloqueante para las anteriores.

**Files:**
- Add: `public/hero-flota-real.mp4`, `public/hero-flota-poster.jpg` (assets reales provistos por el cliente)
- Modify: `components/hero-section.tsx` (rutas `src` y `poster`)
- Modify: `components/coverage-section.tsx` (mapa real, si se provee)

**Interfaces:**
- Consumes: nada.
- Produces: nada.

- [ ] **Step 1: Colocar los assets reales en `public/`**

Copiar el video y poster reales a `public/hero-flota-real.mp4` y `public/hero-flota-poster.jpg`.

Verificar: `ls -la public/hero-flota-real.mp4 public/hero-flota-poster.jpg` (ambos existen).

- [ ] **Step 2: Apuntar el hero a los assets reales**

En `components/hero-section.tsx`, reemplazar:

```tsx
          poster="/modern-truck-on-highway-at-sunset.jpg"
        >
          <source src="/hero-videop.mp4" type="video/mp4" />
```

por:

```tsx
          poster="/hero-flota-poster.jpg"
        >
          <source src="/hero-flota-real.mp4" type="video/mp4" />
```

- [ ] **Step 3: Verificar en navegador**

Run: recargar el preview y `preview_screenshot` del hero.
Expected: el hero muestra el material real; titular y CTAs legibles sobre el scrim.

- [ ] **Step 4: Commit**

```bash
git add public/hero-flota-real.mp4 public/hero-flota-poster.jpg components/hero-section.tsx
git commit -m "design: reemplazar el video de stock del hero por material real de la flota"
```

---

## Verificación final (tras Tareas 1-6)

- [ ] **Step 1: Lint y build limpios**

Run: `pnpm lint && pnpm build`
Expected: sin errores.

- [ ] **Step 2: Re-correr el audit**

Volver a ejecutar `/impeccable audit`. Resultado esperado: Accessibility 3-4, Anti-Patterns 4, total ≥ 18/20. Confirmar que no quedan P1 abiertos.

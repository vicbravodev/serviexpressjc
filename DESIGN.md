---
name: ServiExpress JC
description: Landing de transporte de carga México-USA, cálida y confiable, no transportista genérico.
colors:
  azul-ruta: "oklch(0.45 0.15 264)"
  azul-ruta-claro: "oklch(0.42 0.14 264)"
  ambar-senal: "oklch(0.75 0.15 85)"
  ambar-senal-bright: "oklch(0.85 0.18 90)"
  tinta: "oklch(0.15 0.01 240)"
  lienzo: "oklch(0.99 0 0)"
  bruma: "oklch(0.96 0.005 240)"
  bruma-texto: "oklch(0.42 0.012 240)"
  linea: "oklch(0.9 0.005 240)"
  whatsapp: "#25D366"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  section: "6rem"
  gutter: "1rem"
  card: "2rem"
  grid-gap: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.azul-ruta-claro}"
    textColor: "{colors.lienzo}"
    rounded: "{rounded.md}"
    padding: "0 2rem"
    height: "3.5rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.lienzo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.xl}"
    padding: "{spacing.card}"
---

# Design System: ServiExpress JC

## 1. Overview

**Creative North Star: "El Apretón de Manos en Carretera"**

Cada decisión visual existe para que un cliente o un operador sienta que detrás de la pantalla hay gente real que cumple. La confianza no se declara, se demuestra: credenciales concretas (B1, doble placa, GPS 24/7, más de diez años) sostienen un trato cálido y directo. El sistema es claro, sólido y humano. Habla español de México sin tecnicismos huecos.

La temperatura es la firma. Sobre una base azul de ruta, profunda y seria, el ámbar de señalética marca lo que importa: un acento cálido que aleja a la marca tanto del frío corporativo como del software. La tipografía es Geist, un sans contemporáneo y legible; los bordes son generosos y suaves; el movimiento es sobrio y entra al hacer scroll, nunca por exhibirse.

Este sistema rechaza explícitamente cuatro cosas. No es una **startup tech / SaaS**: nada de gradientes morados, glassmorphism decorativo, plantilla hero-metric ni grids de cards idénticas. No es un **transportista genérico**: nada de foto de stock de camión al atardecer como relleno vacío ni azul corporativo plano de plantilla. No es **barato ni amateur**: la calidad tipográfica y el orden respaldan la promesa. No es **corporativo frío**: hay personas detrás, y se nota.

**Key Characteristics:**
- Azul de ruta como identidad, ámbar de señalética como acento escaso y deliberado.
- Calidez sin informalidad; seriedad sin frialdad.
- Tipografía Geist, jerarquía por escala y peso, no por color.
- Superficies planas en reposo; profundidad solo como respuesta al estado.
- Móvil de primera clase, no una reducción del escritorio.

## 2. Colors

Una base neutra fría y tranquila, con un único azul de marca que carga la identidad y un ámbar cálido reservado para el énfasis.

### Primary
- **Azul Ruta** (`oklch(0.45 0.15 264)`): el azul del logo, profundo y serio. Identidad principal: fondo del footer, íconos de credenciales, números de stats, foco de inputs y el anillo de foco.
- **Azul Ruta Claro** (`oklch(0.42 0.14 264)`): variante del azul, oscurecida para que el texto blanco de los **CTAs primarios** pase contraste AA. Es el color de los CTAs ("Solicita tu cotización", "Cotización", "Enviar solicitud"). Su trabajo es decir "haz clic aquí".

### Secondary
- **Ámbar Señal** (`oklch(0.75 0.15 85)`) y **Ámbar Señal Bright** (`oklch(0.85 0.18 90)`): el acento cálido de señalética. Aparece en el punto del badge del hero, el subrayado de navegación, la palabra enfatizada del titular ("compromiso sin fronteras") y los hovers de borde. Es el contrapunto que humaniza el azul.

### Neutral
- **Tinta** (`oklch(0.15 0.01 240)`): texto principal y fondo del hero. Casi negro, tibiamente azulado; nunca `#000`.
- **Lienzo** (`oklch(0.99 0 0)`): fondo base de página y superficie de tarjetas.
- **Bruma** (`oklch(0.96 0.005 240)`): fondo de secciones alternas (`bg-muted/30`) que separa el ritmo vertical.
- **Bruma Texto** (`oklch(0.42 0.012 240)`): texto secundario, descripciones, labels de apoyo.
- **Línea** (`oklch(0.9 0.005 240)`): bordes, divisores y los hairlines del panel de certificaciones.

### Brand exception
- **Verde WhatsApp** (`#25D366`): exclusivo del botón de WhatsApp. Es marca de terceros; no se usa en ningún otro lugar.

### Named Rules
**La Regla del Ámbar Escaso.** El ámbar es señal, no decoración. Marca a lo sumo un elemento por pantalla (un énfasis, un estado, un punto vivo). Si aparece en un CTA, un badge y tres bordes a la vez, deja de significar algo. Su rareza es el punto.

**La Regla de Un Solo Azul.** Azul Ruta y su variante clara son el mismo color. Ningún CTA cambia a teal, verde o morado en una sección tardía. El azul es la casa.

## 3. Typography

**Display / Body Font:** Geist (con `ui-sans-serif, system-ui, sans-serif` de respaldo), vía `next/font` con `--font-geist-sans`.
**Label / Mono Font:** Geist Mono (`--font-geist-mono`), reservada para datos puntuales si se necesita.

**Character:** Geist es un sans contemporáneo, geométrico pero legible, sin la frialdad de Helvetica ni la ubicuidad de Inter. Da seriedad sin tiesura. Toda la jerarquía vive en una sola familia: el contraste se logra con escala y peso, jamás inyectando un serif al azar.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, lh 1.08): titular del hero. Máximo 2 líneas en escritorio; la escala se planea junto al asset, nunca se deja desbordar.
- **Headline** (700, `clamp(1.875rem, 4vw, 3rem)`, lh 1.1): encabezados de sección ("Nuestros Servicios", "Quiénes Somos").
- **Title** (600, 1.25rem, lh 1.3): títulos de tarjeta (features, certificaciones, servicios).
- **Body** (400, 1rem, lh 1.625): párrafos y descripciones. Ancho máximo 65–75ch; los subtítulos largos se contienen con `max-w-2xl/3xl`.
- **Label** (500, 0.875rem): texto de apoyo, metadatos, atribución de testimonios.

### Named Rules
**La Regla del Énfasis en Familia.** Para destacar una palabra en un titular, se usa color (Ámbar Señal) o peso dentro de Geist. Nunca se mezcla un serif ni se usa `background-clip: text` con gradiente. El gradient text está prohibido.

## 4. Elevation

Sistema **plano por defecto**. Las superficies descansan al ras sobre el lienzo, separadas por color de fondo (Bruma) y por la línea de borde, no por sombra. La profundidad es una respuesta al estado, no un adorno permanente: una tarjeta se eleva levemente solo al hacer hover.

### Shadow Vocabulary
- **Lift de hover** (`hover:-translate-y-1.5` + `shadow-xl`): tarjetas de features, certificaciones, servicios y stats al pasar el cursor. Comunica que el elemento es interactivo.
- **Chrome del header** (`shadow-md`): aparece solo cuando el header pasa a estado sólido tras hacer scroll.
- **Anclaje del mapa** (`shadow-2xl`): la imagen de cobertura, que sí debe sentirse como una pieza física apoyada.

### Named Rules
**La Regla del Plano en Reposo.** Ninguna tarjeta nace con sombra. La sombra entra con el hover y se va con él. Sombra permanente sobre cada tarjeta es ruido visual y huele a plantilla.

## 5. Components

Filosofía: **cercanos y suaves**. Bordes redondeados generosos, trato amable, nada agresivo, pero firmes y táctiles al usarse.

### Buttons
- **Shape:** radio suave (`rounded-md`, 10px). Feedback táctil al presionar (`active:scale-[0.97]`).
- **Primary:** fondo Azul Ruta Claro, texto Lienzo. CTAs de conversión. Tamaño grande en hero (`h-14`, padding `0 2rem`).
- **Hover:** oscurecimiento sutil del fondo (`/90`) y, en CTAs del hero, una transición de relleno ámbar; el ícono de flecha se desliza 2px.
- **Outline:** fondo transparente, borde, texto Tinta; sobre el video del hero usa borde y texto blancos con `backdrop-blur`. Hover vira borde y texto a Ámbar Señal.

### Cards / Containers
- **Corner Style:** redondeo amable (`rounded-xl`, 16px).
- **Background:** Lienzo; el panel de equipo usa un degradado tenue azul/ámbar al 5%.
- **Shadow Strategy:** plano en reposo, lift en hover (ver Elevation).
- **Border:** sutil con Línea cuando aporta separación.
- **Internal Padding:** generoso (`2rem` / `p-8`).

### Inputs / Fields
- **Style:** borde Línea, fondo Lienzo, radio suave. Label siempre arriba del campo, nunca placeholder como label.
- **Focus:** anillo de foco Azul Ruta (`ring-ring`), visible y con contraste AA.

### Navigation
- **Style:** header fijo, una sola línea, alto 96px (`h-24`). Transparente sobre el hero (texto blanco), vira a sólido (`bg-background/95` + `backdrop-blur`) tras el scroll, detectado por IntersectionObserver, no por listener de scroll.
- **Links:** peso medio; subrayado Ámbar Señal que crece en hover/activo. Móvil: menú hamburguesa.

### Franja de Confianza (componente firma)
Las certificaciones NO son un grid de cards repetidas. Son una sola superficie bordeada con celdas separadas por hairlines (`bg-border` + `gap-px` + celdas `bg-card`). Ícono inline, título, descripción. Es la respuesta deliberada a la prohibición de "grids de cards idénticas".

## 6. Do's and Don'ts

### Do:
- **Do** usar fotografía y video reales de la flota, las unidades y los operadores de ServiExpress. La confianza se construye mostrando gente real, no stock.
- **Do** reservar el Ámbar Señal para un único acento por pantalla; deja que el azul cargue la identidad.
- **Do** mantener superficies planas en reposo y elevar solo en hover.
- **Do** sostener cada afirmación con evidencia concreta (B1, doble placa, GPS 24/7, 10+ años).
- **Do** dar prioridad real al móvil: el hero cabe en viewport, los CTAs se ven sin scroll, los formularios se usan con el pulgar.
- **Do** romper la repetición de layout: cuando una sección use un patrón (grid de cards), la siguiente usa otra familia (franja con hairlines, split, lista).

### Don't:
- **Don't** caer en el **transportista genérico**: nada de foto de stock de camión al atardecer como relleno vacío, ni azul corporativo plano de plantilla.
- **Don't** parecer **startup tech / SaaS**: prohibidos los gradientes morados, el glassmorphism decorativo, la plantilla hero-metric (número gigante + stats con acento en gradiente) y los grids de cards idénticas.
- **Don't** verse **barato ni amateur**: nada de tipografía débil, exceso de colores ni aire de plantilla económica.
- **Don't** sentirse **corporativo frío**: no borres la presencia humana en favor de una multinacional sin rostro.
- **Don't** usar `background-clip: text` con gradiente en titulares. Énfasis con color sólido (Ámbar) o peso.
- **Don't** usar `border-left`/`border-right` mayor a 1px como franja de color en tarjetas o avisos. Usa borde completo, tinte de fondo o nada.
- **Don't** dejar sombra permanente sobre cada tarjeta, ni `#000`/`#fff` puros: todo neutro va tintado hacia el azul.
- **Don't** usar em dashes en el copy. Usa comas, dos puntos, punto y coma o paréntesis.

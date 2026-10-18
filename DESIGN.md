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

Cada decisión visual existe para que un cliente o un operador sienta que detrás de la pantalla hay gente real que cumple. La confianza no se declara, se demuestra: credenciales concretas (B1, doble placa, GPS 24/7, en ruta desde 2005 con años calculados) sostienen un trato cálido y directo. El sistema es claro, sólido y humano. Habla español de México sin tecnicismos huecos.

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
- **Azul Ruta** (`oklch(0.45 0.15 264)`): el azul del logo, profundo y serio. Identidad principal: íconos en línea (pilares de Talleres, contacto), la marca "JC" del footer, foco de inputs y el anillo de foco. Ya no es fondo de ninguna superficie grande: el azul plano a sangre es el cliché de transportista genérico.
- **Azul Ruta Claro** (`oklch(0.42 0.14 264)`): variante del azul, oscurecida para que el texto blanco de los **CTAs primarios** pase contraste AA. Es el color de los CTAs ("Solicita tu cotización", "Cotización", "Enviar solicitud"). Su trabajo es decir "haz clic aquí".

### Secondary
- **Ámbar Señal** (`oklch(0.75 0.15 85)`) y **Ámbar Señal Bright** (`oklch(0.85 0.18 90)`): el acento cálido de señalética. Aparece en el subrayado de navegación, la palabra enfatizada del titular ("con flota propia") y los hovers de borde. Es el contrapunto que humaniza el azul.

### Neutral
- **Tinta** (`oklch(0.15 0.01 240)`): texto principal. El hero usa un tono hermano (`oklch(0.12 0.01 240)`) bajo el video. Casi negro, tibiamente azulado; nunca `#000`.
- **Lienzo** (`oklch(0.99 0 0)`): fondo base de página y superficie de tarjetas.
- **Bruma** (`oklch(0.96 0.005 240)`): fondo de secciones alternas (`bg-muted/30`: Servicios, Talleres, CTA) que separa el ritmo vertical.
- **Bruma Texto** (`oklch(0.42 0.012 240)`): texto secundario, descripciones, labels de apoyo.
- **Línea** (`oklch(0.9 0.005 240)`): bordes y divisores. La franja de evidencia usa `foreground/15` para que sus reglas se lean sobre el lienzo.

### Brand exception
- **Verde WhatsApp** (`#25D366`): exclusivo del botón de WhatsApp. Es marca de terceros; no se usa en ningún otro lugar. El texto va oscuro (`oklch(0.2 0.04 155)`): blanco sobre este verde da ≈2:1 y no pasa AA.

### Named Rules
**La Regla del Ámbar Escaso.** El ámbar es señal, no decoración. Marca a lo sumo un elemento por pantalla (un énfasis o un estado). Nada de puntos "en vivo" decorativos: si no hay un dato real en vivo detrás, no hay punto. Si aparece en un CTA, un badge y tres bordes a la vez, deja de significar algo. Su rareza es el punto.

**La Regla del Único Bloque Oscuro.** La página es clara. El hero (video + scrim) es el único bloque oscuro y termina en un corte limpio contra el lienzo, sin degradado a gris. Franja de evidencia, formularios y footer viven sobre Lienzo o Bruma.

**La Regla de Un Solo Azul.** Azul Ruta y su variante clara son el mismo color. Ningún CTA cambia a teal, verde o morado en una sección tardía. El azul es la casa.

## 3. Typography

**Display / Body Font:** Geist (con `ui-sans-serif, system-ui, sans-serif` de respaldo), vía `next/font` con `--font-geist-sans`.
**Label / Mono Font:** Geist Mono (`--font-geist-mono`), reservada para datos puntuales si se necesita. Las etiquetas mono en mayúsculas sobre titulares se limitan a 3 en toda la página (hoy solo el slogan del hero); más que eso es ritmo de plantilla.

**Character:** Geist es un sans contemporáneo, geométrico pero legible, sin la frialdad de Helvetica ni la ubicuidad de Inter. Da seriedad sin tiesura. Toda la jerarquía vive en una sola familia: el contraste se logra con escala y peso, jamás inyectando un serif al azar.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, lh 1.08): titular del hero. Máximo 2 líneas en escritorio; la escala se planea junto al asset, nunca se deja desbordar.
- **Headline** (700, `clamp(1.875rem, 4vw, 3rem)`, lh 1.1): encabezados de sección ("Nuestros Servicios", "Quiénes Somos").
- **Title** (600, 1.25rem, lh 1.3): títulos de tarjeta y de hechos (servicios, evidencia, pilares de Talleres).
- **Body** (400, 1rem, lh 1.625): párrafos y descripciones. Ancho máximo 65–75ch; los subtítulos largos se contienen con `max-w-2xl/3xl`.
- **Label** (500, 0.875rem): texto de apoyo, metadatos, atribución de testimonios.

### Named Rules
**La Regla del Énfasis en Familia.** Para destacar una palabra en un titular, se usa color (Ámbar Señal) o peso dentro de Geist. Nunca se mezcla un serif ni se usa `background-clip: text` con gradiente. El gradient text está prohibido.

## 4. Elevation

Sistema **plano por defecto**. Las superficies descansan al ras sobre el lienzo, separadas por color de fondo (Bruma) y por la línea de borde, no por sombra. La profundidad es una respuesta al estado, no un adorno permanente: una tarjeta se eleva levemente solo al hacer hover.

### Shadow Vocabulary
- **Lift de hover** (`hover:-translate-y-1.5` + `shadow-xl`): tarjetas de servicio (nacional / internacional) al pasar el cursor. Comunica que el elemento es interactivo.
- **Chrome del header** (`shadow-md`): aparece solo cuando el header pasa a estado sólido tras hacer scroll.

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
- **Validación:** el botón de enviar nunca se deshabilita para "esconder" qué falta. Al intentar enviar se marcan los campos (`aria-invalid` + mensaje debajo con `aria-describedby`) y el foco va al primero con error. Los errores aparecen solo tras el primer intento, no mientras se escribe.

### Formularios (sección de conversión)
Dos caminos con la misma jerarquía, cada uno con su H2:
- **Cotizador** (`#cotizacion`): formulario (7/12) + **ticket de la solicitud** (5/12) a la misma altura. El ticket se ve desde el inicio y se completa mientras el visitante llena el formulario (lo pendiente va atenuado); la ruta encabeza en grande. Abajo, lo que falta para enviar, WhatsApp/llamar y el contacto directo por WhatsApp (ya no es una tarjeta aparte). En móvil el ticket va después del formulario.
- **Postulación** (`#postulate`): split 5/7, texto a la izquierda y formulario 2×2 en tarjeta a la derecha, separado del cotizador por una regla.

### Navigation
- **Style:** header fijo, una sola línea, alto 72px (`h-[72px]`). Transparente sobre el hero (texto blanco), vira a sólido (`bg-background/95` + `backdrop-blur`) tras el scroll, detectado por IntersectionObserver, no por listener de scroll.
- **Links:** peso medio; subrayado Ámbar Señal que crece en hover/activo. Móvil: menú hamburguesa.

### Franja de Evidencia (componente firma)
Va justo debajo del hero y fusiona lo que antes eran Stats y Certificaciones. Sobre Lienzo, sin placa oscura ni números de vitrina: a la izquierda el encabezado (4/12), a la derecha una lista `<dl>` de seis hechos verificables (años en ruta calculados, flota propia, GPS 24/7, licencia B1, doble placa, seguro de carga), cada uno con una regla superior (`border-t`), título y una línea de apoyo. Dos columnas hasta `xl`, tres desde `xl`, una en móvil. Cada credencial aparece una sola vez en la página: no se repite B1 ni doble placa en otra franja. Nada de métricas sin fuente (el antiguo "100%").

### Encabezados de sección
Alineados a la izquierda y con escala variada según el peso de la sección, no la fórmula centrada repetida:
- **Quiénes Somos:** el más grande (`text-4xl md:text-6xl`). Encabezado (6/12) y misión/visión (6/12, dos columnas con regla superior) en una sola fila alineada abajo; la foto de equipo va debajo a todo el ancho. El bloque no depende de la foto: sin ella no queda hueco.
- **Servicios, Talleres, Ubicación:** headline estándar (`text-3xl md:text-5xl`), subtítulo apilado debajo (máx. 65ch).
- **Evidencia:** más chico (`text-2xl md:text-4xl`), en columna lateral.
- **Cobertura:** encabezado a la izquierda, sin etiqueta. Mapa estilo atlas (3/5: tierra gris, límites estatales en blanco, corredores reales en Azul Ruta trazados por sus ciudades de paso) + riel (2/5) con el buscador "¿Llegamos a tu ciudad?" y la lista de corredores frecuentes con carretera, distancia y tiempo publicados en `content/routes.ts`. El ámbar solo aparece en la ruta que busca el visitante. Sin animaciones perpetuas: los corredores se dibujan una vez al entrar.

### Composición imagen/texto
Ningún patrón imagen + texto se repite igual:
- **Carga especializada** (Servicios): split dentro de una tarjeta, foto a la izquierda.
- **Talleres:** foto a sangre en la mitad derecha hasta el borde del viewport (`lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2`); en móvil la foto va arriba a todo el ancho.
- **Ubicación:** apilado. Encabezado y datos de contacto en una fila (7/5), mapa panorámico a lo ancho debajo (`aspect-[21/9]`, `4/3` en móvil).

### Foto de equipo (Quiénes Somos)
Slot a ancho de contenedor debajo del encabezado y la misión/visión (`aspect-[21/9]`, `4/3` en móvil). La foto la pasa el cliente: gente real de ServiExpress JC, horizontal, ≥2400 px, nunca stock. Mientras `TEAM_PHOTO` sea `null` en `components/about-section.tsx`, se muestra un slot punteado "Pendiente" solo fuera de producción (`VERCEL_ENV !== "production"`); en producción no se renderiza nada.

### Footer
Claro, integrado al sistema: Lienzo con línea superior, logo sobre blanco, "JC" en Azul Ruta, links en Bruma Texto que pasan a Tinta en hover e íconos de contacto en Azul Ruta. Ya no es una plancha azul corporativa.

## 6. Do's and Don'ts

### Do:
- **Do** usar fotografía y video reales de la flota, las unidades y los operadores de ServiExpress. La confianza se construye mostrando gente real, no stock.
- **Do** reservar el Ámbar Señal para un único acento por pantalla; deja que el azul cargue la identidad.
- **Do** mantener superficies planas en reposo y elevar solo en hover.
- **Do** sostener cada afirmación con evidencia concreta (B1, doble placa, GPS 24/7, años en ruta calculados desde 2005).
- **Do** dar prioridad real al móvil: el hero cabe en viewport, los CTAs se ven sin scroll, los formularios se usan con el pulgar.
- **Do** romper la repetición de layout: cuando una sección use un patrón (grid de cards), la siguiente usa otra familia (lista con reglas, foto a sangre, apilado con mapa panorámico). Nunca tres splits con la imagen del mismo lado.

### Don't:
- **Don't** caer en el **transportista genérico**: nada de foto de stock de camión al atardecer como relleno vacío, ni azul corporativo plano de plantilla.
- **Don't** parecer **startup tech / SaaS**: prohibidos los gradientes morados, el glassmorphism decorativo, la plantilla hero-metric (número gigante + stats con acento en gradiente) y los grids de cards idénticas.
- **Don't** verse **barato ni amateur**: nada de tipografía débil, exceso de colores ni aire de plantilla económica.
- **Don't** sentirse **corporativo frío**: no borres la presencia humana en favor de una multinacional sin rostro.
- **Don't** usar `background-clip: text` con gradiente en titulares. Énfasis con color sólido (Ámbar) o peso.
- **Don't** usar `border-left`/`border-right` mayor a 1px como franja de color en tarjetas o avisos. Usa borde completo, tinte de fondo o nada.
- **Don't** dejar sombra permanente sobre cada tarjeta, ni `#000`/`#fff` puros: todo neutro va tintado hacia el azul.
- **Don't** usar em dashes en el copy. Usa comas, dos puntos, punto y coma o paréntesis.

# Rediseño de contenido, formularios y cotizador — ServiExpress JC

Fecha: 2026-07-02
Estado: aprobado para implementación (sesión autónoma; decisiones documentadas con trade-offs)

## Contexto y problema

Auditoría completa de la landing (6 auditores paralelos sobre todos los componentes) encontró:

1. **Experiencia incorrecta y estática.** La empresa se fundó en **2005** (21 años en 2026), pero la página dice "10+ años" / "más de una década" en 4 lugares: `Metadata.description`, `Hero.badgeYears`, `stats-section.tsx:19` (`target: 10`) y `About.subtitle`. No existe `foundingYear` en ninguna configuración.
2. **Redundancia masiva de contenido.** GPS 24/7 aparece en 7 lugares; flota propia en 5; B1/doble placa en 4; "5 talleres propios" 3 veces (2 dentro de la propia sección Talleres); Ternium/Villacero/Aceros BC aparecen como logos en Clients y otra vez como atribuciones en Testimonials. La sección **Features duplica el 100% de sus 6 items** con secciones dedicadas (Stats, Coverage, Certifications, Talleres, Testimonials).
3. **Conversión muerta.** Los formularios no tienen `action` ni `onSubmit` (el submit nativo recarga la página filtrando PII al query string). El botón de WhatsApp no navega a ningún lado. No hay número de WhatsApp en el repo. El input de CV no puede enviarse a ninguna parte (no hay backend).
4. **Datos de empresa dispersos.** Teléfono, email, dirección y redes duplicados entre footer, JSON-LD y placeholders de formularios (el número real de la empresa se usa como placeholder de ejemplo, un antipatrón).
5. **Drift del design system.** Sombras permanentes en reposo (stats, about, talleres, testimonials, CTA del hero), 15 estrellas ámbar fabricadas en Testimonials (viola la Regla del Ámbar Escaso y es un dato inventado), grid de cards idénticas en Testimonials.

## Decisiones

### D1. Experiencia dinámica desde 2005

**Elegido: fuente única + interpolación ICU.** En `lib/site.ts`: `FOUNDING_YEAR = 2005` y `yearsInService()` (`new Date().getFullYear() - FOUNDING_YEAR`). Los mensajes usan `{years}` (patrón ICU ya existente en el proyecto: `Clients.logoAlt`, `Coverage.citiesCount`). Se muestra el número exacto (21), no "20+": el número exacto es más creíble y se actualiza solo.

- Consumidores: badge del hero, métrica 0 de Stats (`target` calculado), subtítulo de About ("desde 2005, {years} años…"), `Metadata.description`, y `foundingDate: "2005"` nuevo en el JSON-LD Organization.
- Alternativas rechazadas: hardcodear "21" (vuelve a caducar en enero); calcular en cada componente (dispersión, mismo bug de hoy repetido).
- Riesgo aceptado: el año se congela en build (páginas estáticas). Con un deploy por año basta; el cálculo en runtime de RSC lo corrige en cada `revalidate`/deploy sin tocar código.

### D2. Fuente única de datos de empresa

`lib/site.ts` concentra: `FOUNDING_YEAR`, `CONTACT_PHONE` (+1 346 366 9867), `CONTACT_PHONE_DISPLAY`, `WHATSAPP_PHONE` (default = teléfono corporativo, override con `NEXT_PUBLIC_WHATSAPP_PHONE`), `CONTACT_EMAIL`, `ADDRESS`, `SOCIAL_LINKS`, `WORKSHOPS_COUNT = 5`. Footer, JSON-LD y CTA los consumen. **Supuesto a confirmar por el negocio: el WhatsApp es el mismo número corporativo.** El env var permite corregirlo sin deploy de código.

### D3. Consolidación: cada hecho vive en un solo lugar

**Elegido: consolidar a 9 secciones con "hogares" únicos por hecho** (vs. solo podar textos manteniendo 11 secciones, que no resuelve la estructura; vs. rediseño total, que arriesga lo que ya funciona: hero de video, consola de stats, mapa de cobertura).

| Hecho | Hogar único | Se elimina de |
|---|---|---|
| Años desde 2005 | Stats (métrica) + hero badge (misma fuente) | About lo narra como "desde 2005" (complemento, no repetición) |
| GPS 24/7 | Stats (consola) + subtítulo del hero (narrativa) | Features, About.values, Footer.services |
| Flota propia | Stats (100%) + Talleres (narrativa de mantenimiento) | Features, About.subtitle (reformulado) |
| B1 / doble placa | Certifications (franja) | Features; se conservan menciones operativas en Services.international y chip del mapa (contexto, no claim) |
| 5 talleres + Los César | Sección Talleres | Features; dentro de Talleres, el pilar 1 (que repetía el titular) se reemplaza por "Diagnóstico y verificación" |
| Cobertura | Sección Coverage | Features |
| Entregas puntuales | Testimonios (voz del cliente) | Features, About.values |
| Clientes que confían | Nueva sección única de prueba social | Se fusionan Clients + Testimonials |

- **`FeaturesSection` se elimina** (los 6 items están cubiertos). Su único dato no repetido (remolques 53' con suspensión de aire) ya vive en `Services.specialized`.
- **Clients + Testimonials se fusionan** en `SocialProofSection`: logo wall compacto arriba + testimonios como citas editoriales (sin estrellas fabricadas, sin cards idénticas: cita destacada + dos secundarias, ámbar solo en un acento).
- **About se destila**: se quita la lista de 6 valores (duplicaba Features/Stats); misión y visión se funden en un bloque narrativo breve anclado en "desde 2005". Deja de ser plantilla corporativa.
- **Nuevo orden**: Hero → Stats → Services → Coverage → Certifications → Talleres → About → SocialProof → Cotizador/CTA → Footer. Racional: Services enlaza "Ver cobertura" (ahora adyacente); credenciales tras el mapa de cruce; prueba social justo antes de la conversión; alternancia de familias visuales (consola oscura / cards / consola mapa / franja clara / split foto / narrativa / citas / formulario).

### D4. Cotizador autoservicio con handoff a agente

**Elegido: estimador client-side con coordenadas + haversine × factor carretera 1.3** (vs. matriz fija origen-destino: crece O(n²) y es tediosa de mantener; vs. API de mapas: dependencia externa, coste, y la precisión extra no aporta en un *estimado*).

- **Inputs (5 pasos visibles, thumb-first):** servicio (Nacional | Internacional MX→USA, chips), origen (select de ciudades MX), destino (select según servicio: ciudades MX o ciudades USA del directorio de Coverage), tipo de unidad (Caja seca 53' | Plataforma | Sobredimensionada, chips), peso aproximado (slider 1–35 t).
- **Modelo de tarifa** en `lib/quote.ts`, editable y comentado como orientativo: `banderazo + km × tarifaPorKm(unidad) × factorPeso`, + cuota de cruce fronterizo si es internacional. Resultado como **rango ±12%**, MXN en nacional y USD en internacional. Nunca se presenta como precio final.
- **Salida y handoff:** rango estimado + desglose legible (distancia aprox., unidad, cruce) + disclaimer ("estimado orientativo; un agente lo afina según báscula, maniobras, seguro y disponibilidad") + CTA primario **"Afinar con un agente"** que abre `wa.me/<WHATSAPP_PHONE>` con mensaje prellenado con todos los parámetros y el rango. CTA secundario: llamar por teléfono. Esto cumple exactamente el pedido: el cliente se autosirve el estimado y el agente da el precio real.
- El componente es `"use client"`; el resto de la página sigue siendo server components.

### D5. Formularios simples y funcionales

- **Cotización:** el simulador reemplaza al formulario de 7 campos. Quien prefiera escribir tiene el chat de WhatsApp y el correo visibles.
- **Postulación:** 4 campos (nombre, teléfono, puesto como `select` con puestos reales: Operador B1, Operador nacional, Técnico de taller, Administrativo; años de experiencia como `select` de rangos). Submit construye mensaje de WhatsApp prellenado. El input de CV se elimina (no hay backend que lo reciba); el mensaje indica "adjunta tu CV en el chat". Email deja de ser requerido: en este perfil el teléfono es el canal.
- Ambos caminos conservan labels arriba, foco visible, `autoComplete`, validación nativa + estado deshabilitado hasta ser válido.
- Placeholders de teléfono en `en.json` dejan de usar el número real de la empresa.

### D6. Polish incluido en el alcance (drift que tocamos de paso)

- Quitar sombras permanentes en reposo: consola de Stats, imagen de About, imagen de Talleres, CTA del hero, `shadow-sm` heredado de Card en About/Testimonials (se anula en uso; el primitivo ui/card no se toca). El `shadow-2xl` del mapa de Coverage se queda (sancionado por DESIGN.md).
- Quitar `generator: "v0.app"` de metadata.
- JSON-LD consume constantes de `lib/site.ts` + `foundingDate`.
- Actualizar la evidencia "10+ años" en DESIGN.md/PRODUCT.md a "desde 2005 (años calculados)".
- Paridad total es/en en `messages/`.

## Fuera de alcance

Renombrar `hero-videop.mp4`, focus-trap completo del modal del hero, migrar FleetImage a next/image, unificación de easings, derivar hreflang de routing. Se documentan como seguimiento.

## Criterios de aceptación

1. Ningún "10+ años"/"más de una década"/"10+ years" queda en repo; el número visible es 21 y proviene de `FOUNDING_YEAR`.
2. `grep` de GPS 24/7 / flota propia / B1 / talleres muestra cada hecho en su hogar único (más menciones narrativas justificadas en la tabla D3).
3. La página tiene 9 secciones en el orden definido; `FeaturesSection` y las secciones separadas de Clients/Testimonials no se renderizan.
4. El simulador produce un rango coherente para (Monterrey→Houston, caja seca, 20 t) y el botón abre `wa.me` con el mensaje prellenado íntegro.
5. La postulación abre WhatsApp con nombre, puesto y experiencia en el mensaje.
6. Sin errores de consola; es/en en paridad; móvil 375px sin scroll horizontal; touch targets ≥44px en simulador y formularios.

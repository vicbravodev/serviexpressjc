# Rediseño: clientes, patios, carga y mapa de rutas

Fecha: 2026-07-02
Rama: `claude/distracted-mendel-a2a379`

Cuatro cambios pedidos por el cliente sobre la landing de ServiExpress JC. Aplican a
`components/` + `messages/es.json` + `messages/en.json`, más una pieza nueva de datos
geográficos para el mapa.

## 1. Clientes (`social-proof-section.tsx`)

- Conservar **Ternium** (logo existente).
- Agregar: Papalotes, AC Villarreal, Hombrokers, EIPAVA, Aceros VS, Kingspan, Envía,
  Point, SCX, Serviacero.
- Buscar y descargar logos reales a `public/clients/`. Los que no tengan logo confiable
  se muestran como **wordmark tipográfico** (mismo grid, tipografía de marca).
- Rejilla responsiva crece de 5 a ~11 celdas.
- Testimonios atribuidos a Villacero y Aceros BC → reatribuir a clientes que permanecen
  (Ternium + Serviacero/Kingspan). Sin inventar nombres de personas.
- Quitar "forraje" del subtítulo.

## 2. Talleres + Patios de resguardo (`talleres-section.tsx`)

Combinar mantenimiento propio **y** resguardo seguro de carga.

- Titular: "5 patios de resguardo con seguridad total" + acento de mantenimiento propio.
- 4 pilares: (1) Patios con vigilancia/seguridad, (2) Resguardo de unidades y carga,
  (3) Mantenimiento propio preventivo/correctivo, (4) Refaccionaria propia.
- Íconos: `ShieldCheck`, `Warehouse`, `Wrench`, `Package`.
- Imagen → `flota-patio.jpg`.
- Mantener ancla `#talleres`.

## 3. Carga (`services-section.tsx`)

- Nacional: quitar "agrícola" de la descripción.
- Especializada: tags → Siderúrgica / acero · Carga suelta · Caja seca (53') ·
  Sobredimensionada. Descripción centrada en acero, carga suelta y caja seca.
- Imagen: `carga-agricola.jpg` → `carga-acero.jpg`. Actualizar alt/caption (sin forraje).
- Reflejar en `en.json`.

## 4. Mapa de rutas — geográfico real de Norteamérica (`coverage-section.tsx`)

Reemplazar el SVG estilizado por un mapa geográfico real MX + EE. UU., manteniendo la
estética "torre de control" (blueprint, corredores ámbar, tipografía mono).

- **Geometría:** script único de build (d3-geo + us-atlas + GeoJSON de estados de México)
  proyecta ambos países juntos y emite paths por estado + centroides. Resultado incrustado
  en el repo (`components/coverage-geo.ts` o `lib/`), sin librerías de mapa en runtime.
- **Animación:** estados se encienden en secuencia; corredores animados (pathLength) desde
  el hub Monterrey hacia ambos países; unidad viajera + nodos que pulsan.
- **Cobertura total:** stat "32 estados MX · 48 EE. UU."; panel lateral lista todos los
  estados en lugar de 4 zonas.
- Respeta `prefers-reduced-motion` (mapa estático).

## Riesgos / notas

- No garantizado encontrar logo limpio de las 10 empresas → fallback wordmark, se reporta.
- El pipeline de geometría necesita internet en build; el output se commitea para runtime
  offline.
- Reusar imágenes existentes (no hay foto de forraje-libre nueva): `carga-acero.jpg`,
  `flota-patio.jpg`.

## Fuera de alcance

- Nuevas fotos de flota.
- Mapa interactivo con hover por estado (se eligió el geográfico animado, no interactivo).

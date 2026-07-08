# Checklist SEO post-deploy — ServiExpress JC

Tareas manuales que el código no puede resolver. Marcar cada una al completarla.

## 1. Dominio y Search Console (semana 1)

- [ ] **Verificar el redirect www → apex en producción.** El código incluye el redirect 301 en `next.config.mjs`, pero conviene configurarlo también a nivel dominio en Vercel: *Project → Settings → Domains* → `serviexpressjc.com.mx` como dominio principal y `www.serviexpressjc.com.mx` con "Redirect to" al apex (308/301). Probar: `curl -I https://www.serviexpressjc.com.mx/` debe responder 301/308 con `Location: https://serviexpressjc.com.mx/`.
- [ ] **Google Search Console:** verificar la propiedad de dominio (`serviexpressjc.com.mx`, cubre www y no-www) vía DNS TXT. Si se usan propiedades de prefijo, verificar AMBAS (https://serviexpressjc.com.mx y https://www.serviexpressjc.com.mx).
- [ ] **Enviar el sitemap** en GSC: `https://serviexpressjc.com.mx/sitemap.xml`.
- [ ] **Solicitar indexación manual** (Inspección de URL → Solicitar indexación) de la home y las 6 páginas de servicio en español, más `/en` y las 2-3 páginas EN más importantes.

## 2. Perfiles locales (semanas 1–2)

- [ ] **Google Business Profile:** crear o reclamar el perfil.
  - Categoría principal: **"Servicio de transporte de carga"** (Trucking company).
  - Dirección: Carretera Mezquital Santa Rosa Km 05, Apodaca, N.L.
  - Teléfonos: +52 81 1552 6349 (MX) / +1 346 366 9867 (US).
  - Sitio: https://serviexpressjc.com.mx
  - Subir fotos reales de flota (usar las de `public/fleet/`): patio, unidades, cruce.
  - **Pedir reseñas a clientes clave** (Ternium, Serviacero, Kingspan y clientes frecuentes): las reseñas son el factor #1 del pack local.
  - Definir y publicar **horario de atención** (dato pendiente, ver TODOs).
- [ ] **Bing Places for Business:** dar de alta el negocio (se puede importar desde GBP).

## 3. Directorios y citas (semanas 2–4)

- [ ] **CANACAR** — verificar/actualizar el registro de la empresa en el directorio de la cámara.
- [ ] **Directorios logísticos:** T21 (t21.com.mx), TyT (Transportes y Turismo), THE LOGISTICS WORLD directory.
- [ ] **Cámaras de comercio de Nuevo León:** CAINTRA / Index Nuevo León si aplica.
- [ ] Cuidar el **NAP consistente** (nombre, dirección, teléfono idénticos) en todas las citas.

## 4. Dominio .com para el mercado US (decisión de negocio)

- [ ] **Evaluar registrar `serviexpressjc.com`**: hoy existe confusión de marca con `serviexpress-jc.com` (empresa distinta, de grúas) y `jcexpress.com.mx`. Registrar el .com (aunque solo redirija 301 a `serviexpressjc.com.mx/en`) protege la marca ante brokers/shippers de Texas que buscan en Google con `.com` mental.
- [ ] Si se registra: solo redirect 301 al dominio actual — NO servir contenido duplicado.

## 5. Analytics y monitoreo (continuo)

- [ ] **GSC a 2–4 semanas:** revisar *Indexación → Páginas*: las 22 URLs (11 ES + 11 EN) deben pasar a "Indexada". Si alguna queda en "Detectada, sin indexar", solicitar indexación manual y revisar enlaces internos hacia ella.
- [ ] **Rendimiento por consulta** en GSC: monitorear las keywords objetivo (tabla en el PR) y detectar canibalización o queries nuevas para futuras páginas de ruta (p. ej. Monterrey–San Antonio, Monterrey–Guadalajara).
- [ ] **PageSpeed Insights / CrUX en producción:** validar LCP móvil real < 2.5 s en https://serviexpressjc.com.mx (el laboratorio local dio 4.4 s simulado en slow-4G; el CDN de Vercel + AVIF debería situarlo por debajo del objetivo — verificar con datos de campo).
- [ ] **Validar datos estructurados** con https://search.google.com/test/rich-results en: home (Organization + LocalBusiness), una página de servicio (Service + FAQPage + BreadcrumbList) y una de ruta.
- [ ] **hreflang:** en GSC (o Screaming Frog) confirmar que no hay errores de "no return tags" entre ES/EN.

## 6. Datos pendientes de la empresa (completar y actualizar el código)

- [ ] **Horario de atención** de oficina/patio → añadir `openingHoursSpecification` al LocalBusiness en `lib/schema.ts` y al GBP.
- [ ] **Coordenadas geográficas exactas** de la terminal de Apodaca → añadir `geo` (GeoCoordinates) al LocalBusiness.
- [ ] **Código postal** de la dirección → añadir `postalCode` al `ADDRESS` de `lib/site.ts`.
- [ ] Cuando el cliente pase los **15 logos faltantes** de clientes, actualizar la sección de clientes (mejora E-E-A-T indirecta).

import type { LocalizedPage } from "./types"

/**
 * Contenido largo de las páginas de servicio. Datos duros (año de fundación,
 * teléfonos, dirección) viven en lib/site.ts; aquí solo se citan hechos que ya
 * publica el sitio (flota propia, GPS 24/7, operadores B1, doble placa, cruce
 * por Laredo, talleres propios, clientes como Ternium y Serviacero).
 */
export const SERVICE_PAGES: Record<string, LocalizedPage> = {
  "/transporte-nacional": {
    es: {
      breadcrumb: "Transporte nacional",
      kicker: "Servicio · Nacional",
      metaTitle: "Transporte Nacional de Carga en México | ServiExpress JC",
      metaDescription:
        "Transporte de carga nacional a los 32 estados con flota propia, GPS 24/7 y operadores certificados. Base en Monterrey. Cotiza tu embarque hoy mismo.",
      h1: "Transporte de carga nacional en México",
      intro: [
        "Movemos carga a los 32 estados de la República desde nuestra base en Apodaca, Nuevo León. Operamos con flota 100% propia —sin subcontratar tu carga— y cada unidad viaja monitoreada por GPS las 24 horas desde nuestra sala de control en Monterrey.",
        "Desde 2005 atendemos a la industria siderúrgica, agrícola, manufacturera y de distribución con servicio local, regional y de larga distancia. Si tu mercancía necesita moverse dentro de México, la llevamos de puerta a puerta.",
      ],
      image: { src: "/fleet/transporte-nacional.jpg", alt: "Tractocamión Kenworth de ServiExpress JC con caja seca de 53 pies cargando en un andén de distribución" },
      sections: [
        {
          h2: "Cobertura en toda la República Mexicana",
          paragraphs: [
            "Nuestra operación nacional parte de Monterrey y cubre los principales corredores industriales del país. Los destinos más frecuentes se concentran en cuatro regiones:",
          ],
          bullets: [
            "Norte: Monterrey, Saltillo, Ramos Arizpe, Torreón, Chihuahua y la franja fronteriza.",
            "Bajío: Querétaro, San Luis Potosí, Guanajuato (León, Silao, Celaya) y Aguascalientes.",
            "Occidente: Guadalajara y su zona metropolitana industrial.",
            "Centro y Pacífico: Ciudad de México, Estado de México, Puebla y puertos del Pacífico.",
          ],
        },
        {
          h2: "Tipos de unidad para carga nacional",
          paragraphs: [
            "Asignamos el equipo según el tipo de mercancía, el peso y la ruta. Todas las unidades son propias y reciben mantenimiento en nuestros propios talleres, lo que reduce fallas en carretera y retrasos en tu entrega.",
          ],
          bullets: [
            "Caja seca de 53 pies para carga paletizada, empaquetada o sensible al clima.",
            "Plataforma para acero, maquinaria, material de construcción y carga suelta.",
            "Configuraciones full (doble remolque) para maximizar volumen por viaje.",
            "Equipo para carga sobredimensionada con permisos y logística especializada.",
          ],
        },
        {
          h2: "Industrias que ya mueven su carga con nosotros",
          paragraphs: [
            "La carga siderúrgica es nuestra especialidad: varilla, perfiles y bobinas para acereras y distribuidores como Ternium y Serviacero. También movemos carga agrícola (forrajes y pacas en plataformas full), producto terminado de manufactura y mercancía de distribución en caja seca.",
            "Cada industria tiene sus propios riesgos de maniobra y sujeción. Nuestros operadores están capacitados en el aseguramiento específico de cada tipo de carga, y el seguro de carga cubre tu mercancía durante todo el trayecto.",
          ],
        },
        {
          h2: "Monitoreo GPS 24/7 desde nuestra sala de control",
          paragraphs: [
            "Cada viaje se supervisa en tiempo real desde nuestra central en Apodaca. Sabemos dónde está tu carga en todo momento y te avisamos de cualquier desviación o demora antes de que se convierta en un problema. Ese seguimiento, más la flota propia y los talleres internos, es lo que nos permite cumplir fechas de entrega de manera consistente.",
          ],
        },
      ],
      faqs: [
        {
          q: "¿A qué estados de México llegan?",
          a: "A los 32 estados. Nuestra mayor densidad de rutas está en el corredor Monterrey–Bajío–Ciudad de México y en el norte del país, pero coordinamos embarques a cualquier destino nacional de puerta a puerta.",
        },
        {
          q: "¿Trabajan con flota propia o subcontratan?",
          a: "Flota 100% propia, operada y mantenida por nuestra propia gente en cinco talleres internos. No subcontratamos tu carga, lo que nos da control total sobre tiempos, unidades y operadores.",
        },
        {
          q: "¿Cómo sé dónde está mi carga durante el viaje?",
          a: "Todas las unidades llevan GPS monitoreado 24/7 desde nuestra sala de control en Apodaca. Te mantenemos informado del avance del embarque y de cualquier eventualidad en ruta.",
        },
        {
          q: "¿Cómo cotizo un flete nacional?",
          a: "Usa el cotizador en línea de la página principal: eliges origen, destino, tipo de unidad y peso, y un agente te confirma la tarifa por WhatsApp en minutos, sin compromiso.",
        },
      ],
      related: [
        { href: "/rutas/monterrey-cdmx", label: "Flete Monterrey–Ciudad de México" },
        { href: "/transporte-de-acero", label: "Transporte de acero: varilla, perfiles y bobinas" },
        { href: "/caja-seca-53", label: "Transporte en caja seca de 53 pies" },
        { href: "/transporte-internacional-mexico-usa", label: "Transporte internacional México–Estados Unidos" },
      ],
      serviceType: "Transporte de carga nacional en México",
    },
    en: {
      breadcrumb: "Domestic trucking",
      kicker: "Service · Mexico domestic",
      metaTitle: "Domestic Trucking in Mexico | ServiExpress JC",
      metaDescription:
        "Full-coverage trucking across Mexico's 32 states with our own fleet, 24/7 GPS tracking and certified drivers. Based in Monterrey. Request a freight quote today.",
      h1: "Domestic trucking across Mexico",
      intro: [
        "We haul freight to all 32 Mexican states from our terminal in Apodaca, Nuevo León — metropolitan Monterrey. We run a 100% company-owned fleet, so your freight is never brokered out, and every truck is tracked by GPS around the clock from our control room.",
        "Since 2005 we have served the steel, agricultural, manufacturing and distribution industries with local, regional and long-haul service. If your cargo moves inside Mexico, we deliver it door to door.",
      ],
      image: { src: "/fleet/transporte-nacional.jpg", alt: "ServiExpress JC Kenworth tractor with a 53-foot dry van loading at a distribution dock" },
      sections: [
        {
          h2: "Coverage across the Mexican Republic",
          paragraphs: [
            "Our domestic operation is based in Monterrey and covers Mexico's main industrial corridors. The busiest lanes concentrate in four regions:",
          ],
          bullets: [
            "North: Monterrey, Saltillo, Ramos Arizpe, Torreón, Chihuahua and the border strip.",
            "Bajío: Querétaro, San Luis Potosí, Guanajuato (León, Silao, Celaya) and Aguascalientes.",
            "West: Guadalajara and its industrial metro area.",
            "Central Mexico and Pacific: Mexico City, State of Mexico, Puebla and Pacific ports.",
          ],
        },
        {
          h2: "Equipment for domestic freight",
          paragraphs: [
            "We match the trailer to your commodity, weight and lane. Every unit is company-owned and maintained in our own shops, which means fewer breakdowns on the road and fewer missed delivery windows.",
          ],
          bullets: [
            "53' dry vans for palletized, packaged or weather-sensitive freight.",
            "Flatbeds for steel, machinery, building materials and loose cargo.",
            "Double-trailer (full) configurations to maximize volume per trip.",
            "Oversize-load equipment with permits and specialized route planning.",
          ],
        },
        {
          h2: "Industries we already move",
          paragraphs: [
            "Steel is our core specialty: rebar, structural shapes and coils for mills and distributors such as Ternium and Serviacero. We also haul agricultural freight (forage and bales on double flatbeds), finished manufactured goods and retail distribution freight in dry vans.",
            "Every commodity has its own securement and handling risks. Our drivers are trained in load securement for each cargo type, and cargo insurance covers your freight for the entire trip.",
          ],
        },
        {
          h2: "24/7 GPS tracking from our control room",
          paragraphs: [
            "Every trip is supervised in real time from our control center in Apodaca. We know where your freight is at all times and flag any deviation or delay before it becomes a problem. That visibility — plus our own fleet and in-house maintenance shops — is how we hit delivery dates consistently.",
          ],
        },
      ],
      faqs: [
        {
          q: "Which Mexican states do you serve?",
          a: "All 32. Our densest lanes run along the Monterrey–Bajío–Mexico City corridor and across northern Mexico, but we coordinate door-to-door shipments to any domestic destination.",
        },
        {
          q: "Do you run your own trucks or broker loads out?",
          a: "100% company-owned fleet, operated and maintained by our own people in five in-house shops. We never broker your freight, which gives us full control over transit times, equipment and drivers.",
        },
        {
          q: "How do I know where my freight is in transit?",
          a: "Every truck carries GPS monitored 24/7 from our control room in Apodaca. We keep you posted on progress and on any event along the route.",
        },
        {
          q: "How do I get a quote for a domestic lane in Mexico?",
          a: "Use the online quote tool on our homepage: pick origin, destination, equipment and weight, and an agent confirms your rate over WhatsApp within minutes, no strings attached.",
        },
      ],
      related: [
        { href: "/rutas/monterrey-cdmx", label: "Monterrey–Mexico City freight lane" },
        { href: "/transporte-de-acero", label: "Steel hauling: rebar, shapes and coils" },
        { href: "/caja-seca-53", label: "53' dry van trucking" },
        { href: "/transporte-internacional-mexico-usa", label: "Cross-border trucking Mexico–USA" },
      ],
      serviceType: "Domestic trucking in Mexico",
    },
  },

  "/transporte-internacional-mexico-usa": {
    es: {
      breadcrumb: "Transporte internacional",
      kicker: "Servicio · MX → USA",
      metaTitle: "Transporte de Carga México–USA por Laredo | ServiExpress JC",
      metaDescription:
        "Transporte internacional puerta a puerta México–Estados Unidos: cruce por Laredo, operadores B1 y unidades de doble placa. Cotiza tu embarque hoy.",
      h1: "Transporte internacional de carga México–Estados Unidos",
      intro: [
        "Cruzamos tu carga a Estados Unidos por Laredo, Texas, con unidades propias de doble placa y operadores certificados B1. Eso significa que la misma empresa que recoge tu mercancía en México la entrega en su destino final en Estados Unidos, sin intermediarios y con monitoreo GPS de principio a fin.",
        "Operamos el corredor Monterrey–Laredo todos los días y entregamos en Texas y el resto de la Unión Americana: desde el área de Houston, San Antonio y Dallas–Fort Worth hasta el Midwest, el Southeast y la costa oeste.",
      ],
      image: { src: "/fleet/cruce-usa.jpg", alt: "Tractor de ServiExpress JC en báscula certificada en Estados Unidos tras cruzar la frontera" },
      sections: [
        {
          h2: "Servicio puerta a puerta, sin ceder tu carga",
          paragraphs: [
            "En el transporte transfronterizo lo normal es que tu mercancía cambie de manos: un transportista mexicano la lleva a frontera, un transfer la cruza y un carrier americano la recoge del otro lado. Cada cambio de manos es un riesgo de daño, demora o pérdida de visibilidad.",
            "Nuestro modelo es distinto: unidades con doble placa México–USA y operadores con visa B1 nos permiten cruzar la frontera con la misma unidad y el mismo operador. Tu carga se toca menos, el tránsito es más corto y tú tienes un solo responsable de origen a destino.",
          ],
        },
        {
          h2: "Así funciona el proceso de cruce por Laredo",
          paragraphs: [
            "El cruce fronterizo tiene fama de complicado, pero con un proceso claro y coordinación con tu agente aduanal se vuelve rutina. Un embarque típico de exportación funciona así:",
          ],
          bullets: [
            "Recolección en tu planta o almacén en México y verificación de documentos del embarque.",
            "Tránsito Monterrey–Laredo por la autopista 85D (aproximadamente 230 km, entre 2.5 y 3 horas de manejo).",
            "Coordinación con tu agente aduanal para la validación del pedimento y la revisión en puente.",
            "Cruce internacional con nuestra unidad de doble placa y operador B1.",
            "Entrega directa en destino final en Texas o transbordo documentado para destinos de larga distancia en USA.",
          ],
        },
        {
          h2: "Tiempos típicos Monterrey–Laredo–Texas",
          paragraphs: [
            "Desde Monterrey, la frontera está a unas 3 horas de manejo. Con documentación lista y cruce fluido, un embarque que sale por la mañana puede estar del lado americano el mismo día. Los destinos principales de Texas —San Antonio, Austin, Houston y Dallas— se alcanzan típicamente en 1 a 2 días puerta a puerta, dependiendo del horario de cruce y la cita de entrega.",
            "Los tiempos exactos dependen del volumen en puente y de la validación aduanal, por eso monitoreamos cada cruce en vivo y te avisamos de inmediato si algo se mueve.",
          ],
        },
        {
          h2: "Qué necesitas para exportar con nosotros",
          paragraphs: [
            "Tú (o tu agente aduanal) mantienen el control de la parte aduanal; nosotros ejecutamos el transporte y coordinamos los tiempos con todas las partes. Trabajamos todos los días con los agentes aduanales de nuestros clientes en Nuevo Laredo y Laredo, y sabemos exactamente qué documento se necesita en qué punto del proceso para que la unidad no se detenga.",
          ],
        },
      ],
      faqs: [
        {
          q: "¿Cruzan con transfer o con unidad propia?",
          a: "Con unidad propia. Nuestras unidades tienen doble placa México–USA y nuestros operadores cuentan con visa B1, así que la misma unidad que carga en México entrega en Estados Unidos. Menos maniobras, menos riesgo y mejor tiempo de tránsito.",
        },
        {
          q: "¿Por qué puerto fronterizo cruzan?",
          a: "Por Laredo, Texas, el puerto terrestre de mayor volumen comercial entre México y Estados Unidos y el cruce natural del corredor Monterrey–Texas. Está a unas 3 horas de nuestra base en Apodaca.",
        },
        {
          q: "¿Ustedes hacen el despacho aduanal?",
          a: "El despacho lo realiza tu agente aduanal; nosotros coordinamos con él la validación, la revisión y los horarios de cruce para que el proceso fluya sin demoras. Si aún no tienes agente aduanal, te orientamos sobre el proceso.",
        },
        {
          q: "¿Cuánto tarda un embarque de Monterrey a Texas?",
          a: "Con documentos listos, los destinos principales de Texas se entregan típicamente en 1 a 2 días puerta a puerta. Monterrey–Laredo son unas 3 horas de manejo y el resto depende del cruce y la distancia al destino final.",
        },
        {
          q: "¿Llegan más allá de Texas?",
          a: "Sí. Texas concentra la mayor parte de nuestras entregas, pero coordinamos embarques al Midwest, al Southeast y a la costa oeste de Estados Unidos.",
        },
      ],
      related: [
        { href: "/rutas/monterrey-laredo", label: "Ruta Monterrey–Laredo: el corredor del cruce" },
        { href: "/rutas/monterrey-houston", label: "Flete Monterrey–Houston puerta a puerta" },
        { href: "/rutas/monterrey-dallas", label: "Flete Monterrey–Dallas puerta a puerta" },
        { href: "/transporte-de-acero", label: "Transporte de acero para exportación" },
      ],
      serviceType: "Transporte internacional de carga México–Estados Unidos",
    },
    en: {
      breadcrumb: "Cross-border trucking",
      kicker: "Service · MX → USA",
      metaTitle: "Cross-Border Trucking Mexico–USA | ServiExpress JC",
      metaDescription:
        "Door-to-door cross-border freight between Mexico and the U.S.: Laredo crossing, B1-certified drivers, dual-plated trucks, 24/7 GPS. Get a quote today.",
      h1: "Cross-border trucking between Mexico and the United States",
      intro: [
        "We move freight across the border at Laredo, Texas, with our own dual-plated trucks and B1-certified drivers. The same carrier that picks up your cargo in Mexico delivers it to its final U.S. destination — no hand-offs, no brokered legs, GPS-tracked the whole way.",
        "We run the Monterrey–Laredo corridor daily and deliver into Texas and beyond: Houston, San Antonio and Dallas–Fort Worth, plus lanes into the Midwest, the Southeast and the West Coast.",
      ],
      image: { src: "/fleet/cruce-usa.jpg", alt: "ServiExpress JC tractor on a certified scale in the United States after crossing the border" },
      sections: [
        {
          h2: "True door-to-door — your freight never changes hands",
          paragraphs: [
            "In typical cross-border moves your freight changes hands three times: a Mexican carrier hauls it to the border, a transfer (drayage) truck crosses it, and a U.S. carrier picks it up on the other side. Every hand-off adds risk of damage, delay and lost visibility.",
            "Our model is different. Dual-plated equipment and B1 drivers let us cross the border with the same truck and the same driver. Your freight is touched less, transit is shorter, and you deal with one accountable carrier from origin to destination.",
          ],
        },
        {
          h2: "How the Laredo crossing works",
          paragraphs: [
            "The border has a reputation for complexity, but with a clear process and coordination with your customs broker it becomes routine. A typical southbound-to-northbound export shipment looks like this:",
          ],
          bullets: [
            "Pickup at your plant or warehouse in Mexico and shipment document check.",
            "Linehaul Monterrey–Laredo on highway 85D (about 230 km / 145 mi, 2.5–3 hours of driving).",
            "Coordination with your customs broker for pedimento validation and bridge inspection.",
            "International crossing with our dual-plated truck and B1 driver.",
            "Direct delivery in Texas, or a documented interchange for long-haul U.S. destinations.",
          ],
        },
        {
          h2: "Typical transit times Monterrey–Laredo–Texas",
          paragraphs: [
            "From Monterrey, the border is about 3 driving hours away. With paperwork ready and a fluid crossing, a shipment that leaves in the morning can be on the U.S. side the same day. Main Texas markets — San Antonio, Austin, Houston and Dallas — typically deliver in 1 to 2 days door to door, depending on bridge traffic and delivery appointments.",
            "Exact timing depends on bridge volume and customs validation, which is why we monitor every crossing live and alert you immediately if anything shifts.",
          ],
        },
        {
          h2: "What you need to ship with us",
          paragraphs: [
            "You (or your customs broker) keep control of the customs side; we execute the transportation and keep every party on schedule. We work daily with our customers' brokers in Nuevo Laredo and Laredo, and we know exactly which document is needed at which step so the truck never sits waiting.",
          ],
        },
      ],
      faqs: [
        {
          q: "Do you cross with a transfer or with your own truck?",
          a: "With our own truck. Our equipment is dual-plated for Mexico and the U.S. and our drivers hold B1 visas, so the truck that loads in Mexico is the one that delivers in the U.S. Fewer touches, less risk, faster transit.",
        },
        {
          q: "Which border crossing do you use?",
          a: "Laredo, Texas — the highest-volume commercial land port between Mexico and the U.S. and the natural gateway of the Monterrey–Texas corridor, about 3 driving hours from our Apodaca terminal.",
        },
        {
          q: "Do you handle customs clearance?",
          a: "Clearance is done by your customs broker; we coordinate validation, inspection and crossing windows with them so the process flows without delays. If you don't have a broker yet, we can walk you through the process.",
        },
        {
          q: "How long does Monterrey to Texas take?",
          a: "With documents ready, main Texas markets typically deliver in 1–2 days door to door. Monterrey–Laredo is about 3 driving hours; the rest depends on the crossing and the final-mile distance.",
        },
        {
          q: "Do you deliver beyond Texas?",
          a: "Yes. Texas concentrates most of our deliveries, but we coordinate freight into the Midwest, the Southeast and the West Coast.",
        },
      ],
      related: [
        { href: "/rutas/monterrey-laredo", label: "Monterrey–Laredo lane: the crossing corridor" },
        { href: "/rutas/monterrey-houston", label: "Monterrey–Houston door-to-door freight" },
        { href: "/rutas/monterrey-dallas", label: "Monterrey–Dallas door-to-door freight" },
        { href: "/transporte-de-acero", label: "Steel hauling for export" },
      ],
      serviceType: "Cross-border trucking between Mexico and the United States",
    },
  },

  "/transporte-de-acero": {
    es: {
      breadcrumb: "Transporte de acero",
      kicker: "Especialidad · Siderúrgica",
      metaTitle: "Transporte de Acero en México y USA | ServiExpress JC",
      metaDescription:
        "Transporte especializado de acero: varilla, perfiles y bobinas con flota propia y operadores expertos en sujeción. Base en Monterrey. Cotiza hoy.",
      h1: "Transporte de acero: varilla, perfiles y bobinas",
      intro: [
        "El acero es la carga que más movemos y la que mejor conocemos. Desde 2005 transportamos varilla, perfiles estructurales, placa y bobinas para acereras, distribuidores y centros de servicio del corredor industrial de Monterrey, incluidos clientes como Ternium y Serviacero.",
        "La carga siderúrgica no perdona errores: es pesada, concentra el peso en puntos específicos y castiga cualquier sujeción deficiente. Por eso nuestros operadores están entrenados específicamente en el manejo y amarre de producto siderúrgico, y nuestras plataformas están equipadas para asegurarlo correctamente.",
      ],
      image: { src: "/fleet/carga-acero.jpg", alt: "Unidad de ServiExpress JC transportando varilla y perfiles de acero asegurados sobre plataforma" },
      sections: [
        {
          h2: "Qué producto siderúrgico movemos",
          paragraphs: [
            "Transportamos las principales presentaciones del acero comercial e industrial:",
          ],
          bullets: [
            "Varilla corrugada en atados, para distribuidores y obra.",
            "Perfiles estructurales: vigas IPR/IPS, canales, ángulos y PTR.",
            "Bobinas y rollos de lámina, con cunas y calzas para transporte seguro.",
            "Placa, lámina en paquete y tubería de acero.",
          ],
        },
        {
          h2: "Aseguramiento de carga: donde no se escatima",
          paragraphs: [
            "Cada embarque de acero se asegura según el tipo de producto: cadenas y matracas para perfil estructural y varilla, cunas y calzas para bobina, protecciones de esquina para producto con acabado y lonas cuando la mercancía debe viajar cubierta.",
            "El operador verifica la sujeción antes de salir y la re-inspecciona en ruta. A eso se suma el monitoreo GPS 24/7 desde nuestra sala de control y un seguro de carga que cubre la mercancía durante todo el trayecto.",
          ],
        },
        {
          h2: "Experiencia real con acereras",
          paragraphs: [
            "Trabajar para acereras y centros de servicio implica cumplir sus estándares: citas de carga estrictas, básculas, requisitos de seguridad en planta y documentación precisa. Nuestros operadores conocen los procesos de carga de las principales plantas del área metropolitana de Monterrey y llegan con la unidad correcta, el equipo de sujeción completo y el EPP requerido.",
            "Esa familiaridad reduce tiempos muertos en planta y evita rechazos de unidad, dos de los costos ocultos más comunes en el flete siderúrgico.",
          ],
        },
        {
          h2: "Acero nacional y de exportación",
          paragraphs: [
            "Movemos acero dentro de México —del corredor Monterrey–Saltillo al Bajío y al centro del país— y también hacia Estados Unidos vía Laredo, con unidades de doble placa y operadores B1 que cruzan la frontera sin transbordar la carga. Si tu producto va a Texas o más allá, el mismo equipo que lo carga en planta lo entrega en destino.",
          ],
        },
      ],
      faqs: [
        {
          q: "¿Qué tipo de acero pueden transportar?",
          a: "Varilla en atados, perfiles estructurales (IPR, canales, ángulos, PTR), bobinas y rollos de lámina, placa y tubería. Si tu producto tiene una presentación especial, lo revisamos y te confirmamos el equipo adecuado.",
        },
        {
          q: "¿Cómo aseguran las bobinas de acero?",
          a: "Con cunas y calzas dedicadas más cadenas con matraca, según el peso y el diámetro de la bobina. El operador documenta la sujeción antes de salir de planta y la re-verifica durante el trayecto.",
        },
        {
          q: "¿Tienen experiencia cargando en acereras como Ternium?",
          a: "Sí. Acereras y distribuidores como Ternium y Serviacero confían su producto a nuestra flota. Nuestros operadores conocen los procesos de carga, báscula y seguridad de las principales plantas de la zona de Monterrey.",
        },
        {
          q: "¿Mueven acero a Estados Unidos?",
          a: "Sí, cruzamos por Laredo con unidades de doble placa y operadores B1, sin transbordar la carga en frontera. Entregamos en Texas y coordinamos destinos de mayor distancia en USA.",
        },
      ],
      related: [
        { href: "/plataforma", label: "Transporte en plataforma" },
        { href: "/carga-sobredimensionada", label: "Carga sobredimensionada con permisos y piloto" },
        { href: "/transporte-internacional-mexico-usa", label: "Transporte internacional México–USA" },
        { href: "/rutas/monterrey-laredo", label: "Ruta Monterrey–Laredo" },
      ],
      serviceType: "Transporte especializado de acero",
    },
    en: {
      breadcrumb: "Steel hauling",
      kicker: "Specialty · Steel",
      metaTitle: "Steel Hauling Mexico–USA: Rebar & Coils | ServiExpress JC",
      metaDescription:
        "Specialized steel hauling: rebar, structural shapes and coils with our own flatbed fleet and securement-trained drivers. Monterrey based. Get a quote.",
      h1: "Steel hauling: rebar, structural shapes and coils",
      intro: [
        "Steel is the freight we move most — and know best. Since 2005 we have hauled rebar, structural shapes, plate and coils for mills, distributors and service centers across the Monterrey industrial corridor, including customers such as Ternium and Serviacero.",
        "Steel freight is unforgiving: it is heavy, it concentrates weight on specific points, and it punishes poor securement. That is why our drivers are trained specifically in handling and tying down steel products, and our flatbeds carry the right securement gear for every load.",
      ],
      image: { src: "/fleet/carga-acero.jpg", alt: "ServiExpress JC truck hauling secured rebar and steel structural shapes on a flatbed trailer" },
      sections: [
        {
          h2: "Steel products we haul",
          paragraphs: ["We transport the main commercial and industrial steel presentations:"],
          bullets: [
            "Bundled rebar for distributors and construction sites.",
            "Structural shapes: wide-flange beams, channels, angles and square tubing.",
            "Coils and sheet rolls, on coil cradles with chocks for safe transport.",
            "Plate, packaged sheet and steel pipe.",
          ],
        },
        {
          h2: "Load securement: where we never cut corners",
          paragraphs: [
            "Every steel load is secured to match the product: chains and ratchet binders for structural shapes and rebar, cradles and chocks for coils, corner protectors for finished product, and tarps when the cargo must ride covered.",
            "Drivers verify securement before departure and re-inspect it en route. On top of that, every trip is GPS-monitored 24/7 from our control room, and cargo insurance covers the freight for the entire haul.",
          ],
        },
        {
          h2: "Real experience with steel mills",
          paragraphs: [
            "Hauling for mills and service centers means meeting their standards: strict loading appointments, scales, in-plant safety requirements and precise paperwork. Our drivers know the loading processes at the main plants around metropolitan Monterrey and show up with the right trailer, complete securement gear and the required PPE.",
            "That familiarity cuts dwell time at the plant and avoids truck rejections — two of the most common hidden costs in steel freight.",
          ],
        },
        {
          h2: "Domestic and export steel",
          paragraphs: [
            "We move steel within Mexico — from the Monterrey–Saltillo corridor to the Bajío and central Mexico — and into the United States via Laredo, with dual-plated trucks and B1 drivers that cross the border without transloading. If your product ships to Texas or beyond, the same crew that loads it at the mill delivers it at destination.",
          ],
        },
      ],
      faqs: [
        {
          q: "What kinds of steel can you haul?",
          a: "Bundled rebar, structural shapes (beams, channels, angles, tubing), coils and sheet rolls, plate and pipe. If your product has a special presentation, we review it and confirm the right equipment.",
        },
        {
          q: "How do you secure steel coils?",
          a: "With dedicated coil cradles and chocks plus ratchet-bound chains, sized to the coil's weight and diameter. The driver documents securement before leaving the plant and re-checks it en route.",
        },
        {
          q: "Do you have experience loading at mills like Ternium?",
          a: "Yes. Mills and distributors such as Ternium and Serviacero trust their product to our fleet. Our drivers know the loading, scale and safety processes at the main plants in the Monterrey area.",
        },
        {
          q: "Do you haul steel into the U.S.?",
          a: "Yes — we cross at Laredo with dual-plated trucks and B1 drivers, without transloading at the border. We deliver in Texas and coordinate longer hauls across the U.S.",
        },
      ],
      related: [
        { href: "/plataforma", label: "Flatbed trucking" },
        { href: "/carga-sobredimensionada", label: "Oversize load transport with permits and escorts" },
        { href: "/transporte-internacional-mexico-usa", label: "Cross-border trucking Mexico–USA" },
        { href: "/rutas/monterrey-laredo", label: "Monterrey–Laredo lane" },
      ],
      serviceType: "Specialized steel hauling",
    },
  },

  "/carga-sobredimensionada": {
    es: {
      breadcrumb: "Carga sobredimensionada",
      kicker: "Especialidad · Oversize",
      metaTitle: "Transporte de Carga Sobredimensionada | ServiExpress JC",
      metaDescription:
        "Carga sobredimensionada con permisos SICT, carros piloto y planeación de ruta. Flota propia desde Monterrey a todo México y USA. Cotiza tu proyecto.",
      h1: "Transporte de carga sobredimensionada",
      intro: [
        "Cuando la carga excede las dimensiones o el peso reglamentario, el flete deja de ser rutina y se convierte en un proyecto: permisos, estudio de ruta, horarios restringidos y escoltas. Nosotros nos encargamos de esa complejidad completa para que tu maquinaria, estructura o equipo llegue a destino sin sorpresas.",
        "Operamos carga sobredimensionada dentro de México desde nuestra base en Monterrey y coordinamos también movimientos de exportación hacia Estados Unidos vía Laredo.",
      ],
      image: { src: "/fleet/kenworth-clasico.jpg", alt: "Tractocamión Kenworth de la flota propia de ServiExpress JC" },
      sections: [
        {
          h2: "Permisos y normatividad SICT",
          paragraphs: [
            "En México, todo embarque que rebasa los pesos y dimensiones de la NOM-012 requiere permiso especial de la SICT (antes SCT) para circular por carreteras federales. Ese permiso define la ruta autorizada, los horarios de circulación permitidos y las medidas de acompañamiento obligatorias según el exceso de dimensiones.",
            "Nosotros gestionamos ese trámite como parte del servicio: dimensionamos la carga, integramos el expediente y programamos el viaje dentro de las ventanas autorizadas, para que tú no tengas que aprender regulación de autotransporte.",
          ],
        },
        {
          h2: "Carros piloto y logística de acompañamiento",
          paragraphs: [
            "Según las dimensiones del embarque, la norma exige vehículos piloto que abran y cierren el convoy, señalización especial (banderas y letreros de dimensiones excedidas) y, en casos mayores, coordinación con autoridades locales para maniobras en zonas urbanas.",
            "Coordinamos toda esa logística: los pilotos, la comunicación con el operador durante el trayecto y los puntos de descanso seguros para un convoy que no puede detenerse en cualquier lado.",
          ],
        },
        {
          h2: "Planeación de ruta: el trabajo invisible",
          paragraphs: [
            "El éxito de un movimiento sobredimensionado se decide antes de cargar. Nuestro equipo estudia la ruta completa: alturas de puentes y pasos a desnivel, anchos de carril en curvas, restricciones de peso en estructuras y horarios de circulación permitidos en cada tramo.",
            "Con la ruta validada, definimos el programa del viaje y te lo compartimos junto con el monitoreo GPS en vivo, para que sepas dónde está tu equipo en cada etapa del trayecto.",
          ],
        },
        {
          h2: "Qué tipo de carga sobredimensionada movemos",
          paragraphs: [],
          bullets: [
            "Maquinaria industrial y de construcción.",
            "Estructuras metálicas y prefabricados de gran formato.",
            "Equipos y componentes industriales que exceden dimensiones estándar.",
            "Cargas de gran peso concentrado que requieren equipo especializado.",
          ],
        },
      ],
      faqs: [
        {
          q: "¿Qué se considera carga sobredimensionada en México?",
          a: "Todo embarque que excede los pesos y dimensiones máximos de la NOM-012 para circular sin permiso: exceso de ancho, alto, largo o peso bruto. Cada caso se dimensiona y se tramita el permiso SICT correspondiente.",
        },
        {
          q: "¿Ustedes tramitan los permisos o los tramito yo?",
          a: "Los gestionamos nosotros como parte del servicio: dimensionamos la carga, armamos el expediente y programamos el viaje dentro de los horarios autorizados por el permiso.",
        },
        {
          q: "¿Cuándo se necesitan carros piloto?",
          a: "Depende del exceso de dimensiones: la regulación define cuántos vehículos de acompañamiento se requieren según el ancho, largo y las carreteras de la ruta. Al cotizar tu embarque te confirmamos la configuración exacta.",
        },
        {
          q: "¿Con cuánta anticipación debo cotizar un movimiento sobredimensionado?",
          a: "Lo ideal es contactarnos en cuanto tengas dimensiones y peso estimados. El estudio de ruta y el permiso toman tiempo, y programar con anticipación evita costos de urgencia.",
        },
      ],
      related: [
        { href: "/transporte-de-acero", label: "Transporte de acero y estructuras" },
        { href: "/plataforma", label: "Transporte en plataforma" },
        { href: "/transporte-nacional", label: "Transporte nacional de carga" },
        { href: "/transporte-internacional-mexico-usa", label: "Exportación México–USA" },
      ],
      serviceType: "Transporte de carga sobredimensionada",
    },
    en: {
      breadcrumb: "Oversize loads",
      kicker: "Specialty · Oversize",
      metaTitle: "Oversize Load Transport Mexico–USA | ServiExpress JC",
      metaDescription:
        "Oversize load transport with SICT permits, pilot cars and route surveys. Company-owned fleet based in Monterrey, serving Mexico and the U.S. Get a quote.",
      h1: "Oversize load transport",
      intro: [
        "When cargo exceeds legal dimensions or weight, freight stops being routine and becomes a project: permits, route surveys, restricted travel windows and escorts. We take on that entire complexity so your machinery, structure or equipment arrives without surprises.",
        "We run oversize loads across Mexico from our Monterrey base and coordinate export moves into the United States via Laredo.",
      ],
      image: { src: "/fleet/kenworth-clasico.jpg", alt: "Kenworth tractor from ServiExpress JC's company-owned fleet" },
      sections: [
        {
          h2: "Permits and SICT regulations",
          paragraphs: [
            "In Mexico, any shipment exceeding the weights and dimensions of standard NOM-012 limits requires a special permit from the SICT (Mexico's transport ministry, formerly SCT) to travel on federal highways. The permit defines the authorized route, allowed travel windows and mandatory escort measures based on how far the load exceeds standard dimensions.",
            "We manage that paperwork as part of the service: we measure the load, build the file and schedule the move inside the authorized windows — so you don't have to learn Mexican trucking regulation.",
          ],
        },
        {
          h2: "Pilot cars and escort logistics",
          paragraphs: [
            "Depending on the load's dimensions, regulation requires pilot vehicles leading and trailing the convoy, special signage (flags and oversize banners) and, for the largest moves, coordination with local authorities for urban maneuvers.",
            "We coordinate all of it: the escorts, live communication with the driver, and safe staging points for a convoy that can't simply pull over anywhere.",
          ],
        },
        {
          h2: "Route planning: the invisible work",
          paragraphs: [
            "An oversize move succeeds or fails before loading. Our team surveys the full route: bridge and overpass clearances, lane widths on curves, structural weight restrictions and permitted travel windows on each segment.",
            "Once the route is validated, we define the trip schedule and share it with you along with live GPS tracking, so you know where your equipment is at every stage.",
          ],
        },
        {
          h2: "Oversize cargo we move",
          paragraphs: [],
          bullets: [
            "Industrial and construction machinery.",
            "Steel structures and large-format precast components.",
            "Industrial equipment and components beyond standard dimensions.",
            "Heavy concentrated loads requiring specialized equipment.",
          ],
        },
      ],
      faqs: [
        {
          q: "What counts as an oversize load in Mexico?",
          a: "Any shipment exceeding the maximum weights and dimensions allowed without a permit under NOM-012: excess width, height, length or gross weight. Each case is measured and the corresponding SICT permit is processed.",
        },
        {
          q: "Do you handle the permits or do I?",
          a: "We manage them as part of the service: we measure the load, assemble the file and schedule the trip within the travel windows the permit authorizes.",
        },
        {
          q: "When are pilot cars required?",
          a: "It depends on the dimensional excess: regulation defines how many escort vehicles are required based on width, length and the highways on the route. We confirm the exact configuration when quoting your shipment.",
        },
        {
          q: "How far in advance should I request a quote?",
          a: "Ideally as soon as you have estimated dimensions and weight. Route surveys and permits take time, and planning ahead avoids rush costs.",
        },
      ],
      related: [
        { href: "/transporte-de-acero", label: "Steel and structural hauling" },
        { href: "/plataforma", label: "Flatbed trucking" },
        { href: "/transporte-nacional", label: "Domestic trucking in Mexico" },
        { href: "/transporte-internacional-mexico-usa", label: "Mexico–USA cross-border freight" },
      ],
      serviceType: "Oversize load transport",
    },
  },

  "/caja-seca-53": {
    es: {
      breadcrumb: "Caja seca 53'",
      kicker: "Equipo · Caja seca",
      metaTitle: "Transporte en Caja Seca 53 Pies México–USA | ServiExpress JC",
      metaDescription:
        "Caja seca de 53 pies para carga paletizada y mercancía sensible: flota propia, GPS 24/7 y cruce por Laredo. Base en Monterrey. Cotiza tu embarque.",
      h1: "Transporte en caja seca de 53 pies",
      intro: [
        "La caja seca de 53 pies es el caballo de batalla del transporte de mercancía terminada: protege la carga del clima, del polvo del camino y de miradas ajenas, y estandariza la carga y descarga en andén. Operamos cajas de 53 pies propias para rutas nacionales y para exportación a Estados Unidos vía Laredo.",
        "Si tu producto viaja en tarima, en cajas o requiere ir cerrado y sellado, este es el equipo indicado.",
      ],
      image: { src: "/fleet/flota-patio.jpg", alt: "Flota de tractocamiones y cajas secas de ServiExpress JC en su terminal de Apodaca" },
      sections: [
        {
          h2: "Qué cabe en una caja seca de 53 pies",
          paragraphs: [
            "El remolque de 53 pies (unos 16.15 metros de largo) es el estándar de mayor capacidad en Norteamérica para carga seca. En términos prácticos:",
          ],
          bullets: [
            "Hasta 26 tarimas estándar (1.0 × 1.2 m) acomodadas a un nivel.",
            "Carga suelta o en cajas aprovechando el volumen completo del remolque.",
            "Peso útil sujeto a la configuración del tractocamión y a la NOM-012 en México, y a los límites de peso aplicables en Estados Unidos.",
          ],
        },
        {
          h2: "Protección y seguridad de la mercancía",
          paragraphs: [
            "La caja seca viaja cerrada con sello o candado documentado desde el origen, y el número de sello se registra en la documentación del embarque. La unidad se monitorea por GPS las 24 horas desde nuestra sala de control, y cualquier parada no programada genera una alerta inmediata.",
            "Para mercancía de valor o sensible al manejo, esa combinación —remolque cerrado, sello documentado y monitoreo continuo— es la forma más efectiva de reducir riesgo en carretera.",
          ],
        },
        {
          h2: "Rutas nacionales y cruce a Estados Unidos",
          paragraphs: [
            "Operamos caja seca en los corredores nacionales de mayor demanda —Monterrey a Ciudad de México, el Bajío y el norte del país— y en el corredor de exportación Monterrey–Laredo–Texas.",
            "En el servicio internacional, nuestras unidades de doble placa y operadores B1 cruzan la frontera sin transbordar tu mercancía: la misma caja que se sella en tu andén en México se abre hasta el andén de tu cliente en Estados Unidos.",
          ],
        },
        {
          h2: "Industrias típicas en caja seca",
          paragraphs: [],
          bullets: [
            "Manufactura y producto terminado de exportación.",
            "Bienes de consumo y mercancía de distribución para retail.",
            "Insumos industriales paletizados.",
            "Mercancía que requiere viajar cerrada, sellada y sin exposición al clima.",
          ],
        },
      ],
      faqs: [
        {
          q: "¿Cuántas tarimas caben en una caja seca de 53 pies?",
          a: "Hasta 26 tarimas estándar a un nivel. Si tu producto permite estiba doble, el número puede aumentar; lo revisamos contigo al cotizar según el peso y la naturaleza de la mercancía.",
        },
        {
          q: "¿La caja viaja sellada?",
          a: "Sí. Se documenta el número de sello o candado desde el origen y se verifica en destino. Junto con el monitoreo GPS 24/7, es la mejor protección para mercancía terminada.",
        },
        {
          q: "¿Puedo mover caja seca de México a Estados Unidos con ustedes?",
          a: "Sí. Cruzamos por Laredo con unidades de doble placa y operadores B1, sin transbordo: la misma caja sellada en tu planta llega al andén de destino en USA.",
        },
        {
          q: "¿Qué carga no va en caja seca?",
          a: "Carga que excede las dimensiones internas del remolque, producto que requiere temperatura controlada o mercancía que por su forma debe cargarse por arriba o por los costados; para eso están la plataforma o el equipo especializado.",
        },
      ],
      related: [
        { href: "/plataforma", label: "Transporte en plataforma" },
        { href: "/transporte-nacional", label: "Transporte nacional de carga" },
        { href: "/transporte-internacional-mexico-usa", label: "Transporte internacional México–USA" },
        { href: "/rutas/monterrey-cdmx", label: "Flete Monterrey–Ciudad de México" },
      ],
      serviceType: "Transporte en caja seca de 53 pies",
    },
    en: {
      breadcrumb: "53' dry van",
      kicker: "Equipment · Dry van",
      metaTitle: "53' Dry Van Trucking Mexico–USA | ServiExpress JC",
      metaDescription:
        "53' dry van service for palletized and sensitive freight: company-owned fleet, 24/7 GPS, sealed trailers, Laredo crossing. Monterrey based. Get a quote.",
      h1: "53' dry van trucking",
      intro: [
        "The 53-foot dry van is the workhorse of finished-goods freight: it protects cargo from weather, road dust and prying eyes, and standardizes dock loading and unloading. We run company-owned 53' dry vans on domestic Mexican lanes and on export lanes into the United States via Laredo.",
        "If your product ships on pallets, in boxes, or needs to travel closed and sealed, this is the right equipment.",
      ],
      image: { src: "/fleet/flota-patio.jpg", alt: "ServiExpress JC tractors and dry van trailers lined up at the Apodaca terminal" },
      sections: [
        {
          h2: "What fits in a 53' dry van",
          paragraphs: [
            "The 53-foot trailer (about 16.15 meters long) is North America's highest-capacity standard for dry freight. In practical terms:",
          ],
          bullets: [
            "Up to 26 standard pallets (40\" × 48\") single-stacked.",
            "Loose or boxed freight using the trailer's full cube.",
            "Payload subject to tractor configuration and NOM-012 in Mexico, and to applicable U.S. weight limits.",
          ],
        },
        {
          h2: "Cargo protection and security",
          paragraphs: [
            "The van travels closed with a documented seal or padlock from origin, and the seal number is recorded on the shipment paperwork. The truck is GPS-monitored 24/7 from our control room, and any unscheduled stop triggers an immediate alert.",
            "For high-value or handling-sensitive freight, that combination — closed trailer, documented seal and continuous monitoring — is the most effective way to cut over-the-road risk.",
          ],
        },
        {
          h2: "Domestic lanes and U.S. crossings",
          paragraphs: [
            "We run dry vans on Mexico's highest-demand corridors — Monterrey to Mexico City, the Bajío and the north — and on the Monterrey–Laredo–Texas export corridor.",
            "On international moves, our dual-plated trucks and B1 drivers cross the border without transloading: the same van sealed at your dock in Mexico opens at your customer's dock in the U.S.",
          ],
        },
        {
          h2: "Typical dry van industries",
          paragraphs: [],
          bullets: [
            "Manufacturing and export finished goods.",
            "Consumer goods and retail distribution freight.",
            "Palletized industrial inputs.",
            "Freight that must travel closed, sealed and weather-protected.",
          ],
        },
      ],
      faqs: [
        {
          q: "How many pallets fit in a 53' dry van?",
          a: "Up to 26 standard pallets single-stacked. If your product allows double-stacking, the count can increase — we confirm it when quoting, based on weight and commodity.",
        },
        {
          q: "Does the trailer travel sealed?",
          a: "Yes. The seal or padlock number is documented at origin and verified at destination. Combined with 24/7 GPS monitoring, it's the best protection for finished goods.",
        },
        {
          q: "Can you run a dry van from Mexico into the U.S.?",
          a: "Yes. We cross at Laredo with dual-plated trucks and B1 drivers, no transloading: the same van sealed at your plant arrives at the destination dock in the U.S.",
        },
        {
          q: "What freight doesn't belong in a dry van?",
          a: "Cargo exceeding the trailer's interior dimensions, temperature-controlled product, or freight that must be loaded from the top or sides — that's what flatbeds and specialized equipment are for.",
        },
      ],
      related: [
        { href: "/plataforma", label: "Flatbed trucking" },
        { href: "/transporte-nacional", label: "Domestic trucking in Mexico" },
        { href: "/transporte-internacional-mexico-usa", label: "Cross-border trucking Mexico–USA" },
        { href: "/rutas/monterrey-cdmx", label: "Monterrey–Mexico City freight lane" },
      ],
      serviceType: "53' dry van trucking",
    },
  },

  "/plataforma": {
    es: {
      breadcrumb: "Plataforma",
      kicker: "Equipo · Plataforma",
      metaTitle: "Transporte en Plataforma México–USA | ServiExpress JC",
      metaDescription:
        "Plataformas para acero, maquinaria y materiales: amarre profesional, lonas, fulls y cruce por Laredo. Flota propia en Monterrey. Cotiza tu carga hoy.",
      h1: "Transporte en plataforma",
      intro: [
        "La plataforma es el equipo más versátil del autotransporte: carga por arriba, por los costados o con montacargas desde cualquier ángulo, y admite mercancía que simplemente no cabe en una caja. Operamos plataformas propias desde Monterrey para carga siderúrgica, maquinaria, materiales de construcción y carga suelta.",
        "Es también el equipo donde más importa la experiencia del operador: un amarre deficiente no se nota en el patio, se nota en la primera curva. Por eso el aseguramiento de carga es parte central de nuestro entrenamiento.",
      ],
      image: { src: "/fleet/carga-acero.jpg", alt: "Plataforma de ServiExpress JC cargada con perfiles de acero asegurados con cadenas" },
      sections: [
        {
          h2: "Qué carga va en plataforma",
          paragraphs: ["La plataforma es el equipo natural para:"],
          bullets: [
            "Acero: varilla, perfiles, placa, bobinas y tubería.",
            "Maquinaria industrial, agrícola y de construcción.",
            "Materiales de construcción: prefabricados, estructuras y paneles.",
            "Carga agrícola voluminosa, como pacas y forrajes, incluso en configuración full.",
            "Cualquier mercancía que exceda las dimensiones internas de una caja seca.",
          ],
        },
        {
          h2: "Amarre y protección: el oficio de la plataforma",
          paragraphs: [
            "Cada carga se asegura con el equipo que corresponde: cadenas y matracas para acero y maquinaria, bandas textiles para producto que se daña con cadena, esquineros para proteger aristas y lonas cuando la mercancía debe viajar cubierta contra clima o polvo.",
            "Nuestros operadores verifican el amarre antes de salir y lo re-inspeccionan en paradas programadas durante el trayecto. Es el mismo estándar que nos exigen las acereras con las que trabajamos todos los días.",
          ],
        },
        {
          h2: "Configuraciones sencillas y full",
          paragraphs: [
            "Además de la plataforma sencilla, operamos configuraciones full (dos remolques) que duplican el volumen por viaje en rutas nacionales donde la regulación lo permite. Para carga que excede dimensiones estándar de ancho, alto o peso, la plataforma se complementa con nuestro servicio de carga sobredimensionada con permisos y escoltas.",
          ],
        },
        {
          h2: "Plataforma nacional y de exportación",
          paragraphs: [
            "Movemos plataforma en todo México y hacia Estados Unidos vía Laredo. En el servicio internacional aplica la misma ventaja que en todos nuestros cruces: unidades de doble placa y operadores B1 que entregan del otro lado sin transbordar tu carga en la frontera.",
          ],
        },
      ],
      faqs: [
        {
          q: "¿Qué medidas tiene una plataforma?",
          a: "Operamos plataformas de medidas estándar del mercado norteamericano, incluyendo 53 pies. El equipo exacto se asigna según el largo, peso y tipo de tu carga al momento de cotizar.",
        },
        {
          q: "¿La carga puede viajar cubierta?",
          a: "Sí. Si tu mercancía debe protegerse del clima o del polvo, se entarpa con lonas y se asegura igual que la carga descubierta. Indícalo al cotizar para asignar el equipo con lona.",
        },
        {
          q: "¿Pueden cargar con grúa o montacargas en mi patio?",
          a: "La plataforma se carga por arriba o por los costados con tu equipo de maniobras. Nuestro operador coordina la maniobra y verifica la distribución de peso y el amarre antes de salir.",
        },
        {
          q: "¿Qué pasa si mi carga excede las dimensiones de la plataforma?",
          a: "Se maneja como carga sobredimensionada: tramitamos el permiso SICT, planeamos la ruta y coordinamos carros piloto si el exceso lo requiere. Cotízala con dimensiones y peso y te confirmamos la configuración.",
        },
      ],
      related: [
        { href: "/transporte-de-acero", label: "Transporte de acero: varilla, perfiles y bobinas" },
        { href: "/carga-sobredimensionada", label: "Carga sobredimensionada" },
        { href: "/caja-seca-53", label: "Transporte en caja seca de 53 pies" },
        { href: "/transporte-nacional", label: "Transporte nacional de carga" },
      ],
      serviceType: "Transporte en plataforma",
    },
    en: {
      breadcrumb: "Flatbed",
      kicker: "Equipment · Flatbed",
      metaTitle: "Flatbed Trucking Mexico–USA | ServiExpress JC",
      metaDescription:
        "Flatbed trucking for steel, machinery and building materials: pro load securement, tarps and Laredo crossings. Own fleet in Monterrey. Get a quote today.",
      h1: "Flatbed trucking",
      intro: [
        "The flatbed is trucking's most versatile trailer: load from the top, the sides, or with a forklift from any angle, and carry freight that simply doesn't fit in a van. We run company-owned flatbeds out of Monterrey for steel, machinery, building materials and loose cargo.",
        "It's also the equipment where driver skill matters most: poor securement isn't visible in the yard — it shows up in the first curve. That's why load securement is central to our driver training.",
      ],
      image: { src: "/fleet/carga-acero.jpg", alt: "ServiExpress JC flatbed loaded with steel shapes secured with chains" },
      sections: [
        {
          h2: "Freight that belongs on a flatbed",
          paragraphs: ["The flatbed is the natural equipment for:"],
          bullets: [
            "Steel: rebar, structural shapes, plate, coils and pipe.",
            "Industrial, agricultural and construction machinery.",
            "Building materials: precast, structures and panels.",
            "High-volume agricultural freight such as bales and forage, including double-trailer configurations.",
            "Any commodity that exceeds a dry van's interior dimensions.",
          ],
        },
        {
          h2: "Securement and protection: the flatbed craft",
          paragraphs: [
            "Every load gets the securement it requires: chains and ratchet binders for steel and machinery, textile straps for chain-sensitive product, corner protectors for edges, and tarps when freight must ride covered against weather or dust.",
            "Our drivers verify tie-downs before departure and re-inspect them at scheduled stops en route. It's the same standard the steel mills we serve daily demand from us.",
          ],
        },
        {
          h2: "Single and double-trailer configurations",
          paragraphs: [
            "Beyond the single flatbed, we run double-trailer (full) configurations that double the volume per trip on domestic lanes where regulation allows it. For freight beyond standard width, height or weight, the flatbed pairs with our oversize-load service, including permits and escorts.",
          ],
        },
        {
          h2: "Domestic and export flatbed",
          paragraphs: [
            "We run flatbeds across Mexico and into the United States via Laredo. International moves carry the same advantage as all our crossings: dual-plated trucks and B1 drivers that deliver on the U.S. side without transloading your freight at the border.",
          ],
        },
      ],
      faqs: [
        {
          q: "What flatbed sizes do you run?",
          a: "Standard North American flatbed sizes, including 53-foot trailers. The exact unit is assigned based on your cargo's length, weight and type when we quote.",
        },
        {
          q: "Can the load travel covered?",
          a: "Yes. If your freight needs protection from weather or dust, we tarp it and secure it just like open loads. Mention it when requesting a quote so we assign tarp-equipped gear.",
        },
        {
          q: "Can you load by crane or forklift at my yard?",
          a: "Flatbeds load from the top or the sides with your handling equipment. Our driver coordinates the maneuver and verifies weight distribution and securement before rolling.",
        },
        {
          q: "What if my cargo exceeds flatbed dimensions?",
          a: "It's handled as an oversize load: we process the SICT permit, plan the route and coordinate pilot cars if the excess requires them. Quote it with dimensions and weight and we'll confirm the setup.",
        },
      ],
      related: [
        { href: "/transporte-de-acero", label: "Steel hauling: rebar, shapes and coils" },
        { href: "/carga-sobredimensionada", label: "Oversize load transport" },
        { href: "/caja-seca-53", label: "53' dry van trucking" },
        { href: "/transporte-nacional", label: "Domestic trucking in Mexico" },
      ],
      serviceType: "Flatbed trucking",
    },
  },
}

import type { LocalizedPage } from "./types"

/**
 * Páginas de rutas (long-tail). Distancias y tiempos son rangos típicos de
 * carretera, siempre expresados como aproximados; nunca prometen tiempos
 * garantizados porque el cruce y las citas de entrega varían.
 */
export const ROUTE_PAGES: Record<string, LocalizedPage> = {
  "/rutas/monterrey-laredo": {
    es: {
      breadcrumb: "Monterrey–Laredo",
      kicker: "Ruta · Frontera",
      metaTitle: "Flete Monterrey–Laredo: Cruce y Tiempos | ServiExpress JC",
      metaDescription:
        "Flete Monterrey–Laredo con flota propia: ~230 km por la 85D, cruce internacional con operadores B1 y doble placa. Cotiza tu embarque hoy mismo.",
      h1: "Flete Monterrey–Laredo: el corredor del cruce",
      intro: [
        "Monterrey–Laredo es el corredor de exportación más importante de México: por ahí pasa la mayor parte del comercio terrestre entre los dos países. Es también nuestra ruta de casa: la operamos todos los días desde nuestra base en Apodaca, a la entrada del corredor.",
        "Son aproximadamente 230 kilómetros por la autopista 85D vía Nuevo Laredo, entre 2.5 y 3 horas de manejo hasta la frontera.",
      ],
      image: { src: "/fleet/cruce-usa.jpg", alt: "Unidad de ServiExpress JC en el corredor fronterizo Monterrey–Laredo" },
      sections: [
        {
          h2: "Distancia y tiempo de tránsito típico",
          paragraphs: [
            "Del área metropolitana de Monterrey a Nuevo Laredo son unos 230 km por la autopista de cuota 85D, un tramo de 2.5 a 3 horas para un tractocamión cargado. Con documentación lista, un embarque que sale de Monterrey por la mañana puede estar cruzando el puente el mismo día.",
            "El tiempo total puerta a puerta depende del flujo en el puente internacional y de la validación aduanal, variables que monitoreamos en vivo para anticiparle cualquier cambio al cliente.",
          ],
        },
        {
          h2: "Qué carga se mueve en este corredor",
          paragraphs: ["Por Monterrey–Laredo movemos principalmente:"],
          bullets: [
            "Acero de exportación: varilla, perfiles y bobinas de las acereras regionales.",
            "Producto terminado de manufactura del clúster industrial de Nuevo León.",
            "Mercancía en caja seca de 53 pies con destino a Texas y el interior de USA.",
            "Carga de importación de retorno, aprovechando el viaje redondo.",
          ],
        },
        {
          h2: "El cruce: nuestra ventaja en esta ruta",
          paragraphs: [
            "La diferencia entre un transportista más y un socio en esta ruta es el cruce. Nuestras unidades de doble placa y operadores con visa B1 cruzan la frontera sin transbordar la carga: la misma unidad que carga en tu planta en Monterrey entrega en Laredo o sigue hacia el interior de Texas.",
            "Coordinamos con tu agente aduanal la validación del pedimento y los horarios de puente, y nuestra sala de control sigue cada cruce en tiempo real.",
          ],
        },
      ],
      faqs: [
        {
          q: "¿Cuánto se hace de Monterrey a Laredo en tractocamión?",
          a: "Entre 2.5 y 3 horas de manejo por la autopista 85D (aproximadamente 230 km). El tiempo total del embarque depende del flujo del puente y de la validación aduanal.",
        },
        {
          q: "¿El flete incluye el cruce internacional?",
          a: "Sí. Cruzamos con unidades de doble placa y operadores B1, sin transfer, y entregamos en Laredo o en el destino final en Texas según lo que necesites.",
        },
        {
          q: "¿Qué documentos necesito para exportar por Laredo?",
          a: "La documentación aduanal la gestiona tu agente aduanal (pedimento, factura, packing list); nosotros coordinamos con él los tiempos de cruce y llevamos la documentación de transporte del embarque.",
        },
        {
          q: "¿Manejan viaje redondo Monterrey–Laredo?",
          a: "Sí, coordinamos carga de retorno cuando la hay disponible, lo que puede mejorar la tarifa de tu embarque. Coméntalo al cotizar.",
        },
      ],
      related: [
        { href: "/transporte-internacional-mexico-usa", label: "Transporte internacional México–USA" },
        { href: "/rutas/monterrey-houston", label: "Flete Monterrey–Houston" },
        { href: "/rutas/monterrey-dallas", label: "Flete Monterrey–Dallas" },
        { href: "/transporte-de-acero", label: "Transporte de acero de exportación" },
      ],
      serviceType: "Flete Monterrey–Laredo",
    },
    en: {
      breadcrumb: "Monterrey–Laredo",
      kicker: "Lane · Border",
      metaTitle: "Monterrey–Laredo Freight & Border Crossing | ServiExpress JC",
      metaDescription:
        "Monterrey–Laredo trucking with our own fleet: ~145 mi on highway 85D, direct border crossing with B1 drivers and dual plates. Request your quote today.",
      h1: "Monterrey–Laredo freight: the crossing corridor",
      intro: [
        "Monterrey–Laredo is Mexico's most important export corridor — most overland trade between the two countries moves through it. It's also our home lane: we run it daily from our terminal in Apodaca, right at the corridor's entrance.",
        "The run is roughly 230 km (145 mi) on toll highway 85D via Nuevo Laredo — 2.5 to 3 driving hours to the border.",
      ],
      image: { src: "/fleet/cruce-usa.jpg", alt: "ServiExpress JC truck on the Monterrey–Laredo border corridor" },
      sections: [
        {
          h2: "Distance and typical transit time",
          paragraphs: [
            "From metropolitan Monterrey to Nuevo Laredo it's about 230 km (145 mi) on toll road 85D — 2.5 to 3 hours for a loaded tractor-trailer. With paperwork ready, a shipment leaving Monterrey in the morning can be crossing the bridge the same day.",
            "Total door-to-door time depends on bridge flow and customs validation — variables we monitor live so we can flag any change to you before it costs time.",
          ],
        },
        {
          h2: "Freight that moves on this corridor",
          paragraphs: ["On Monterrey–Laredo we mainly haul:"],
          bullets: [
            "Export steel: rebar, shapes and coils from the regional mills.",
            "Finished goods from Nuevo León's manufacturing cluster.",
            "53' dry van freight bound for Texas and the U.S. interior.",
            "Southbound return freight, making round trips more efficient.",
          ],
        },
        {
          h2: "The crossing: our edge on this lane",
          paragraphs: [
            "What separates a vendor from a partner on this lane is the crossing itself. Our dual-plated trucks and B1-visa drivers cross the border without transloading: the truck that loads at your Monterrey plant delivers in Laredo or keeps rolling into Texas.",
            "We coordinate pedimento validation and bridge windows with your customs broker, and our control room tracks every crossing in real time.",
          ],
        },
      ],
      faqs: [
        {
          q: "How long is Monterrey to Laredo by truck?",
          a: "2.5 to 3 driving hours on highway 85D (about 230 km / 145 mi). Total shipment time depends on bridge flow and customs validation.",
        },
        {
          q: "Does the rate include the international crossing?",
          a: "Yes. We cross with dual-plated trucks and B1 drivers — no transfer — and deliver in Laredo or at the final Texas destination, whichever you need.",
        },
        {
          q: "What documents do I need to export through Laredo?",
          a: "Customs documentation is handled by your customs broker (pedimento, invoice, packing list); we coordinate crossing windows with them and carry the shipment's transport documents.",
        },
        {
          q: "Do you run Monterrey–Laredo round trips?",
          a: "Yes — we coordinate return freight when available, which can improve your lane rate. Mention it when requesting a quote.",
        },
      ],
      related: [
        { href: "/transporte-internacional-mexico-usa", label: "Cross-border trucking Mexico–USA" },
        { href: "/rutas/monterrey-houston", label: "Monterrey–Houston freight" },
        { href: "/rutas/monterrey-dallas", label: "Monterrey–Dallas freight" },
        { href: "/transporte-de-acero", label: "Export steel hauling" },
      ],
      serviceType: "Monterrey–Laredo freight",
    },
  },

  "/rutas/monterrey-houston": {
    es: {
      breadcrumb: "Monterrey–Houston",
      kicker: "Ruta · Texas",
      metaTitle: "Flete Monterrey–Houston Puerta a Puerta | ServiExpress JC",
      metaDescription:
        "Flete Monterrey–Houston puerta a puerta: ~830 km con cruce por Laredo, unidades de doble placa y GPS 24/7. Entrega típica en 1–2 días. Cotiza hoy.",
      h1: "Flete Monterrey–Houston puerta a puerta",
      intro: [
        "Houston es uno de los destinos industriales más demandados desde Monterrey: energía, petroquímica, acero y distribución. Cubrimos la ruta completa —planta en México, cruce por Laredo y entrega en el área metropolitana de Houston— con la misma unidad y el mismo operador.",
        "Son aproximadamente 830 kilómetros (515 millas) de puerta a puerta, con entrega típica en 1 a 2 días según el horario de cruce y la cita de descarga.",
      ],
      image: { src: "/fleet/cruce-usa.jpg", alt: "Tractocamión de ServiExpress JC rumbo a Texas tras el cruce fronterizo" },
      sections: [
        {
          h2: "Distancia y tiempo de tránsito típico",
          paragraphs: [
            "El trayecto se compone de dos tramos: Monterrey–Laredo (~230 km, 2.5–3 horas por la 85D) y Laredo–Houston (~500 km / 310 millas por la I-35 y la US-59/I-69, unas 5 horas de manejo).",
            "Con documentos validados y cruce fluido, la mercancía que sale de Monterrey por la mañana puede entregarse en Houston al día siguiente. Programamos el viaje contra tu cita de entrega y lo monitoreamos por GPS en cada tramo.",
          ],
        },
        {
          h2: "Carga frecuente en la ruta Monterrey–Houston",
          paragraphs: [],
          bullets: [
            "Acero y producto siderúrgico para distribuidores y proyectos del área de Houston.",
            "Producto terminado de manufactura regiomontana en caja seca de 53 pies.",
            "Maquinaria y equipo industrial en plataforma.",
            "Insumos para el sector energético y petroquímico texano.",
          ],
        },
        {
          h2: "Cruce por Laredo sin transbordo",
          paragraphs: [
            "El punto crítico de esta ruta es la frontera. Nuestra ventaja: unidades de doble placa y operadores B1 que cruzan por Laredo sin transbordar la carga. Tu mercancía no cambia de remolque ni de responsable en todo el trayecto, y tu agente aduanal recibe de nuestro equipo la coordinación de horarios que necesita para validar sin demoras.",
          ],
        },
      ],
      faqs: [
        {
          q: "¿Cuánto tarda un flete de Monterrey a Houston?",
          a: "Típicamente 1 a 2 días puerta a puerta: unas 3 horas de Monterrey a la frontera, el cruce por Laredo y unas 5 horas más hasta Houston, sujeto a la validación aduanal y a tu cita de entrega.",
        },
        {
          q: "¿La carga se transborda en la frontera?",
          a: "No. Cruzamos con unidades de doble placa y operadores B1: la misma unidad que carga en Monterrey entrega en Houston.",
        },
        {
          q: "¿Qué tipo de unidad conviene para esta ruta?",
          a: "Caja seca de 53 pies para producto terminado y paletizado; plataforma para acero, maquinaria y carga que se carga por grúa. Al cotizar te confirmamos el equipo según tu mercancía.",
        },
        {
          q: "¿Entregan en cualquier punto del área de Houston?",
          a: "Sí, entregamos puerta a puerta en Houston y su área metropolitana, incluyendo zonas industriales y puerto. También coordinamos destinos más allá de Houston hacia el Southeast.",
        },
      ],
      related: [
        { href: "/rutas/monterrey-laredo", label: "Ruta Monterrey–Laredo" },
        { href: "/rutas/monterrey-dallas", label: "Flete Monterrey–Dallas" },
        { href: "/transporte-internacional-mexico-usa", label: "Transporte internacional México–USA" },
        { href: "/caja-seca-53", label: "Transporte en caja seca de 53 pies" },
      ],
      serviceType: "Flete Monterrey–Houston",
    },
    en: {
      breadcrumb: "Monterrey–Houston",
      kicker: "Lane · Texas",
      metaTitle: "Monterrey–Houston Freight, Door to Door | ServiExpress JC",
      metaDescription:
        "Monterrey–Houston door-to-door trucking: ~515 mi with Laredo crossing, dual-plated trucks and 24/7 GPS. Typical 1–2 day delivery. Get a quote today.",
      h1: "Monterrey–Houston door-to-door freight",
      intro: [
        "Houston is one of the most in-demand industrial destinations out of Monterrey: energy, petrochemicals, steel and distribution. We cover the full lane — plant in Mexico, Laredo crossing and delivery across metropolitan Houston — with the same truck and driver.",
        "The run is roughly 830 km (515 mi) door to door, with typical delivery in 1 to 2 days depending on crossing windows and unloading appointments.",
      ],
      image: { src: "/fleet/cruce-usa.jpg", alt: "ServiExpress JC tractor-trailer heading into Texas after the border crossing" },
      sections: [
        {
          h2: "Distance and typical transit time",
          paragraphs: [
            "The lane breaks into two legs: Monterrey–Laredo (~230 km / 145 mi, 2.5–3 hours on highway 85D) and Laredo–Houston (~500 km / 310 mi on I-35 and US-59/I-69, about 5 driving hours).",
            "With validated paperwork and a fluid crossing, freight leaving Monterrey in the morning can deliver in Houston the next day. We schedule the trip against your delivery appointment and GPS-track every leg.",
          ],
        },
        {
          h2: "Frequent freight on the Monterrey–Houston lane",
          paragraphs: [],
          bullets: [
            "Steel and mill products for Houston-area distributors and projects.",
            "Finished goods from Monterrey manufacturing in 53' dry vans.",
            "Machinery and industrial equipment on flatbeds.",
            "Inputs for the Texas energy and petrochemical sector.",
          ],
        },
        {
          h2: "Laredo crossing with no transloading",
          paragraphs: [
            "The critical point of this lane is the border. Our edge: dual-plated trucks and B1 drivers that cross at Laredo without transloading. Your freight never changes trailers or carriers along the way, and your customs broker gets the scheduling coordination they need from our team to validate without delays.",
          ],
        },
      ],
      faqs: [
        {
          q: "How long does Monterrey to Houston take?",
          a: "Typically 1–2 days door to door: about 3 hours from Monterrey to the border, the Laredo crossing, and about 5 more hours to Houston — subject to customs validation and your delivery appointment.",
        },
        {
          q: "Is freight transloaded at the border?",
          a: "No. We cross with dual-plated trucks and B1 drivers: the truck that loads in Monterrey is the one that delivers in Houston.",
        },
        {
          q: "Which equipment fits this lane best?",
          a: "53' dry van for finished and palletized goods; flatbed for steel, machinery and crane-loaded cargo. We confirm the right equipment for your commodity when quoting.",
        },
        {
          q: "Do you deliver anywhere in the Houston area?",
          a: "Yes — door to door across Houston and its metro area, including industrial districts and the port area. We also coordinate lanes beyond Houston into the Southeast.",
        },
      ],
      related: [
        { href: "/rutas/monterrey-laredo", label: "Monterrey–Laredo lane" },
        { href: "/rutas/monterrey-dallas", label: "Monterrey–Dallas freight" },
        { href: "/transporte-internacional-mexico-usa", label: "Cross-border trucking Mexico–USA" },
        { href: "/caja-seca-53", label: "53' dry van trucking" },
      ],
      serviceType: "Monterrey–Houston freight",
    },
  },

  "/rutas/monterrey-dallas": {
    es: {
      breadcrumb: "Monterrey–Dallas",
      kicker: "Ruta · Texas",
      metaTitle: "Flete Monterrey–Dallas Puerta a Puerta | ServiExpress JC",
      metaDescription:
        "Flete Monterrey–Dallas por la I-35: ~970 km con cruce por Laredo, flota propia y monitoreo GPS 24/7. Entrega típica en 1–2 días. Cotiza tu embarque.",
      h1: "Flete Monterrey–Dallas puerta a puerta",
      intro: [
        "Dallas–Fort Worth es el gran centro logístico del norte de Texas: distribución, manufactura y uno de los mercados de consumo más grandes de Estados Unidos. Desde Monterrey, la ruta es directa: cruce por Laredo y la I-35 de sur a norte hasta el Metroplex.",
        "Son aproximadamente 970 kilómetros (600 millas) puerta a puerta, con entrega típica en 1 a 2 días según cruce y cita de descarga.",
      ],
      image: { src: "/fleet/cruce-usa.jpg", alt: "Unidad de ServiExpress JC en carretera estadounidense rumbo al norte de Texas" },
      sections: [
        {
          h2: "Distancia y tiempo de tránsito típico",
          paragraphs: [
            "La ruta tiene dos tramos: Monterrey–Laredo (~230 km, 2.5–3 horas) y Laredo–Dallas (~700 km / 435 millas por la I-35, unas 7 horas de manejo pasando por San Antonio y Austin).",
            "Un embarque bien documentado que cruza temprano puede estar entregando en Dallas al día siguiente de salir de Monterrey. Cada tramo viaja monitoreado por GPS desde nuestra sala de control.",
          ],
        },
        {
          h2: "Carga frecuente en la ruta Monterrey–Dallas",
          paragraphs: [],
          bullets: [
            "Producto terminado y mercancía de distribución en caja seca de 53 pies.",
            "Acero y materiales para construcción y proyectos del Metroplex.",
            "Maquinaria y equipo industrial en plataforma.",
            "Insumos de manufactura entre plantas de Nuevo León y el norte de Texas.",
          ],
        },
        {
          h2: "Un solo transportista de puerta a puerta",
          paragraphs: [
            "Como en todas nuestras rutas de exportación, cruzamos por Laredo con unidades de doble placa y operadores B1: sin transfer, sin cambio de remolque y sin pérdida de visibilidad. Del andén en Monterrey al andén en Dallas, tu carga tiene un solo responsable y un solo número de contacto.",
          ],
        },
      ],
      faqs: [
        {
          q: "¿Cuánto tarda un flete de Monterrey a Dallas?",
          a: "Típicamente 1 a 2 días puerta a puerta: unas 3 horas a la frontera, el cruce por Laredo y unas 7 horas de Laredo a Dallas por la I-35, sujeto a validación aduanal y cita de entrega.",
        },
        {
          q: "¿Pueden entregar en Fort Worth y el resto del Metroplex?",
          a: "Sí, entregamos en todo el área Dallas–Fort Worth y coordinamos destinos más al norte, hacia Oklahoma y el Midwest.",
        },
        {
          q: "¿La carga cruza la frontera sin transbordo?",
          a: "Sí. Unidades de doble placa y operadores B1 cruzan por Laredo con tu carga a bordo; no hay transfer ni cambio de remolque.",
        },
        {
          q: "¿Qué necesito para cotizar esta ruta?",
          a: "Origen y destino exactos, tipo de mercancía, peso y tipo de unidad (caja seca o plataforma). Con eso te confirmamos tarifa y programa por WhatsApp el mismo día.",
        },
      ],
      related: [
        { href: "/rutas/monterrey-laredo", label: "Ruta Monterrey–Laredo" },
        { href: "/rutas/monterrey-houston", label: "Flete Monterrey–Houston" },
        { href: "/transporte-internacional-mexico-usa", label: "Transporte internacional México–USA" },
        { href: "/plataforma", label: "Transporte en plataforma" },
      ],
      serviceType: "Flete Monterrey–Dallas",
    },
    en: {
      breadcrumb: "Monterrey–Dallas",
      kicker: "Lane · Texas",
      metaTitle: "Monterrey–Dallas Freight, Door to Door | ServiExpress JC",
      metaDescription:
        "Monterrey–Dallas trucking on I-35: ~600 mi with Laredo crossing, company-owned fleet and 24/7 GPS tracking. Typical 1–2 day delivery. Get a quote.",
      h1: "Monterrey–Dallas door-to-door freight",
      intro: [
        "Dallas–Fort Worth is North Texas's logistics powerhouse: distribution, manufacturing and one of the largest consumer markets in the U.S. From Monterrey the lane is direct — cross at Laredo and run I-35 north to the Metroplex.",
        "The run is roughly 970 km (600 mi) door to door, with typical delivery in 1 to 2 days depending on the crossing and unloading appointment.",
      ],
      image: { src: "/fleet/cruce-usa.jpg", alt: "ServiExpress JC truck on a U.S. highway heading to North Texas" },
      sections: [
        {
          h2: "Distance and typical transit time",
          paragraphs: [
            "The lane has two legs: Monterrey–Laredo (~230 km / 145 mi, 2.5–3 hours) and Laredo–Dallas (~700 km / 435 mi on I-35, about 7 driving hours through San Antonio and Austin).",
            "A well-documented shipment that crosses early can be delivering in Dallas the day after leaving Monterrey. Every leg is GPS-monitored from our control room.",
          ],
        },
        {
          h2: "Frequent freight on the Monterrey–Dallas lane",
          paragraphs: [],
          bullets: [
            "Finished goods and distribution freight in 53' dry vans.",
            "Steel and building materials for Metroplex projects.",
            "Machinery and industrial equipment on flatbeds.",
            "Manufacturing inputs between Nuevo León plants and North Texas.",
          ],
        },
        {
          h2: "One carrier, door to door",
          paragraphs: [
            "As on all our export lanes, we cross at Laredo with dual-plated trucks and B1 drivers: no transfer, no trailer swap, no lost visibility. From the dock in Monterrey to the dock in Dallas, your freight has one accountable carrier and one phone number.",
          ],
        },
      ],
      faqs: [
        {
          q: "How long does Monterrey to Dallas take?",
          a: "Typically 1–2 days door to door: about 3 hours to the border, the Laredo crossing, then about 7 hours from Laredo to Dallas on I-35 — subject to customs validation and delivery appointments.",
        },
        {
          q: "Do you deliver in Fort Worth and the rest of the Metroplex?",
          a: "Yes — we deliver across the Dallas–Fort Worth area and coordinate lanes further north into Oklahoma and the Midwest.",
        },
        {
          q: "Does freight cross the border without transloading?",
          a: "Yes. Dual-plated trucks and B1 drivers cross at Laredo with your freight on board; there's no transfer or trailer swap.",
        },
        {
          q: "What do I need to get this lane quoted?",
          a: "Exact origin and destination, commodity, weight and equipment type (dry van or flatbed). With that we confirm rate and schedule over WhatsApp the same day.",
        },
      ],
      related: [
        { href: "/rutas/monterrey-laredo", label: "Monterrey–Laredo lane" },
        { href: "/rutas/monterrey-houston", label: "Monterrey–Houston freight" },
        { href: "/transporte-internacional-mexico-usa", label: "Cross-border trucking Mexico–USA" },
        { href: "/plataforma", label: "Flatbed trucking" },
      ],
      serviceType: "Monterrey–Dallas freight",
    },
  },

  "/rutas/monterrey-cdmx": {
    es: {
      breadcrumb: "Monterrey–CDMX",
      kicker: "Ruta · Nacional",
      metaTitle: "Flete Monterrey–Ciudad de México | ServiExpress JC",
      metaDescription:
        "Flete Monterrey–CDMX por la 57D: ~900 km en caja seca o plataforma con flota propia y GPS 24/7. Salidas constantes desde Apodaca. Cotiza tu embarque.",
      h1: "Flete Monterrey–Ciudad de México",
      intro: [
        "El corredor Monterrey–Ciudad de México es la columna vertebral del transporte nacional: conecta el clúster industrial del norte con el mayor mercado de consumo del país. Lo operamos con salidas constantes desde nuestra base en Apodaca, en caja seca de 53 pies y plataforma.",
        "Son aproximadamente 900 kilómetros por la carretera 57D vía Saltillo, Matehuala, San Luis Potosí y Querétaro: entre 10 y 12 horas de manejo efectivo.",
      ],
      image: { src: "/fleet/carga-agricola.jpg", alt: "Unidad full de ServiExpress JC en autopista del corredor nacional Monterrey–CDMX" },
      sections: [
        {
          h2: "Distancia y tiempo de tránsito típico",
          paragraphs: [
            "Monterrey–CDMX por la autopista 57D son unos 900 km, con 10 a 12 horas de manejo efectivo según el punto exacto de entrega en el Valle de México. Al no haber cruce fronterizo, los tiempos son más predecibles: la entrega típica se programa para el día siguiente a la carga.",
            "Las restricciones de circulación para transporte pesado en la Zona Metropolitana del Valle de México se consideran al programar la cita de entrega, para que la unidad no pierda horas en espera.",
          ],
        },
        {
          h2: "Carga frecuente en el corredor",
          paragraphs: [],
          bullets: [
            "Acero de las plantas regiomontanas para distribuidores y obra del centro del país.",
            "Producto terminado y mercancía de distribución en caja seca de 53 pies.",
            "Insumos industriales entre plantas del norte y el Bajío/centro.",
            "Carga agrícola y materiales en plataforma, incluso en configuración full.",
          ],
        },
        {
          h2: "Por qué mover este corredor con flota propia",
          paragraphs: [
            "En el corredor más competido de México, la diferencia está en la consistencia: unidades propias con mantenimiento en nuestros cinco talleres, operadores de planta y monitoreo GPS 24/7 desde la sala de control. Eso se traduce en menos fallas en ruta, citas cumplidas y un contacto único que responde por tu carga del origen al destino.",
          ],
        },
      ],
      faqs: [
        {
          q: "¿Cuánto tarda un flete de Monterrey a CDMX?",
          a: "Entre 10 y 12 horas de manejo por la 57D (~900 km). La entrega típica se programa al día siguiente de la carga, considerando las restricciones de circulación del Valle de México.",
        },
        {
          q: "¿Qué tipo de unidad manejan en esta ruta?",
          a: "Caja seca de 53 pies para mercancía terminada y paletizada, y plataforma (sencilla o full) para acero, materiales y carga voluminosa.",
        },
        {
          q: "¿Entregan dentro de la CDMX o solo en la periferia?",
          a: "Entregamos puerta a puerta en la Ciudad de México y su zona metropolitana, programando la cita conforme a las restricciones de circulación para transporte de carga.",
        },
        {
          q: "¿Manejan también el regreso CDMX–Monterrey?",
          a: "Sí, operamos el corredor en ambos sentidos. Si tienes carga de ida y vuelta, coméntalo al cotizar para armar un programa redondo más eficiente.",
        },
      ],
      related: [
        { href: "/transporte-nacional", label: "Transporte nacional de carga" },
        { href: "/transporte-de-acero", label: "Transporte de acero" },
        { href: "/caja-seca-53", label: "Transporte en caja seca de 53 pies" },
        { href: "/rutas/monterrey-laredo", label: "Ruta Monterrey–Laredo" },
      ],
      serviceType: "Flete Monterrey–Ciudad de México",
    },
    en: {
      breadcrumb: "Monterrey–Mexico City",
      kicker: "Lane · Domestic",
      metaTitle: "Monterrey–Mexico City Freight | ServiExpress JC",
      metaDescription:
        "Monterrey–Mexico City trucking on highway 57D: ~560 mi in 53' dry vans or flatbeds, own fleet, 24/7 GPS, constant departures from Apodaca. Get a quote.",
      h1: "Monterrey–Mexico City freight",
      intro: [
        "The Monterrey–Mexico City corridor is the backbone of Mexican domestic trucking: it links the northern industrial cluster with the country's largest consumer market. We run it with constant departures from our Apodaca terminal, in 53' dry vans and flatbeds.",
        "The run is roughly 900 km (560 mi) on highway 57D via Saltillo, Matehuala, San Luis Potosí and Querétaro — 10 to 12 hours of effective driving.",
      ],
      image: { src: "/fleet/carga-agricola.jpg", alt: "ServiExpress JC double-trailer rig on the Monterrey–Mexico City national corridor" },
      sections: [
        {
          h2: "Distance and typical transit time",
          paragraphs: [
            "Monterrey–Mexico City on toll road 57D is about 900 km (560 mi), with 10 to 12 hours of effective driving depending on the exact delivery point in the Valley of Mexico. With no border crossing involved, timing is more predictable: typical delivery is scheduled for the day after loading.",
            "Heavy-vehicle circulation restrictions in the Mexico City metropolitan area are factored into the delivery appointment so the truck doesn't burn hours waiting.",
          ],
        },
        {
          h2: "Frequent freight on the corridor",
          paragraphs: [],
          bullets: [
            "Steel from Monterrey-area mills to central-Mexico distributors and job sites.",
            "Finished goods and distribution freight in 53' dry vans.",
            "Industrial inputs between northern plants and the Bajío/central region.",
            "Agricultural freight and materials on flatbeds, including double-trailer setups.",
          ],
        },
        {
          h2: "Why run this corridor with an owned fleet",
          paragraphs: [
            "On Mexico's most competitive lane, consistency is the differentiator: company-owned trucks maintained in our five in-house shops, staff drivers and 24/7 GPS monitoring from our control room. That means fewer breakdowns, kept appointments and a single contact accountable for your freight from origin to destination.",
          ],
        },
      ],
      faqs: [
        {
          q: "How long does Monterrey to Mexico City take?",
          a: "10 to 12 driving hours on highway 57D (~900 km / 560 mi). Typical delivery is scheduled the day after loading, factoring in Mexico City's freight circulation restrictions.",
        },
        {
          q: "What equipment do you run on this lane?",
          a: "53' dry vans for finished and palletized goods, and flatbeds (single or double-trailer) for steel, materials and high-volume freight.",
        },
        {
          q: "Do you deliver inside Mexico City or only the outskirts?",
          a: "Door to door across Mexico City and its metro area, scheduling appointments around the freight circulation restrictions.",
        },
        {
          q: "Do you also run Mexico City–Monterrey northbound?",
          a: "Yes, we operate the corridor in both directions. If you have freight both ways, mention it when quoting and we'll build a more efficient round-trip program.",
        },
      ],
      related: [
        { href: "/transporte-nacional", label: "Domestic trucking in Mexico" },
        { href: "/transporte-de-acero", label: "Steel hauling" },
        { href: "/caja-seca-53", label: "53' dry van trucking" },
        { href: "/rutas/monterrey-laredo", label: "Monterrey–Laredo lane" },
      ],
      serviceType: "Monterrey–Mexico City freight",
    },
  },
}

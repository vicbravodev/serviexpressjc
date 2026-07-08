import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "my-v0-project"

export const Preguntas = () => (
  <Accordion type="single" defaultValue="frontera" className="w-full max-w-md">
    <AccordionItem value="frontera">
      <AccordionTrigger>¿Cruzan la frontera con carga propia?</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        Sí. Operamos cruce directo por Nuevo Laredo y Colombia con transfer
        propio y agente aduanal. Manejamos doble placa y operadores con visa
        B1 vigente para entrega puerta a puerta en Texas.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="monitoreo">
      <AccordionTrigger>¿Cómo monitorean la carga en tránsito?</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        Cada unidad reporta por GPS cada 3 minutos desde nuestra sala de
        control 24/7, con alertas de desvío y paro no programado.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="seguro">
      <AccordionTrigger>¿La mercancía va asegurada?</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        Toda la carga viaja con póliza de responsabilidad civil y cobertura de
        mercancía por el valor declarado en la carta porte.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

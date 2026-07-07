import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "my-v0-project"

export const MonitoreoGps = () => (
  <TooltipProvider>
    <div className="flex min-h-40 items-center justify-center">
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">Monitoreo GPS 24/7</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Rastreo satelital en vivo desde nuestra sala de control.</p>
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
)

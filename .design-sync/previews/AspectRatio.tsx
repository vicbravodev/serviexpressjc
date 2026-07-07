import { AspectRatio } from "my-v0-project"

export const Video = () => (
  <div className="w-80">
    <AspectRatio ratio={16 / 9}>
      <div className="flex size-full items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
        Video presentación 16:9
      </div>
    </AspectRatio>
  </div>
)

export const Foto = () => (
  <div className="w-72">
    <AspectRatio ratio={4 / 3}>
      <div className="flex size-full items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
        Foto de flota 4:3
      </div>
    </AspectRatio>
  </div>
)

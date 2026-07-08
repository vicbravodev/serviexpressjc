import { Skeleton } from "my-v0-project"

export const TarjetaEmbarque = () => (
  <div className="flex w-80 flex-col gap-4 rounded-lg border p-4">
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-56" />
  </div>
)

export const FilaTabla = () => (
  <div className="flex w-96 flex-col gap-3">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
  </div>
)

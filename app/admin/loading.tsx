import { Skeleton } from "@/components/ui/skeleton"
import { ResultsSkeleton } from "./_components/list-view"
import { PageBody } from "./_components/page-header"

// Mientras el servidor consulta: la forma de la página, no un spinner al centro.
export default function AdminLoading() {
  return (
    <PageBody>
      <div className="flex flex-col gap-2" aria-hidden>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <ResultsSkeleton cols={5} />
    </PageBody>
  )
}

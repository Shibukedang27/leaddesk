import { Skeleton } from '../Skeleton'

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="glass rounded-card p-5" key={index}>
            <Skeleton className="size-11 rounded-2xl" />
            <Skeleton className="mt-6 h-8 w-24" />
            <Skeleton className="mt-3 h-4 w-32" />
          </div>
        ))}
      </div>
      <div className="glass rounded-card p-5">
        <Skeleton className="h-12 w-full max-w-sm" />
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-16 w-full rounded-[22px]" key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

import { cn } from '../utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-2xl bg-slate-200/70', className)} />
}

export function SkeletonCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3" aria-label="Loading cards">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="glass rounded-card p-5" key={index}>
          <Skeleton className="size-10 rounded-2xl" />
          <Skeleton className="mt-6 h-4 w-3/4" />
          <Skeleton className="mt-3 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-5/6" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="glass rounded-card p-5" aria-label="Loading table">
      <Skeleton className="h-10 w-52" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="h-12 w-full" key={index} />
        ))}
      </div>
    </div>
  )
}

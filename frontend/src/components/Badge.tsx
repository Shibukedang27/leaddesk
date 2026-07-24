import type { HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary',
        className,
      )}
      {...props}
    />
  )
}

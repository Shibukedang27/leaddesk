import type { HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-card border border-slate-200/80 bg-white shadow-soft', className)}
      {...props}
    />
  )
}

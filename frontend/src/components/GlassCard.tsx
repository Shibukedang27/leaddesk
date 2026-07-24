import type { HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('glass rounded-card', className)} {...props} />
}

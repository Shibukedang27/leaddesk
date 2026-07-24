import { cn } from '../../utils/cn'
import type { LeadStatus } from '../../types/dashboard'

const statusClass: Record<LeadStatus, string> = {
  NEW: 'bg-blue-50 text-blue-700 ring-blue-100',
  CONTACTED: 'bg-amber-50 text-amber-700 ring-amber-100',
  CLOSED: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

export function StatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1',
        statusClass[status],
        className,
      )}
    >
      {status}
    </span>
  )
}

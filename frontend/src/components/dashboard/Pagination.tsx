import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../Button'
import type { PaginationMeta } from '../../types/dashboard'

export function Pagination({
  pagination,
  onPageChange,
  onLimitChange,
}: {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-white/60 px-4 py-4 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Page {pagination.page} of {Math.max(1, pagination.pages)} · {pagination.total} leads
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="h-10 rounded-full border border-white/70 bg-white/75 px-3 text-sm font-semibold outline-none"
          value={pagination.limit}
          onChange={(event) => {
            onLimitChange(Number(event.target.value))
          }}
          aria-label="Items per page"
        >
          {[5, 10, 20, 50].map((limit) => (
            <option key={limit} value={limit}>
              {limit} / page
            </option>
          ))}
        </select>
        <Button
          className="h-10 px-4"
          variant="secondary"
          type="button"
          disabled={!pagination.previous}
          onClick={() => {
            if (pagination.previous) {
              onPageChange(pagination.previous)
            }
          }}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button
          className="h-10 px-4"
          variant="secondary"
          type="button"
          disabled={!pagination.next}
          onClick={() => {
            if (pagination.next) {
              onPageChange(pagination.next)
            }
          }}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

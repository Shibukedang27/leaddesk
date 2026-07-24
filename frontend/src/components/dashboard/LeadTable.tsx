import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Mail, MoreHorizontal, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../Button'
import type { Lead, LeadStatus } from '../../types/dashboard'
import { StatusBadge } from './StatusBadge'

const statuses: LeadStatus[] = ['NEW', 'CONTACTED', 'CLOSED']

function highlight(text: string, query: string) {
  if (!query.trim()) return text
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index < 0) return text
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-blue-100 px-1 text-blue-800">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}

export function LeadTable({
  leads,
  search,
  updatingId,
  onStatusUpdate,
}: {
  leads: Lead[]
  search: string
  updatingId: string | null
  onStatusUpdate: (leadId: string, status: LeadStatus) => Promise<void>
}) {
  return (
    <div className="overflow-hidden rounded-card border border-white/60 bg-white/55 shadow-soft backdrop-blur-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-separate border-spacing-y-2 px-3 py-2 text-left">
          <thead className="sticky top-0 z-10 bg-white/80 text-xs uppercase tracking-[0.16em] text-slate-400 backdrop-blur-xl">
            <tr>
              <th className="px-4 py-4 font-bold">Name</th>
              <th className="px-4 py-4 font-bold">Email</th>
              <th className="px-4 py-4 font-bold">Budget</th>
              <th className="px-4 py-4 font-bold">Status</th>
              <th className="px-4 py-4 font-bold">Created</th>
              <th className="px-4 py-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {leads.map((lead) => (
                <LeadRow
                  key={`${lead.id}-${lead.status}`}
                  lead={lead}
                  search={search}
                  isUpdating={updatingId === lead.id}
                  onStatusUpdate={onStatusUpdate}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LeadRow({
  lead,
  search,
  isUpdating,
  onStatusUpdate,
}: {
  lead: Lead
  search: string
  isUpdating: boolean
  onStatusUpdate: (leadId: string, status: LeadStatus) => Promise<void>
}) {
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead.status)
  const created = useMemo(
    () =>
      new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
        new Date(lead.created_at),
      ),
    [lead.created_at],
  )
  const dirty = selectedStatus !== lead.status

  return (
    <motion.tr
      className="group rounded-[22px]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      layout
    >
      <td className="rounded-l-[22px] bg-white/80 px-4 py-4 shadow-sm transition group-hover:bg-blue-50/50">
        <p className="font-bold text-slate-950">{highlight(lead.full_name, search)}</p>
        <p className="mt-1 line-clamp-1 max-w-xs text-sm font-medium text-slate-500">{lead.message}</p>
      </td>
      <td className="bg-white/80 px-4 py-4 shadow-sm transition group-hover:bg-blue-50/50">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Mail className="size-4 text-slate-300" />
          {highlight(lead.email, search)}
        </span>
      </td>
      <td className="bg-white/80 px-4 py-4 font-bold text-slate-700 shadow-sm transition group-hover:bg-blue-50/50">
        {lead.budget}
      </td>
      <td className="bg-white/80 px-4 py-4 shadow-sm transition group-hover:bg-blue-50/50">
        <div className="flex items-center gap-3">
          <StatusBadge status={lead.status} />
          <select
            className="h-9 rounded-full border border-white/70 bg-white px-3 text-xs font-bold text-slate-600 outline-none"
            value={selectedStatus}
            onChange={(event) => {
              setSelectedStatus(event.target.value as LeadStatus)
            }}
            aria-label={`Change status for ${lead.full_name}`}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td className="bg-white/80 px-4 py-4 shadow-sm transition group-hover:bg-blue-50/50">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Calendar className="size-4 text-slate-300" />
          {created}
        </span>
      </td>
      <td className="rounded-r-[22px] bg-white/80 px-4 py-4 shadow-sm transition group-hover:bg-blue-50/50">
        <div className="flex items-center gap-2">
          <Button
            className="h-9 px-3"
            type="button"
            variant={dirty ? 'primary' : 'secondary'}
            disabled={!dirty}
            isLoading={isUpdating}
            onClick={() => {
              void onStatusUpdate(lead.id, selectedStatus)
            }}
          >
            <Save className="size-4" />
            Update
          </Button>
          <button
            className="grid size-9 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-800"
            type="button"
            aria-label={`More actions for ${lead.full_name}`}
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}

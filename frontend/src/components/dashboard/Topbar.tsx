import { Bell, Search } from 'lucide-react'
import { useMemo } from 'react'
import type { User } from '../../types/auth'

export function Topbar({ user }: { user: User | null }) {
  const time = useMemo(
    () => new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date()),
    [],
  )

  return (
    <header className="sticky top-3 z-30 rounded-card border border-white/60 bg-white/70 px-4 py-3 shadow-soft backdrop-blur-2xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Dashboard / Leads</p>
          <h1 className="mt-1 text-lg font-bold text-slate-950">Command Center</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden h-11 min-w-72 items-center gap-3 rounded-full border border-white/70 bg-white/75 px-4 text-sm font-semibold text-slate-400 shadow-soft md:flex">
            <Search className="size-4" />
            Quick search
          </div>
          <div className="hidden rounded-full bg-white/75 px-4 py-3 text-sm font-bold text-slate-500 shadow-soft sm:block">
            {time}
          </div>
          <button
            className="grid size-11 place-items-center rounded-full bg-white/75 text-slate-500 shadow-soft transition hover:bg-blue-50 hover:text-slate-950"
            aria-label="Notifications"
            type="button"
          >
            <Bell className="size-5" />
          </button>
          <div className="flex items-center gap-3 rounded-full bg-white/75 py-1 pl-1 pr-4 shadow-soft">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-white">
              {user?.full_name.slice(0, 1) ?? 'A'}
            </span>
            <span className="hidden text-sm font-bold text-slate-700 sm:block">
              {user?.full_name ?? 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

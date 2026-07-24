import { motion } from 'framer-motion'
import { BarChart3, LayoutDashboard, LogOut, Settings, SlidersHorizontal, UsersRound, X } from 'lucide-react'
import { Logo } from '../Logo'
import { cn } from '../../utils/cn'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Leads', icon: UsersRound, active: false },
  { label: 'Analytics', icon: BarChart3, active: false },
  { label: 'Settings', icon: Settings, active: false },
]

export function Sidebar({
  open,
  onClose,
  onLogout,
}: {
  open: boolean
  onClose: () => void
  onLogout: () => void
}) {
  return (
    <>
      <aside className="fixed inset-y-4 left-4 z-40 hidden w-72 rounded-card border border-white/60 bg-white/68 p-4 shadow-premium backdrop-blur-2xl lg:block">
        <SidebarContent onLogout={onLogout} />
      </aside>
      <motion.aside
        className={cn(
          'fixed inset-y-3 left-3 z-[60] w-[min(19rem,calc(100vw-1.5rem))] rounded-card border border-white/60 bg-white/86 p-4 shadow-premium backdrop-blur-2xl lg:hidden',
          open ? 'block' : 'pointer-events-none',
        )}
        initial={false}
        animate={open ? { x: 0, opacity: 1 } : { x: -340, opacity: 0 }}
      >
        <button
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-slate-500 hover:bg-blue-50"
          type="button"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
        <SidebarContent onLogout={onLogout} />
      </motion.aside>
    </>
  )
}

function SidebarContent({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Logo />
      <nav className="mt-10 grid gap-2" aria-label="Dashboard navigation">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            className={cn(
              'group flex items-center gap-3 rounded-[20px] px-4 py-3 text-left text-sm font-bold transition hover:bg-blue-50 hover:text-slate-950',
              active
                ? 'bg-slate-950 text-white shadow-soft hover:bg-slate-900 hover:text-white'
                : 'text-slate-500',
            )}
            type="button"
            key={label}
          >
            <Icon className="size-4" />
            {label}
            {active ? <span className="ml-auto size-2 rounded-full bg-blue-300" /> : null}
          </button>
        ))}
      </nav>
      <div className="mt-auto grid gap-2">
        <div className="rounded-[22px] border border-blue-100 bg-blue-50/80 p-4">
          <SlidersHorizontal className="size-5 text-primary" />
          <p className="mt-3 text-sm font-bold text-slate-950">Settings ready</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            Profile, Security, Preferences, and Theme are prepared for future expansion.
          </p>
        </div>
        <button
          className="flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-rose-50 hover:text-danger"
          type="button"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

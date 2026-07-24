import { BarChart3, LayoutDashboard, Menu, Settings, UsersRound } from 'lucide-react'

const mobileNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Leads', icon: UsersRound },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
]

export function BottomNav({ onMenu }: { onMenu: () => void }) {
  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-full border border-white/60 bg-white/80 p-2 shadow-premium backdrop-blur-2xl lg:hidden"
      aria-label="Mobile dashboard navigation"
    >
      {mobileNavItems.map(({ label, icon: Icon }) => (
        <button
          className="grid place-items-center rounded-full py-3 text-slate-500 first:bg-slate-950 first:text-white"
          type="button"
          key={label}
          aria-label={label}
        >
          <Icon className="size-5" aria-hidden="true" />
        </button>
      ))}
      <button
        className="grid place-items-center rounded-full py-3 text-slate-500"
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>
    </nav>
  )
}

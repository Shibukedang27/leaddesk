import type { User } from '../../types/auth'

export function ProfileMenu({ user }: { user: User | null }) {
  return (
    <div className="rounded-card border border-white/60 bg-white/64 p-5 shadow-soft backdrop-blur-2xl">
      <p className="text-sm font-bold text-slate-950">Settings</p>
      <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-500">
        <div className="rounded-[18px] bg-white/70 p-3">Profile · {user?.email ?? 'admin'}</div>
        <div className="rounded-[18px] bg-white/70 p-3">Security · Password and session controls</div>
        <div className="rounded-[18px] bg-white/70 p-3">Preferences · Table density and notifications</div>
        <div className="rounded-[18px] bg-slate-100 p-3 text-slate-400">Theme · Disabled</div>
      </div>
    </div>
  )
}

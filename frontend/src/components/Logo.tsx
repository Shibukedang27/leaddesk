import { Link } from 'react-router'
import { APP_NAME } from '../constants/app'

interface LogoProps {
  to?: string
}

export function Logo({ to = '/' }: LogoProps) {
  return (
    <Link className="group inline-flex items-center gap-3" to={to} aria-label={`${APP_NAME} home`}>
      <span className="grid size-11 place-items-center rounded-[18px] border border-white/70 bg-white/85 text-sm font-bold text-primary shadow-soft backdrop-blur-2xl transition-transform duration-300 group-hover:scale-[1.03]">
        MK
      </span>
      <span className="hidden text-sm font-semibold text-slate-950 sm:inline">{APP_NAME}</span>
    </Link>
  )
}

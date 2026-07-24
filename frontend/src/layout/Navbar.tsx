import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu } from 'lucide-react'
import { CTAButton } from '../components/CTAButton'
import { Logo } from '../components/Logo'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const { scrollY } = useScroll()
  const top = useTransform(scrollY, [0, 120], [24, 12])
  const scale = useTransform(scrollY, [0, 120], [1, 0.985])

  return (
    <motion.header className="fixed inset-x-0 z-50 px-4" style={{ top, scale }}>
      <nav
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between rounded-full border border-white/60 bg-white/72 px-3 shadow-soft backdrop-blur-2xl md:px-5"
        aria-label="Primary navigation"
      >
        <Logo />
        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
          {links.map((link) => (
            <a className="transition hover:text-slate-950" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden md:block">
          <CTAButton className="h-10 px-5" to="#contact">
            Get Started
          </CTAButton>
        </div>
        <button
          className="grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-blue-50 md:hidden"
          type="button"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </nav>
    </motion.header>
  )
}

import { Code2, Network } from 'lucide-react'
import { Container } from '../components/Container'
import { Logo } from '../components/Logo'

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 py-10 backdrop-blur-xl">
      <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm font-medium text-slate-500">
            Built for Digital Heroes Training Task ·{' '}
            <a className="font-semibold text-primary hover:text-blue-700" href="https://digitalheroesco.com">
              digitalheroesco.com
            </a>
          </p>
        </div>
        <nav
          className="flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-500"
          aria-label="Footer"
        >
          <a className="hover:text-slate-950" href="#features">
            Features
          </a>
          <a className="hover:text-slate-950" href="#pricing">
            Pricing
          </a>
          <a className="hover:text-slate-950" href="#contact">
            Contact
          </a>
          <a className="inline-flex items-center gap-2 hover:text-slate-950" href="https://github.com">
            <Code2 className="size-4" aria-hidden="true" />
            GitHub
          </a>
          <a className="inline-flex items-center gap-2 hover:text-slate-950" href="https://linkedin.com">
            <Network className="size-4" aria-hidden="true" />
            LinkedIn
          </a>
        </nav>
      </Container>
    </footer>
  )
}

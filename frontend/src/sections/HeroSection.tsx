import { motion } from 'framer-motion'
import { PlayCircle } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Container } from '../components/Container'
import { CTAButton } from '../components/CTAButton'
import { HeroDashboardPreview } from './HeroDashboardPreview'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <Badge>Modern Lead Management CRM</Badge>
          <h1 className="mt-7 text-5xl font-bold leading-[1.02] tracking-tight text-slate-950 md:text-7xl">
            Capture Every Opportunity. Close More Deals Faster.
          </h1>
          <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-slate-500 md:text-xl">
            Manage your leads with a beautiful modern CRM built for growing businesses.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CTAButton to="#contact">Get Started</CTAButton>
            <CTAButton to="/admin" variant="secondary">
              <PlayCircle className="size-4" aria-hidden="true" />
              Live Demo
            </CTAButton>
          </div>
        </motion.div>
        <HeroDashboardPreview />
      </Container>
    </section>
  )
}

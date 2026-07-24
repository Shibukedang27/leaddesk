import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { GlassCard } from './GlassCard'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <GlassCard className="h-full p-6">
        <div className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-xl font-bold text-slate-950">{title}</h3>
        <p className="mt-3 leading-7 text-slate-500">{description}</p>
      </GlassCard>
    </motion.div>
  )
}

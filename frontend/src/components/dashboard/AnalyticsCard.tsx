import { motion, useSpring, useTransform } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useEffect } from 'react'
import { GlassCard } from '../GlassCard'

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 90, damping: 24 })
  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString())

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{display}</motion.span>
}

export function AnalyticsCard({
  title,
  value,
  trend,
  icon: Icon,
}: {
  title: string
  value: number
  trend: string
  icon: LucideIcon
}) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <div className="grid size-11 place-items-center rounded-2xl bg-blue-50 text-primary">
            <Icon className="size-5" />
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-success">{trend}</span>
        </div>
        <p className="mt-6 text-sm font-bold text-slate-500">{title}</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          <AnimatedNumber value={value} />
        </p>
      </GlassCard>
    </motion.div>
  )
}

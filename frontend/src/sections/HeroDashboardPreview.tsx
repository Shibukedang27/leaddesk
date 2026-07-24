import { motion } from 'framer-motion'
import { ArrowUpRight, BarChart3, CircleDollarSign, UsersRound } from 'lucide-react'

const cards = [
  { label: 'Qualified leads', value: '248', icon: UsersRound },
  { label: 'Pipeline value', value: '$84k', icon: CircleDollarSign },
  { label: 'Win rate', value: '42%', icon: BarChart3 },
]

export function HeroDashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl perspective-[1200px]" aria-label="Dashboard preview">
      <motion.div
        className="glass relative overflow-hidden rounded-[32px] p-4 shadow-premium md:p-5"
        initial={{ opacity: 0, rotateX: 10, rotateY: -12, y: 24 }}
        animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="rounded-[26px] border border-slate-100 bg-white p-4 md:p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-sm font-semibold text-slate-400">LeadDesk Overview</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">Today’s pipeline</h2>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-primary">Live</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {cards.map(({ label, value, icon: Icon }) => (
              <div className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4" key={label}>
                <Icon className="size-4 text-primary" aria-hidden="true" />
                <p className="mt-4 text-2xl font-bold text-slate-950">{value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            {['Aperture Labs', 'Northstar Studio', 'Vertex Cloud'].map((company, index) => (
              <div
                className="flex items-center justify-between rounded-[22px] border border-slate-100 bg-white p-4 shadow-sm"
                key={company}
              >
                <div>
                  <p className="font-bold text-slate-900">{company}</p>
                  <p className="mt-1 text-sm font-medium text-slate-400">
                    {['Proposal ready', 'Discovery booked', 'New inquiry'][index]}
                  </p>
                </div>
                <ArrowUpRight className="size-5 text-slate-300" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.div
        className="absolute -right-3 top-16 hidden rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-premium backdrop-blur-xl md:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Response time</p>
        <p className="mt-1 text-2xl font-bold text-slate-950">1.8h</p>
      </motion.div>
      <motion.div
        className="absolute -bottom-6 -left-3 hidden rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-premium backdrop-blur-xl md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Next action</p>
        <p className="mt-1 font-bold text-slate-950">Send proposal</p>
      </motion.div>
    </div>
  )
}

import { Check } from 'lucide-react'
import { cn } from '../utils/cn'
import type { PricingPlan } from '../types/ui'
import { CTAButton } from './CTAButton'
import { GlassCard } from './GlassCard'

interface PricingCardProps {
  plan: PricingPlan
}

export function PricingCard({ plan }: PricingCardProps) {
  return (
    <GlassCard
      className={cn(
        'relative p-6 transition duration-300 hover:-translate-y-1',
        plan.highlighted ? 'border-blue-200 bg-white/85 shadow-premium ring-1 ring-blue-100' : '',
      )}
    >
      {plan.highlighted ? (
        <span className="absolute right-5 top-5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-primary">
          Recommended
        </span>
      ) : null}
      <h3 className="text-2xl font-bold text-slate-950">{plan.name}</h3>
      <p className="mt-3 min-h-12 leading-6 text-slate-500">{plan.description}</p>
      <div className="mt-8 flex items-end gap-2">
        <span className="text-5xl font-bold tracking-tight text-slate-950">{plan.price}</span>
        <span className="pb-2 text-sm font-medium text-slate-500">visual plan</span>
      </div>
      <ul className="mt-8 space-y-3">
        {plan.features.map((feature) => (
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600" key={feature}>
            <Check className="size-4 text-success" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <CTAButton className="mt-8 w-full" to="#contact" variant={plan.highlighted ? 'primary' : 'secondary'}>
        Get Started
      </CTAButton>
    </GlassCard>
  )
}

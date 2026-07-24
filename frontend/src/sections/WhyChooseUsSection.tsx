import { CheckCircle2 } from 'lucide-react'
import { Container } from '../components/Container'
import { GlassCard } from '../components/GlassCard'
import { Section } from '../components/Section'
import { SectionTitle } from '../components/SectionTitle'

const benefits = [
  'Designed around clarity instead of clutter.',
  'Reusable UI primitives for consistent future development.',
  'Accessible form, focus, and navigation patterns.',
  'Subtle motion that supports comprehension.',
]

export function WhyChooseUsSection() {
  return (
    <Section>
      <Container className="grid items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
        <GlassCard className="overflow-hidden p-6">
          <div className="rounded-[28px] border border-slate-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-400">Pipeline health</p>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-success">
                Stable
              </span>
            </div>
            <div className="mt-8 flex h-52 items-end gap-3">
              {[42, 68, 54, 82, 76, 96, 88].map((height, index) => (
                <div className="flex flex-1 flex-col justify-end" key={index}>
                  <div
                    className="rounded-t-2xl bg-gradient-to-t from-blue-600 to-blue-300"
                    style={{ height: `${String(height)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {['Capture', 'Qualify', 'Close'].map((item) => (
                <div
                  className="rounded-2xl bg-slate-50 p-3 text-center text-sm font-bold text-slate-500"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
        <div>
          <SectionTitle
            eyebrow="Why choose us"
            title="A frontend foundation with taste and discipline."
            description="The system is intentionally minimal: expressive enough to feel premium, restrained enough to scale into a serious CRM."
          />
          <ul className="mt-9 space-y-4">
            {benefits.map((benefit) => (
              <li className="flex gap-3 text-base font-semibold text-slate-600" key={benefit}>
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}

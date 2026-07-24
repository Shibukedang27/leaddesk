import { Container } from '../components/Container'
import { PricingCard } from '../components/PricingCard'
import { Section } from '../components/Section'
import { SectionTitle } from '../components/SectionTitle'
import type { PricingPlan } from '../types/ui'

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$0',
    description: 'A clean starting point for solo operators validating a lead process.',
    features: ['Lead workspace patterns', 'Responsive landing UI', 'Basic support states'],
  },
  {
    name: 'Growth',
    price: '$29',
    description: 'The highlighted visual plan for growing teams that need focus and polish.',
    features: ['Premium glass components', 'Validation-ready forms', 'Dashboard-ready layout'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    description: 'A future-ready presentation for teams that expect security and scale.',
    features: ['Cloud-ready structure', 'Design token system', 'Accessible UI primitives'],
  },
]

export function PricingSection() {
  return (
    <Section id="pricing">
      <Container>
        <SectionTitle
          eyebrow="Pricing"
          title="Simple visual plans for a product-ready story."
          description="Pricing is presentation-only in this phase, with no checkout or backend functionality."
          align="center"
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard plan={plan} key={plan.name} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

import { BarChart3, Cloud, LockKeyhole, Search, SlidersHorizontal, UsersRound } from 'lucide-react'
import { Container } from '../components/Container'
import { FeatureCard } from '../components/FeatureCard'
import { Section } from '../components/Section'
import { SectionTitle } from '../components/SectionTitle'

const features = [
  {
    icon: UsersRound,
    title: 'Lead Tracking',
    description: 'A calm workspace for seeing every relationship, next step, and opportunity at a glance.',
  },
  {
    icon: Search,
    title: 'Fast Search',
    description:
      'Find people and companies quickly with a search experience designed for repeated daily use.',
  },
  {
    icon: LockKeyhole,
    title: 'Secure Login',
    description:
      'A polished authentication surface with JWT sessions, protected routes, and secure admin access.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Beautiful visual patterns for pipeline metrics, conversion quality, and team momentum.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Status Updates',
    description: 'Clear lifecycle states keep every lead moving without adding unnecessary visual noise.',
  },
  {
    icon: Cloud,
    title: 'Cloud Ready',
    description: 'A modern frontend foundation prepared for Vercel, APIs, and production operations.',
  },
]

export function FeaturesSection() {
  return (
    <Section id="features">
      <Container>
        <SectionTitle
          eyebrow="Features"
          title="Everything feels simple, even when the pipeline gets busy."
          description="LeadDesk Mini uses generous spacing, confident hierarchy, and reusable components to create a CRM interface that feels premium from the first interaction."
          align="center"
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard {...feature} key={feature.title} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

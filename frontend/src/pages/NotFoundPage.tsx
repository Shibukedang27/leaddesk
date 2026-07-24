import { ArrowLeft } from 'lucide-react'
import { CTAButton } from '../components/CTAButton'
import { GlassCard } from '../components/GlassCard'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-premium px-4 py-12">
      <GlassCard className="relative w-full max-w-2xl overflow-hidden p-8 text-center md:p-12">
        <div className="mx-auto grid size-24 place-items-center rounded-[32px] bg-blue-50 text-5xl font-bold text-primary">
          404
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
          Lost in the pipeline.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-slate-500">
          The page you are looking for does not exist, but the path home is still clear.
        </p>
        <CTAButton className="mt-8" to="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back Home
        </CTAButton>
      </GlassCard>
    </main>
  )
}

import { Badge } from './Badge'

interface SectionTitleProps {
  eyebrow: string
  title: string
  description: string
  align?: 'left' | 'center'
}

export function SectionTitle({ eyebrow, title, description, align = 'left' }: SectionTitleProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">{title}</h2>
      <p className="mt-5 text-base leading-8 text-slate-500 md:text-lg">{description}</p>
    </div>
  )
}

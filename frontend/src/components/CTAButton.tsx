import { ArrowRight } from 'lucide-react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '../utils/cn'

type CTAButtonProps = LinkProps & {
  variant?: 'primary' | 'secondary'
}

export function CTAButton({ className, variant = 'primary', children, ...props }: CTAButtonProps) {
  return (
    <Link
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0',
        variant === 'primary'
          ? 'bg-primary text-white shadow-soft hover:bg-blue-700 hover:shadow-premium'
          : 'border border-white/70 bg-white/75 text-slate-900 shadow-soft hover:bg-blue-50/80',
        className,
      )}
      {...props}
    >
      {children}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  )
}

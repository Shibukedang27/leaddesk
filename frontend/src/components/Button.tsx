import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'
import { LoadingSpinner } from './LoadingSpinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  isLoading?: boolean
  children: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-soft hover:bg-blue-700 hover:shadow-premium',
  secondary: 'border border-white/70 bg-white/75 text-slate-900 shadow-soft hover:bg-blue-50/80',
  ghost: 'text-slate-600 hover:bg-blue-50 hover:text-slate-950',
}

export function Button({
  className,
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
        variants[variant],
        className,
      )}
      disabled={isLoading ? true : disabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <LoadingSpinner size="sm" /> : null}
      {children}
    </button>
  )
}

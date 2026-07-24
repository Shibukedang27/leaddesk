import { cn } from '../utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md'
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        size === 'sm' ? 'size-4' : 'size-8',
      )}
      aria-label="Loading"
    />
  )
}

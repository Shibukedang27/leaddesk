import { RefreshCw } from 'lucide-react'
import { Button } from '../Button'

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="grid place-items-center px-6 py-14 text-center">
      <h3 className="text-2xl font-bold text-slate-950">Something needs another try.</h3>
      <p className="mt-3 max-w-md text-sm font-medium leading-7 text-slate-500">{message}</p>
      <Button className="mt-6" type="button" variant="secondary" onClick={onRetry}>
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </div>
  )
}

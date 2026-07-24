import { LoadingSpinner } from './LoadingSpinner'
import { Logo } from './Logo'

export function PageLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-premium px-4">
      <div className="glass flex items-center gap-4 rounded-card px-6 py-5">
        <Logo />
        <LoadingSpinner />
      </div>
    </main>
  )
}

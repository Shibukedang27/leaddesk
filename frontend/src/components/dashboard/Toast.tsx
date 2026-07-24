import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type ToastType = 'success' | 'error'

interface ToastItem {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts((current) => [...current, { id, type, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 4200)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] grid gap-3" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = toast.type === 'success' ? CheckCircle2 : XCircle
            return (
              <motion.div
                key={toast.id}
                className="glass flex min-w-72 items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-semibold text-slate-800"
                initial={{ opacity: 0, x: 18, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 18, scale: 0.98 }}
                role={toast.type === 'error' ? 'alert' : 'status'}
              >
                <Icon className={toast.type === 'success' ? 'size-5 text-success' : 'size-5 text-danger'} />
                {toast.message}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider.')
  }
  return context
}

import { motion, AnimatePresence } from 'framer-motion'
import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string | undefined
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string | undefined
}

const fieldClass =
  'w-full rounded-2xl border border-white/70 bg-white/78 px-4 text-sm font-medium text-slate-950 shadow-soft outline-none transition duration-300 placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_5px_rgb(37_99_235_/_10%)]'

function FieldError({ error, id }: { error?: string | undefined; id: string }) {
  return (
    <AnimatePresence>
      {error ? (
        <motion.p
          id={id}
          className="text-sm font-medium text-danger"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
        >
          {error}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="grid gap-2 text-sm font-semibold text-slate-700">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className={cn(fieldClass, 'h-12', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      <FieldError id={errorId} error={error} />
    </div>
  )
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? props.name ?? generatedId
  const errorId = `${textareaId}-error`

  return (
    <div className="grid gap-2 text-sm font-semibold text-slate-700">
      <label htmlFor={textareaId}>{label}</label>
      <textarea
        id={textareaId}
        className={cn(fieldClass, 'min-h-36 py-4 resize-none', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      <FieldError id={errorId} error={error} />
    </div>
  )
}

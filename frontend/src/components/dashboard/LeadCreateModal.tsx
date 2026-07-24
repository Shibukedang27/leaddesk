import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../Button'
import { Input, Textarea } from '../Input'
import type { LeadCreatePayload } from '../../types/dashboard'

const schema = z.object({
  full_name: z.string().trim().min(2, 'Enter a full name.'),
  email: z.email('Enter a valid email address.'),
  budget: z.string().trim().min(2, 'Choose a budget.'),
  message: z.string().trim().min(10, 'Add a little more context.'),
})

type FormValues = z.infer<typeof schema>

export function LeadCreateModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (payload: LeadCreatePayload) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { budget: '' } })

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, open])

  async function submit(values: FormValues) {
    await onCreate(values)
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/25 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-create-title"
          aria-describedby="lead-create-description"
        >
          <motion.div
            className="w-full max-w-2xl rounded-card bg-white p-6 shadow-premium"
            initial={{ y: 16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.98 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 id="lead-create-title" className="text-2xl font-bold text-slate-950">
                  Add lead
                </h2>
                <p id="lead-create-description" className="mt-2 text-sm font-medium text-slate-500">
                  Create a new CRM lead with validated details.
                </p>
              </div>
              <button
                className="grid size-10 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                type="button"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
            <form
              className="mt-6 grid gap-5"
              onSubmit={(event) => {
                void handleSubmit(submit)(event)
              }}
              noValidate
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Full Name" {...register('full_name')} error={errors.full_name?.message} />
                <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
              </div>
              <div className="grid gap-2 text-sm font-semibold text-slate-700">
                <label htmlFor="create-budget">Budget</label>
                <select
                  id="create-budget"
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-blue-300"
                  aria-describedby={errors.budget?.message ? 'create-budget-error' : undefined}
                  aria-invalid={Boolean(errors.budget)}
                  {...register('budget')}
                >
                  <option value="">Select a range</option>
                  <option>$5k-$15k</option>
                  <option>$15k-$50k</option>
                  <option>$50k+</option>
                  <option>Undecided</option>
                </select>
                {errors.budget?.message ? (
                  <span id="create-budget-error" className="text-sm font-medium text-danger">
                    {errors.budget.message}
                  </span>
                ) : null}
              </div>
              <Textarea label="Message" {...register('message')} error={errors.message?.message} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Create Lead
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

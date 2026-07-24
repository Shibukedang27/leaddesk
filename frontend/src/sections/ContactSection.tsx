import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CheckCircle2, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { GlassCard } from '../components/GlassCard'
import { Input, Textarea } from '../components/Input'
import { Section } from '../components/Section'
import { SectionTitle } from '../components/SectionTitle'
import { submitLeadRequest } from '../services/leadCapture'
import { getApiErrorMessage } from '../utils/apiError'

const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.'),
  email: z.email('Enter a valid email address.').trim(),
  budget: z.string().trim().min(1, 'Choose a budget range.'),
  message: z.string().trim().min(12, 'Share a little more context.'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { budget: '' },
  })

  async function onSubmit(values: ContactFormValues) {
    setSubmitError('')
    setSubmitted(false)
    try {
      await submitLeadRequest({
        full_name: values.fullName,
        email: values.email,
        budget: values.budget,
        message: values.message,
        source: 'landing',
      })
      setSubmitted(true)
      reset()
    } catch (error) {
      setSubmitError(getApiErrorMessage(error))
    }
  }

  return (
    <Section id="contact" className="pb-28">
      <Container className="grid gap-10 lg:grid-cols-[0.82fr_1fr]">
        <div>
          <SectionTitle
            eyebrow="Contact"
            title="Tell us about the opportunity."
            description="Submit a lead request with the same validation and reliability used across the CRM."
          />
          {submitted ? (
            <motion.div
              className="mt-8 flex items-center gap-3 rounded-[22px] border border-emerald-100 bg-emerald-50 px-5 py-4 font-semibold text-emerald-700"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
            >
              <CheckCircle2 className="size-5" aria-hidden="true" />
              Request submitted. The lead is ready for admin follow-up.
            </motion.div>
          ) : null}
          {submitError ? (
            <motion.div
              className="mt-8 rounded-[22px] border border-rose-100 bg-rose-50 px-5 py-4 font-semibold text-danger"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
            >
              {submitError}
            </motion.div>
          ) : null}
        </div>
        <GlassCard className="p-5 md:p-7">
          <form
            className="grid gap-5"
            onSubmit={(event) => {
              void handleSubmit(onSubmit)(event)
            }}
            noValidate
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Full Name"
                placeholder="Maya Kapoor"
                {...register('fullName')}
                error={errors.fullName?.message}
              />
              <Input
                label="Email Address"
                placeholder="maya@company.com"
                type="email"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
            <div className="grid gap-2 text-sm font-semibold text-slate-700">
              <label htmlFor="budget">Budget Range</label>
              <select
                id="budget"
                className="h-12 w-full rounded-2xl border border-white/70 bg-white/78 px-4 text-sm font-medium text-slate-950 shadow-soft outline-none transition duration-300 focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_5px_rgb(37_99_235_/_10%)]"
                aria-invalid={Boolean(errors.budget)}
                aria-describedby={errors.budget?.message ? 'budget-error' : undefined}
                {...register('budget')}
              >
                <option value="">Select a range</option>
                <option>$2k - $5k</option>
                <option>$5k - $15k</option>
                <option>$15k - $50k</option>
                <option>$50k+</option>
              </select>
              {errors.budget?.message ? (
                <span id="budget-error" className="text-sm font-medium text-danger">
                  {errors.budget.message}
                </span>
              ) : null}
            </div>
            <Textarea
              label="Project Message"
              placeholder="Tell us what your sales team needs to manage better."
              {...register('message')}
              error={errors.message?.message}
            />
            <Button className="w-full sm:w-auto" type="submit" isLoading={isSubmitting}>
              <Send className="size-4" aria-hidden="true" />
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </GlassCard>
      </Container>
    </Section>
  )
}

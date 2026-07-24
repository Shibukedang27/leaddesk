import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { Button } from '../components/Button'
import { GlassCard } from '../components/GlassCard'
import { Input } from '../components/Input'
import { Logo } from '../components/Logo'
import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '../utils/apiError'

const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LocationState {
  from?: string
}

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from ?? '/admin'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage('')
    try {
      await login(values)
      void navigate(from, { replace: true })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    }
  }

  if (!isLoading && isAuthenticated) {
    return <Navigate replace to={from} />
  }

  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-premium px-4 py-12">
      <motion.section
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <GlassCard className="p-7 md:p-8">
          <div className="flex items-center justify-between">
            <Logo />
            <Link
              className="grid size-10 place-items-center rounded-full text-slate-500 transition hover:bg-blue-50 hover:text-slate-950"
              to="/"
              aria-label="Back home"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10">
            <div className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-primary">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">Welcome back</h1>
            <p className="mt-3 leading-7 text-slate-500">
              Sign in with your admin account to access the protected CRM dashboard.
            </p>
          </div>
          <form
            className="mt-8 grid gap-5"
            onSubmit={(event) => {
              void handleSubmit(onSubmit)(event)
            }}
            noValidate
          >
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between gap-4 text-sm font-semibold">
              <label className="flex items-center gap-2 text-slate-600">
                <input className="size-4 rounded border-slate-300 text-primary" type="checkbox" />
                Remember Me
              </label>
              <a className="text-primary hover:text-blue-700" href="#forgot-password">
                Forgot Password
              </a>
            </div>
            {errorMessage ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-danger">
                {errorMessage}
              </div>
            ) : null}
            <Button type="submit" isLoading={isSubmitting || isLoading}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </GlassCard>
      </motion.section>
    </main>
  )
}

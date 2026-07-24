import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from '../LoginPage'
import { adminUser } from '../../test/fixtures'
import type { LoginPayload } from '../../services/auth'
import type { User } from '../../types/auth'

interface AuthValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: ReturnType<typeof vi.fn<(payload: LoginPayload) => Promise<void>>>
  logout: ReturnType<typeof vi.fn<() => Promise<void>>>
}

const auth: { value: AuthValue } = vi.hoisted(() => ({
  value: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => auth.value,
}))

function renderLogin(initialEntry = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<div>Admin route</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    auth.value = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn().mockResolvedValue(undefined),
    }
  })

  it('validates required login fields accessibly', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: /Login/i }))

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('logs in and redirects to the dashboard', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'admin@leaddesk.app')
    await user.type(screen.getByLabelText('Password'), 'StrongPassword123')
    await user.click(screen.getByRole('button', { name: /Login/i }))

    await waitFor(() => {
      expect(auth.value.login).toHaveBeenCalledWith({
        email: 'admin@leaddesk.app',
        password: 'StrongPassword123',
      })
    })
    expect(await screen.findByText('Admin route')).toBeInTheDocument()
  })

  it('does not expose protected content while auth state is still loading', () => {
    auth.value = {
      ...auth.value,
      isAuthenticated: true,
      isLoading: true,
      user: adminUser,
    }

    renderLogin()

    expect(screen.getByRole('heading', { name: /Welcome back/i })).toBeInTheDocument()
    expect(screen.queryByText('Admin route')).not.toBeInTheDocument()
  })

  it('shows a friendly login error when credentials are rejected', async () => {
    auth.value.login = vi.fn().mockRejectedValueOnce(new Error('Email or password is incorrect.'))
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'admin@leaddesk.app')
    await user.type(screen.getByLabelText('Password'), 'wrong')
    await user.click(screen.getByRole('button', { name: /Login/i }))

    expect(await screen.findByText('Request failed. Please try again.')).toBeInTheDocument()
  })
})

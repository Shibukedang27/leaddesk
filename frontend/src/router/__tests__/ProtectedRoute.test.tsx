import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from '../ProtectedRoute'
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

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div>Protected dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login screen</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    auth.value = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    }
  })

  it('shows loading while session verification is in progress', () => {
    auth.value.isLoading = true

    renderProtected()

    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
    expect(screen.queryByText('Protected dashboard')).not.toBeInTheDocument()
  })

  it('redirects unauthenticated users to login', async () => {
    renderProtected()

    expect(await screen.findByText('Login screen')).toBeInTheDocument()
  })

  it('renders protected children for authenticated users', () => {
    auth.value = {
      ...auth.value,
      isAuthenticated: true,
      user: adminUser,
    }

    renderProtected()

    expect(screen.getByText('Protected dashboard')).toBeInTheDocument()
  })
})

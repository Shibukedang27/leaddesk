import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { currentUserRequest, loginRequest, logoutRequest, type LoginPayload } from '../services/auth'
import { setAccessToken } from '../services/http'
import type { User } from '../types/auth'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const tokenStorageKey = 'leaddesk.access_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem(tokenStorageKey)))

  const clearSession = useCallback(() => {
    localStorage.removeItem(tokenStorageKey)
    setAccessToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(tokenStorageKey)
    if (!token) {
      return
    }

    setAccessToken(token)
    currentUserRequest()
      .then((response) => {
        setUser(response.data)
      })
      .catch(() => {
        clearSession()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [clearSession])

  useEffect(() => {
    window.addEventListener('leaddesk:unauthorized', clearSession)
    return () => {
      window.removeEventListener('leaddesk:unauthorized', clearSession)
    }
  }, [clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login: async (payload) => {
        const response = await loginRequest(payload)
        localStorage.setItem(tokenStorageKey, response.data.access_token)
        setAccessToken(response.data.access_token)
        setUser(response.data.user)
      },
      logout: async () => {
        try {
          await logoutRequest()
        } finally {
          clearSession()
        }
      },
    }),
    [clearSession, isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

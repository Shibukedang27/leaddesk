import { Navigate, useLocation } from 'react-router'
import { PageLoading } from '../components/PageLoading'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <PageLoading />
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />
  }

  return children
}

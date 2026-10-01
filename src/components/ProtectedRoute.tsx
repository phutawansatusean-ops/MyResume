import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/** Only renders its children for a logged-in admin; everyone else is sent to /admin/login. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-base-bg text-light-secondary dark:text-text-secondary">
        <Loader2 size={22} className="animate-spin" aria-label="Checking session" />
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

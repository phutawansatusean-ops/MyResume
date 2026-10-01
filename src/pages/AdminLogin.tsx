import { FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import { isFirebaseConfigured } from '../lib/firebase'
import { describeError } from '../lib/errors'
import { inputClass, labelClass, primaryButtonClass } from '../components/admin/formStyles'

export function AdminLogin() {
  useTheme() // applies the saved dark/light class to <html>
  const { isAdmin, loading, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!loading && isAdmin) return <Navigate to="/admin" replace />

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!username.trim() || !password) {
      setError('Please enter your username and password.')
      return
    }
    setSubmitting(true)
    try {
      await login(username, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      const message = describeError(err, 'Login failed. Please try again.')
      const code = typeof err === 'object' && err !== null && 'code' in err
        ? String((err as { code: unknown }).code)
        : ''
      setError(code ? `${message} (${code})` : message)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-light-bg dark:bg-base-bg">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-light-secondary dark:text-text-secondary hover:text-accent transition-colors mb-4">
          <ArrowLeft size={15} />
          Back to portfolio
        </Link>

        <div className="rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card p-6 shadow-soft">
          <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-4">
            <Lock size={18} className="text-accent" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-light-primary dark:text-text-primary">Admin login</h1>
          <p className="mt-1 text-sm text-light-secondary dark:text-text-secondary">Sign in to manage your portfolio.</p>

          {!isFirebaseConfigured && (
            <p role="alert" className="mt-4 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              Firebase is not configured yet. Copy <code>.env.example</code> to <code>.env</code> and fill in your Firebase values.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4" noValidate>
            {error && (
              <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div>
              <label className={labelClass} htmlFor="login-username">Username</label>
              <input
                id="login-username"
                className={inputClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                disabled={submitting || !isFirebaseConfigured}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={submitting || !isFirebaseConfigured}
              />
            </div>
            <button type="submit" disabled={submitting || !isFirebaseConfigured} className={primaryButtonClass}>
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Signing in…' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

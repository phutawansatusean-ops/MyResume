import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { isFirebaseConfigured } from '../lib/firebase'
import { checkIsAdmin, loginWithUsername, logout as logoutService, subscribeToAuth } from '../services/authService'

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  /** True while the initial session is being restored after a page load. */
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  // Firebase persists the session (IndexedDB), so this restores the login after a refresh.
  useEffect(() => {
    if (!isFirebaseConfigured) return
    return subscribeToAuth(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const admin = await checkIsAdmin(firebaseUser.uid)
        setUser(admin ? firebaseUser : null)
        setIsAdmin(admin)
        if (!admin) await logoutService()
      } catch {
        setUser(null)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const firebaseUser = await loginWithUsername(username, password)
    setUser(firebaseUser)
    setIsAdmin(true)
  }, [])

  const logout = useCallback(async () => {
    await logoutService()
    setUser(null)
    setIsAdmin(false)
  }, [])

  const value = useMemo(() => ({ user, isAdmin, loading, login, logout }), [user, isAdmin, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}

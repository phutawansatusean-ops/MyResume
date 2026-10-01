import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, CalendarDays, CheckCircle2, ExternalLink, FileText, FolderKanban, LayoutDashboard, LogOut, Star, Tags, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePortfolioData } from '../context/PortfolioDataContext'
import { useTheme } from '../hooks/useTheme'
import { ProjectsManager } from '../components/admin/ProjectsManager'
import { ActivitiesManager } from '../components/admin/ActivitiesManager'
import { ProfileForm } from '../components/admin/ProfileForm'
import { ResumeManager } from '../components/admin/ResumeManager'
import { NotifyFn } from '../components/admin/types'

type Tab = 'overview' | 'projects' | 'activities' | 'profile' | 'resume'

interface ToastState {
  type: 'success' | 'error'
  message: string
}

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'activities', label: 'Activities', icon: CalendarDays },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'resume', label: 'Resume', icon: FileText },
]

export function AdminDashboard() {
  useTheme()
  const { logout } = useAuth()
  const { projects, profile, loading, error, usingFallback, refresh } = usePortfolioData()
  const navigate = useNavigate()
  const location = useLocation()
  const openNewProject = Boolean((location.state as { newProject?: boolean } | null)?.newProject)
  const openNewActivity = Boolean((location.state as { newActivity?: boolean } | null)?.newActivity)

  const [tab, setTab] = useState<Tab>(openNewProject ? 'projects' : openNewActivity ? 'activities' : 'overview')
  const [toast, setToast] = useState<ToastState | null>(null)

  const notify: NotifyFn = useCallback((type, message) => setToast({ type, message }), [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch {
      notify('error', 'Could not log out. Please try again.')
    }
  }

  const categoriesInUse = new Set(projects.map((p) => p.category)).size
  const featuredCount = projects.filter((p) => p.featured).length

  const stats = [
    { label: 'Projects', value: projects.length, icon: FolderKanban },
    { label: 'Featured', value: featuredCount, icon: Star },
    { label: 'Categories in use', value: categoriesInUse, icon: Tags },
  ]

  return (
    <div className="min-h-screen bg-light-bg dark:bg-base-bg text-light-primary dark:text-text-primary">
      <header className="sticky top-0 z-20 border-b border-light-border dark:border-base-border bg-light-bg/90 dark:bg-base-bg/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-3">
          <h1 className="font-semibold tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-border dark:border-base-border text-sm font-medium text-light-secondary dark:text-text-secondary hover:text-light-primary dark:hover:text-text-primary hover:border-accent/50 transition-colors"
            >
              <ExternalLink size={15} />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-light-border dark:border-base-border text-sm font-medium text-light-secondary dark:text-text-secondary hover:text-light-primary dark:hover:text-text-primary hover:border-accent/50 transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <nav className="max-w-6xl mx-auto px-4 md:px-8 flex gap-1" aria-label="Admin sections">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? 'border-accent text-accent'
                    : 'border-transparent text-light-secondary dark:text-text-secondary hover:text-light-primary dark:hover:text-text-primary'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            )
          })}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {usingFallback && (
          <p role="alert" className="mb-6 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            Firebase is not configured, so changes cannot be saved. Copy <code>.env.example</code> to <code>.env</code> and fill in your Firebase values.
          </p>
        )}

        {tab === 'overview' && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card p-5">
                  <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center mb-3">
                    <Icon size={17} className="text-accent" />
                  </div>
                  <p className="text-2xl font-bold">{loading ? '–' : value}</p>
                  <p className="text-sm text-light-secondary dark:text-text-secondary">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card p-5">
              <h2 className="font-semibold mb-1">Quick actions</h2>
              <p className="text-sm text-light-secondary dark:text-text-secondary mb-4">
                Everything visitors see comes from Firebase, so changes appear on the public site right after saving.
              </p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setTab('projects')} className="px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors">
                  Manage projects
                </button>
                <button type="button" onClick={() => setTab('activities')} className="px-4 py-2 rounded-lg text-sm font-medium border border-light-border dark:border-base-border hover:border-accent/50 transition-colors">
                  Manage activities
                </button>
                <button type="button" onClick={() => setTab('profile')} className="px-4 py-2 rounded-lg text-sm font-medium border border-light-border dark:border-base-border hover:border-accent/50 transition-colors">
                  Edit profile
                </button>
              </div>
            </div>
          </section>
        )}

        {tab === 'projects' && (
          <ProjectsManager
            projects={projects}
            loading={loading}
            error={error}
            startWithNewForm={openNewProject}
            onChanged={refresh}
            onRetry={refresh}
            notify={notify}
          />
        )}

        {tab === 'activities' && <ActivitiesManager startWithNewForm={openNewActivity} notify={notify} />}

        {tab === 'profile' && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Profile</h2>
            {loading ? (
              <p className="text-sm text-light-secondary dark:text-text-secondary">Loading profile…</p>
            ) : error ? (
              <div role="alert" className="rounded-card border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                <p>{error}</p>
                <button type="button" onClick={() => void refresh()} className="mt-2 font-medium underline">Try again</button>
              </div>
            ) : (
              <ProfileForm profile={profile} onSaved={refresh} notify={notify} />
            )}
          </section>
        )}

        {tab === 'resume' && <ResumeManager notify={notify} />}
      </main>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-4 right-4 z-[60] max-w-sm flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm shadow-soft animate-fade-in ${
            toast.type === 'success'
              ? 'border-emerald-500/40 text-emerald-400'
              : 'border-red-500/40 text-red-400'
          } bg-light-card dark:bg-base-card`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={17} className="shrink-0 mt-0.5" /> : <AlertCircle size={17} className="shrink-0 mt-0.5" />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification" className="ml-1 shrink-0 opacity-70 hover:opacity-100">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  )
}

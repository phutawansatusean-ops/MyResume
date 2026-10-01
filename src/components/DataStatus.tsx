import { AlertCircle, Loader2 } from 'lucide-react'

interface DataStatusProps {
  loading: boolean
  error: string | null
  onRetry: () => void
  subject?: string
}

/** Shown in place of the project lists while data loads or fails to load. */
export function DataStatus({ loading, error, onRetry, subject = 'projects' }: DataStatusProps) {
  if (loading) {
    return (
      <div role="status" className="flex items-center justify-center gap-2 py-16 text-sm text-light-secondary dark:text-text-secondary">
        <Loader2 size={18} className="animate-spin" />
        Loading {subject}…
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center text-center py-12 rounded-card border border-dashed border-light-border dark:border-base-border">
        <AlertCircle size={26} className="text-red-400 mb-3" />
        <p className="text-sm font-medium text-light-primary dark:text-text-primary">Couldn’t load {subject}</p>
        <p className="mt-1 max-w-md text-sm text-light-secondary dark:text-text-secondary">{error}</p>
        <button type="button" onClick={onRetry} className="mt-4 px-3.5 py-2 rounded-lg text-sm font-medium border border-light-border dark:border-base-border hover:border-accent/50 transition-colors">
          Try again
        </button>
      </div>
    )
  }

  return null
}

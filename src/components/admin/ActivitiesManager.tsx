import { useCallback, useEffect, useState } from 'react'
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { Activity } from '../../types/activity'
import { deleteActivity, getActivities, setActivityPublished } from '../../services/activityService'
import { describeError } from '../../lib/errors'
import { ActivityForm } from './ActivityForm'
import { ConfirmDialog } from './ConfirmDialog'
import { primaryButtonClass } from './formStyles'
import { NotifyFn } from './types'

interface ActivitiesManagerProps { startWithNewForm?: boolean; notify: NotifyFn }

const iconButton = 'flex h-8 w-8 items-center justify-center rounded-lg text-light-secondary transition-colors hover:bg-light-bg hover:text-light-primary dark:text-text-secondary dark:hover:bg-base-bg dark:hover:text-text-primary'

export function ActivitiesManager({ startWithNewForm, notify }: ActivitiesManagerProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(Boolean(startWithNewForm))
  const [editing, setEditing] = useState<Activity | null>(null)
  const [toDelete, setToDelete] = useState<Activity | null>(null)
  const [busy, setBusy] = useState(false)

  const reload = useCallback(async () => {
    setLoading(true); setError(null)
    try { setActivities(await getActivities()) }
    catch (err) { setError(describeError(err, 'Could not load activities.')) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void reload() }, [reload])

  const run = async (action: () => Promise<void>, success: string, failure: string) => {
    setBusy(true)
    try { await action(); await reload(); notify('success', success) }
    catch (err) { notify('error', describeError(err, failure)) }
    finally { setBusy(false) }
  }
  const closeForm = () => { setFormOpen(false); setEditing(null) }
  const confirmDelete = async () => {
    if (!toDelete) return
    const selected = toDelete
    await run(() => deleteActivity(selected.id), `Deleted “${selected.name}”.`, 'Could not delete the activity.')
    setToDelete(null)
  }

  return <section>
    <div className="mb-4 flex items-center justify-between gap-4"><h2 className="text-lg font-semibold text-light-primary dark:text-text-primary">Activities</h2><button type="button" onClick={() => { setEditing(null); setFormOpen(true) }} className={primaryButtonClass}><Plus size={16} /> Add Activity</button></div>
    {busy && <p role="status" aria-live="polite" className="mb-3 text-sm text-light-secondary dark:text-text-secondary">Saving activity changes…</p>}
    {loading && <p className="text-sm text-light-secondary dark:text-text-secondary">Loading activities…</p>}
    {!loading && error && <div role="alert" className="rounded-card border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"><p>{error}</p><button type="button" onClick={() => void reload()} className="mt-2 font-medium underline">Try again</button></div>}
    {!loading && !error && activities.length === 0 && <div className="rounded-card border border-dashed border-light-border p-8 text-center dark:border-base-border"><p className="text-sm font-medium text-light-primary dark:text-text-primary">No activities yet</p><p className="mt-1 text-sm text-light-secondary dark:text-text-secondary">Add an activity to share it on your portfolio.</p></div>}
    {!loading && !error && activities.length > 0 && <ul className="flex flex-col gap-3">{activities.map((activity) => {
      const isPublished = activity.isPublished !== false
      const cover = activity.images?.[0]?.url ?? activity.imageUrl
      return <li key={activity.id} className="flex flex-col gap-3 rounded-card border border-light-border bg-light-card p-3 dark:border-base-border dark:bg-base-card sm:flex-row sm:items-center">
        <div className="flex h-20 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-light-bg dark:bg-base-bg sm:w-32">{cover ? <img src={cover} alt={activity.name} className="h-full w-full object-cover" /> : <span className="text-xs text-light-secondary dark:text-text-secondary">No image</span>}</div>
        <div className="min-w-0 flex-1"><p className="truncate text-[15px] font-semibold text-light-primary dark:text-text-primary">{activity.name}</p><p className="truncate text-sm text-light-secondary dark:text-text-secondary">{activity.description}</p><p className="mt-1 text-xs text-light-secondary dark:text-text-secondary">{activity.category ? `${activity.category} · ` : ''}{isPublished ? 'Published' : 'Hidden'}</p></div>
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button type="button" disabled={busy} onClick={() => void run(() => setActivityPublished(activity.id, !isPublished), isPublished ? 'Activity hidden.' : 'Activity published.', 'Could not update activity visibility.')} aria-pressed={isPublished} aria-label={isPublished ? `Hide ${activity.name}` : `Publish ${activity.name}`} title={isPublished ? 'Hide' : 'Publish'} className={`${iconButton} ${isPublished ? 'text-emerald-500' : 'text-amber-500'}`}>{isPublished ? <Eye size={16} /> : <EyeOff size={16} />}</button>
          <button type="button" disabled={busy} onClick={() => { setEditing(activity); setFormOpen(true) }} aria-label={`Edit ${activity.name}`} title="Edit" className={iconButton}><Pencil size={16} /></button>
          <button type="button" disabled={busy} onClick={() => setToDelete(activity)} aria-label={`Delete ${activity.name}`} title="Delete" className={`${iconButton} hover:text-red-400`}><Trash2 size={16} /></button>
        </div>
      </li>
    })}</ul>}
    {formOpen && <ActivityForm key={editing?.id ?? 'new'} activity={editing} onClose={closeForm} onSaved={(message) => { closeForm(); void reload().then(() => notify('success', message)) }} />}
    {toDelete && <ConfirmDialog title="Delete activity?" message={`“${toDelete.name}” and its images will be permanently deleted. This cannot be undone.`} confirmLabel="Delete" busy={busy} onConfirm={() => void confirmDelete()} onCancel={() => setToDelete(null)} />}
  </section>
}
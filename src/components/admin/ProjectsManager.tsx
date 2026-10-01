import { useState } from 'react'
import { ArrowDown, ArrowUp, Download, Eye, EyeOff, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { ProjectCover } from '../ProjectCover'
import { ConfirmDialog } from './ConfirmDialog'
import { ProjectForm } from './ProjectForm'
import { primaryButtonClass } from './formStyles'
import { NotifyFn } from './types'
import { describeError } from '../../lib/errors'
import { initialProjects } from '../../data/projects'
import { deleteProject, reorderProjects, seedProjects, setProjectFeatured, setProjectPublished } from '../../services/projectService'
import { Project } from '../../types/project'

interface ProjectsManagerProps {
  projects: Project[]
  loading: boolean
  error: string | null
  startWithNewForm?: boolean
  onChanged: () => Promise<void>
  onRetry: () => Promise<void>
  notify: NotifyFn
}

const iconButton =
  'w-8 h-8 rounded-lg flex items-center justify-center text-light-secondary dark:text-text-secondary hover:text-light-primary dark:hover:text-text-primary hover:bg-light-bg dark:hover:bg-base-bg disabled:opacity-40 disabled:hover:bg-transparent transition-colors'

export function ProjectsManager({ projects, loading, error, startWithNewForm, onChanged, onRetry, notify }: ProjectsManagerProps) {
  const [formOpen, setFormOpen] = useState(Boolean(startWithNewForm))
  const [editing, setEditing] = useState<Project | null>(null)
  const [toDelete, setToDelete] = useState<Project | null>(null)
  const [busy, setBusy] = useState(false)

  const nextOrder = projects.length > 0 ? Math.max(...projects.map((p) => p.order)) + 1 : 0

  const run = async (action: () => Promise<void>, successMessage: string, failureMessage: string) => {
    setBusy(true)
    try {
      await action()
      await onChanged()
      notify('success', successMessage)
    } catch (err) {
      notify('error', describeError(err, failureMessage))
    } finally {
      setBusy(false)
    }
  }

  const move = (index: number, direction: -1 | 1) => {
    const ids = projects.map((p) => p.id)
    const target = index + direction
    if (target < 0 || target >= ids.length) return
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    void run(() => reorderProjects(ids), 'Order updated.', 'Could not change the order.')
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    const project = toDelete
    await run(() => deleteProject(project), `Deleted “${project.title}”.`, 'Could not delete the project.')
    setToDelete(null)
  }

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-light-primary dark:text-text-primary">Projects</h2>
        <button type="button" onClick={openNew} className={primaryButtonClass}>
          <Plus size={16} />
          Add project
        </button>
      </div>

      {busy && <p role="status" aria-live="polite" className="mb-3 text-sm text-light-secondary dark:text-text-secondary">Saving project changes…</p>}

      {loading && <p className="text-sm text-light-secondary dark:text-text-secondary">Loading projects…</p>}

      {!loading && error && (
        <div role="alert" className="rounded-card border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <p>{error}</p>
          <button type="button" onClick={() => void onRetry()} className="mt-2 font-medium underline">Try again</button>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="rounded-card border border-dashed border-light-border dark:border-base-border p-8 text-center">
          <p className="text-sm font-medium text-light-primary dark:text-text-primary">No projects yet</p>
          <p className="mt-1 text-sm text-light-secondary dark:text-text-secondary">
            Add your first project, or import the starter projects (GreenTwin AI, FARM2LOOP AI, MindCare and more).
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void run(() => seedProjects(initialProjects), 'Starter projects imported.', 'Could not import the starter projects.')}
            className={`${primaryButtonClass} mt-4`}
          >
            <Download size={15} />
            Import starter projects
          </button>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <ul className="flex flex-col gap-3">
          {projects.map((project, index) => {
            const isPublished = project.isPublished !== false
            return (
            <li
              key={project.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card p-3"
            >
              <ProjectCover project={project} className="h-20 w-full sm:w-32 shrink-0 rounded-lg" />

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[15px] text-light-primary dark:text-text-primary truncate">{project.title}</p>
                <p className="text-sm text-light-secondary dark:text-text-secondary truncate">{project.description}</p>
                <p className="mt-1 text-xs text-light-secondary dark:text-text-secondary">
                  {project.category} Â· order {project.order} Â· {isPublished ? 'Published' : 'Hidden'}
                </p>
              </div>

              <div className="flex items-center gap-1 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void run(
                    () => setProjectPublished(project.id, !isPublished),
                    isPublished ? 'Hidden successfully.' : 'Published successfully.',
                    'Could not update project visibility.',
                  )}
                  aria-pressed={isPublished}
                  aria-label={isPublished ? `Hide ${project.title}` : `Publish ${project.title}`}
                  title={isPublished ? 'Published' : 'Hidden'}
                  className={`${iconButton} ${isPublished ? 'text-emerald-500' : 'text-amber-500'}`}
                >
                  {isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void run(() => setProjectFeatured(project.id, !project.featured), project.featured ? 'Removed from featured.' : 'Marked as featured.', 'Could not update featured status.')}
                  aria-pressed={project.featured}
                  aria-label={project.featured ? `Unfeature ${project.title}` : `Feature ${project.title}`}
                  title={project.featured ? 'Featured' : 'Not featured'}
                  className={`${iconButton} ${project.featured ? 'text-accent' : ''}`}
                >
                  <Star size={16} fill={project.featured ? 'currentColor' : 'none'} />
                </button>
                <button type="button" disabled={busy || index === 0} onClick={() => move(index, -1)} aria-label={`Move ${project.title} up`} title="Move up" className={iconButton}>
                  <ArrowUp size={16} />
                </button>
                <button type="button" disabled={busy || index === projects.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${project.title} down`} title="Move down" className={iconButton}>
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setEditing(project)
                    setFormOpen(true)
                  }}
                  aria-label={`Edit ${project.title}`}
                  title="Edit"
                  className={iconButton}
                >
                  <Pencil size={16} />
                </button>
                <button type="button" disabled={busy} onClick={() => setToDelete(project)} aria-label={`Delete ${project.title}`} title="Delete" className={`${iconButton} hover:text-red-400`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
            )
          })}
        </ul>
      )}

      {formOpen && (
        <ProjectForm
          key={editing?.id ?? 'new'}
          project={editing}
          nextOrder={nextOrder}
          onClose={closeForm}
          onSaved={(message) => {
            closeForm()
            void onChanged().then(() => notify('success', message))
          }}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete project?"
          message={`“${toDelete.title}” and its cover image will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          busy={busy}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  )
}

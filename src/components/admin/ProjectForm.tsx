import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { Modal } from '../Modal'
import { inputClass, labelClass, primaryButtonClass, ghostButtonClass } from './formStyles'
import { describeError } from '../../lib/errors'
import { createProject, updateProject } from '../../services/projectService'
import {
  MAX_PROJECT_IMAGES,
  MAX_PROJECT_TOTAL_IMAGE_DATA_URL_LENGTH,
  prepareProjectImage,
  validateProjectImage,
} from '../../services/projectImageService'
import { getProjectImages } from '../../lib/projectImages'
import { PROJECT_CATEGORIES, Project, ProjectCategory, ProjectImage, ProjectInput } from '../../types/project'

interface ProjectFormProps {
  /** Project being edited, or null to create a new one. */
  project: Project | null
  /** Suggested `order` for a new project (goes to the end). */
  nextOrder: number
  onClose: () => void
  onSaved: (message: string) => void
}

const COVER_PALETTE: [string, string][] = [
  ['#1B3A2F', '#0E1B16'],
  ['#2E2412', '#170F08'],
  ['#132436', '#0A121C'],
  ['#241A2E', '#130D19'],
  ['#122A22', '#091712'],
]

const isValidUrl = (value: string) => value === '' || /^https?:\/\/\S+$/i.test(value)

interface EditableProjectImage extends ProjectImage {
  previewUrl: string
  file?: File
}

function createImageId(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function ProjectForm({ project, nextOrder, onClose, onSaved }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [category, setCategory] = useState<ProjectCategory>(project?.category ?? 'Web Development')
  const [technologies, setTechnologies] = useState(project?.technologies.join(', ') ?? '')
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? '')
  const [projectUrl, setProjectUrl] = useState(project?.projectUrl ?? '')
  const [featured, setFeatured] = useState(project?.featured ?? false)
  const [isPublished] = useState(project?.isPublished !== false)
  const [order, setOrder] = useState(String(project?.order ?? nextOrder))
  const [problem, setProblem] = useState(project?.details.problem ?? '')
  const [solution, setSolution] = useState(project?.details.solution ?? '')
  const [features, setFeatures] = useState(project?.details.features.join('\n') ?? '')
  const [myRole, setMyRole] = useState(project?.details.myRole ?? '')

  const [images, setImages] = useState<EditableProjectImage[]>(() =>
    (project ? getProjectImages(project) : []).map((image) => ({ ...image, previewUrl: image.url })),
  )
  const previewUrls = useRef(new Set<string>())
  const [saveState, setSaveState] = useState<'idle' | 'selecting' | 'preparing' | 'saving' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const submitLock = useRef(false)
  const saving = saveState === 'selecting' || saveState === 'preparing' || saveState === 'saving'

  useEffect(() => () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrls.current.clear()
  }, [])

  const handleImageSelection = (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) return
    setError(null)
    setSaveState('idle')

    const accepted: EditableProjectImage[] = []
    for (const file of Array.from(selectedFiles)) {
      const validationError = validateProjectImage(file)
      if (validationError) {
        setError(validationError)
        setSaveState('error')
        continue
      }
      const duplicate = [...images, ...accepted].some((image) =>
        image.file?.name === file.name && image.file.size === file.size && image.file.lastModified === file.lastModified,
      )
      if (duplicate) continue
      if (images.length + accepted.length >= MAX_PROJECT_IMAGES) {
        setError(`A project can have at most ${MAX_PROJECT_IMAGES} images.`)
        setSaveState('error')
        break
      }

      const previewUrl = URL.createObjectURL(file)
      previewUrls.current.add(previewUrl)
      accepted.push({ id: createImageId(), url: '', previewUrl, file })
    }
    if (accepted.length) setImages((current) => [...current, ...accepted])
  }

  const removeImage = (id: string) => {
    setImages((current) => {
      const removed = current.find((image) => image.id === id)
      if (removed?.file) {
        URL.revokeObjectURL(removed.previewUrl)
        previewUrls.current.delete(removed.previewUrl)
      }
      return current.filter((image) => image.id !== id)
    })
    setSaveState('idle')
    setError(null)
  }

  const moveImage = (index: number, offset: -1 | 1) => {
    setImages((current) => {
      const nextIndex = index + offset
      if (nextIndex < 0 || nextIndex >= current.length) return current
      const next = [...current]
      ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
      return next
    })
    setSaveState('idle')
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitLock.current || saving) return
    setError(null)

    if (!title.trim() || !description.trim()) {
      setError('Project name and description are required.')
      setSaveState('error')
      return
    }
    if (!isValidUrl(githubUrl.trim()) || !isValidUrl(projectUrl.trim())) {
      setError('URLs must start with http:// or https://')
      setSaveState('error')
      return
    }
    const orderNumber = Number(order)
    if (!Number.isFinite(orderNumber)) {
      setError('Order must be a number.')
      setSaveState('error')
      return
    }

    submitLock.current = true
    const hasNewImages = images.some((image) => image.file)
    setSaveState(hasNewImages ? 'preparing' : 'saving')
    try {
      const imageBase: Project['image'] = project?.image ?? {
        gradient: COVER_PALETTE[Math.floor(Math.random() * COVER_PALETTE.length)],
        icon: 'Sparkles',
      }

      let totalImageDataLength = 0
      const seenUrls = new Set<string>()
      const savedImages: ProjectImage[] = []
      for (const image of images) {
        const url = image.file ? await prepareProjectImage(image.file) : image.url
        if (!url || seenUrls.has(url)) continue
        totalImageDataLength += url.length
        if (totalImageDataLength > MAX_PROJECT_TOTAL_IMAGE_DATA_URL_LENGTH) {
          throw new Error('These images are too large. Please use fewer or smaller images.')
        }
        seenUrls.add(url)
        savedImages.push({ id: image.id, url, ...(image.alt ? { alt: image.alt } : {}) })
      }

      const primaryImage = savedImages[0]
      const image: Project['image'] = {
        ...imageBase,
        url: primaryImage?.url,
        path: primaryImage?.url && primaryImage.url === project?.image.url ? project?.image.path : undefined,
      }

      setSaveState('saving')

      const input: ProjectInput = {
        title: title.trim(),
        description: description.trim(),
        category,
        image,
        images: savedImages,
        technologies: technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        githubUrl: githubUrl.trim() || undefined,
        projectUrl: projectUrl.trim() || undefined,
        featured,
        isPublished,
        order: orderNumber,
        details: {
          problem: problem.trim(),
          solution: solution.trim(),
          features: features
            .split('\n')
            .map((f) => f.trim())
            .filter(Boolean),
          myRole: myRole.trim(),
        },
      }

      if (project) await updateProject(project.id, input)
      else await createProject(input)

      setSaveState('success')
      onSaved(project ? 'Project updated.' : 'Project added.')
    } catch (err) {
      setError(describeError(err, 'Could not save the project.'))
      setSaveState('error')
    } finally {
      submitLock.current = false
    }
  }

  return (
    <Modal title={project ? 'Edit Project' : 'Add Project'} onClose={saving ? () => undefined : onClose} maxWidthClassName="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && (
          <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <section>
          <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className={labelClass}>Project Images</h3>
              <p className="text-xs text-light-secondary dark:text-text-secondary">
                First image is the cover. Up to {MAX_PROJECT_IMAGES} images; JPG, PNG or WebP, 5 MiB each.
              </p>
            </div>
            <label htmlFor="pf-images" className={`${primaryButtonClass} cursor-pointer`}>
              <ImagePlus size={15} /> Add Images
            </label>
            <input
              id="pf-images"
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              multiple
              disabled={saving || images.length >= MAX_PROJECT_IMAGES}
              onChange={(event) => {
                handleImageSelection(event.currentTarget.files)
                event.currentTarget.value = ''
              }}
              className="sr-only"
            />
          </div>
          {images.length === 0 ? (
            <p className="rounded-lg border border-dashed border-light-border dark:border-base-border px-3 py-4 text-sm text-light-secondary dark:text-text-secondary">
              No images. The project will use its gradient cover.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div key={image.id} className="overflow-hidden rounded-lg border border-light-border dark:border-base-border">
                  <div className="relative aspect-video bg-black/20">
                    <img src={image.previewUrl} alt={image.alt ?? `Project image ${index + 1}`} className="h-full w-full object-contain" />
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-white">
                      {index === 0 ? 'Cover · 1' : `Image ${index + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-1 p-1.5">
                    <button type="button" onClick={() => moveImage(index, -1)} disabled={saving || index === 0} aria-label={`Move image ${index + 1} up`} className="rounded p-1.5 text-light-secondary hover:text-light-primary disabled:opacity-40 dark:text-text-secondary dark:hover:text-text-primary">
                      <ArrowUp size={15} />
                    </button>
                    <button type="button" onClick={() => moveImage(index, 1)} disabled={saving || index === images.length - 1} aria-label={`Move image ${index + 1} down`} className="rounded p-1.5 text-light-secondary hover:text-light-primary disabled:opacity-40 dark:text-text-secondary dark:hover:text-text-primary">
                      <ArrowDown size={15} />
                    </button>
                    <button type="button" onClick={() => removeImage(image.id)} disabled={saving} aria-label={`Remove image ${index + 1}`} className="rounded p-1.5 text-red-400 hover:bg-red-500/10 disabled:opacity-40">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div>
          <label className={labelClass} htmlFor="pf-title">Project name</label>
          <input id="pf-title" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} disabled={saving} maxLength={120} />
        </div>

        <div>
          <label className={labelClass} htmlFor="pf-description">Short description</label>
          <textarea id="pf-description" className={`${inputClass} min-h-[80px] resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} disabled={saving} maxLength={2000} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="pf-category">Category</label>
            <select id="pf-category" className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as ProjectCategory)} disabled={saving}>
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-tech">Technologies (comma separated)</label>
            <input id="pf-tech" className={inputClass} value={technologies} onChange={(e) => setTechnologies(e.target.value)} disabled={saving} placeholder="React, Python, Figma" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="pf-demo">Project / demo URL</label>
            <input id="pf-demo" className={inputClass} value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} disabled={saving} placeholder="https://" inputMode="url" />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-github">GitHub URL</label>
            <input id="pf-github" className={inputClass} value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} disabled={saving} placeholder="https://github.com/" inputMode="url" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="pf-order">Order (lower shows first)</label>
            <input id="pf-order" type="number" className={inputClass} value={order} onChange={(e) => setOrder(e.target.value)} disabled={saving} />
          </div>
          <label className="flex items-center gap-2.5 sm:mt-7 text-sm text-light-primary dark:text-text-primary cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} disabled={saving} className="w-4 h-4 accent-[#5B8DEF]" />
            Featured on the home page
          </label>
        </div>

        <fieldset className="flex flex-col gap-4 border-t border-light-border dark:border-base-border pt-4">
          <legend className="text-sm font-semibold text-light-primary dark:text-text-primary pr-2">Project details</legend>
          <div>
            <label className={labelClass} htmlFor="pf-problem">Problem</label>
            <textarea id="pf-problem" className={`${inputClass} min-h-[72px] resize-y`} value={problem} onChange={(e) => setProblem(e.target.value)} disabled={saving} />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-solution">Solution</label>
            <textarea id="pf-solution" className={`${inputClass} min-h-[72px] resize-y`} value={solution} onChange={(e) => setSolution(e.target.value)} disabled={saving} />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-features">Features (one per line)</label>
            <textarea id="pf-features" className={`${inputClass} min-h-[88px] resize-y`} value={features} onChange={(e) => setFeatures(e.target.value)} disabled={saving} />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-role">My role</label>
            <textarea id="pf-role" className={`${inputClass} min-h-[64px] resize-y`} value={myRole} onChange={(e) => setMyRole(e.target.value)} disabled={saving} />
          </div>
        </fieldset>

        <div className="flex justify-end gap-3 pt-1">
          {saveState !== 'idle' && (
            <p role="status" aria-live="polite" className="mr-auto self-center text-sm text-light-secondary dark:text-text-secondary">
              {saveState === 'selecting' && 'Selecting image…'}
              {saveState === 'preparing' && 'Optimizing images…'}
              {saveState === 'saving' && 'Saving project…'}
              {saveState === 'success' && 'Project saved.'}
              {saveState === 'error' && error}
            </p>
          )}
          <button type="button" onClick={onClose} disabled={saving} className={ghostButtonClass}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryButtonClass}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saveState === 'preparing' ? 'Preparing images…' : saving ? 'Saving…' : project ? 'Save changes' : 'Add project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

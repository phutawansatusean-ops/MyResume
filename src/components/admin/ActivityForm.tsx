import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { Modal } from '../Modal'
import { inputClass, labelClass, primaryButtonClass, ghostButtonClass } from './formStyles'
import { describeError } from '../../lib/errors'
import { createActivity, updateActivity } from '../../services/activityService'
import { MAX_PROJECT_IMAGES, MAX_PROJECT_TOTAL_IMAGE_DATA_URL_LENGTH, prepareProjectImage, validateProjectImage } from '../../services/projectImageService'
import { Activity, ActivityImage, ActivityInput } from '../../types/activity'

interface ActivityFormProps {
  activity: Activity | null
  onClose: () => void
  onSaved: (message: string) => void
}

interface EditableImage extends ActivityImage { previewUrl: string; file?: File }

function createImageId() {
  return typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function ActivityForm({ activity, onClose, onSaved }: ActivityFormProps) {
  const [name, setName] = useState(activity?.name ?? '')
  const [description, setDescription] = useState(activity?.description ?? '')
  const [category, setCategory] = useState(activity?.category ?? '')
  const [date, setDate] = useState(activity?.date ?? '')
  const [location, setLocation] = useState(activity?.location ?? '')
  const [role, setRole] = useState(activity?.role ?? '')
  const [images, setImages] = useState<EditableImage[]>(() => (activity?.images ?? (activity?.imageUrl ? [{ id: 'legacy-image', url: activity.imageUrl }] : [])).map((image) => ({ ...image, previewUrl: image.url })))
  const previewUrls = useRef(new Set<string>())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submitLock = useRef(false)

  useEffect(() => () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrls.current.clear()
  }, [])

  const addImages = (files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    const accepted: EditableImage[] = []
    for (const file of Array.from(files)) {
      const validationError = validateProjectImage(file)
      if (validationError) { setError(validationError); continue }
      const duplicate = [...images, ...accepted].some((image) => image.file?.name === file.name && image.file.size === file.size && image.file.lastModified === file.lastModified)
      if (duplicate) continue
      if (images.length + accepted.length >= MAX_PROJECT_IMAGES) { setError(`An activity can have at most ${MAX_PROJECT_IMAGES} images.`); break }
      const previewUrl = URL.createObjectURL(file)
      previewUrls.current.add(previewUrl)
      accepted.push({ id: createImageId(), url: '', previewUrl, file })
    }
    if (accepted.length) setImages((current) => [...current, ...accepted])
  }

  const removeImage = (id: string) => setImages((current) => {
    const removed = current.find((image) => image.id === id)
    if (removed?.file) { URL.revokeObjectURL(removed.previewUrl); previewUrls.current.delete(removed.previewUrl) }
    return current.filter((image) => image.id !== id)
  })

  const moveImage = (index: number, offset: -1 | 1) => setImages((current) => {
    const target = index + offset
    if (target < 0 || target >= current.length) return current
    const next = [...current]
    ;[next[index], next[target]] = [next[target], next[index]]
    return next
  })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitLock.current || saving) return
    setError(null)
    if (!name.trim()) { setError('Activity name is required.'); return }
    submitLock.current = true
    setSaving(true)
    try {
      let totalImageDataLength = 0
      const seenUrls = new Set<string>()
      const savedImages: ActivityImage[] = []
      for (const image of images) {
        const url = image.file ? await prepareProjectImage(image.file) : image.url
        if (!url || seenUrls.has(url)) continue
        totalImageDataLength += url.length
        if (totalImageDataLength > MAX_PROJECT_TOTAL_IMAGE_DATA_URL_LENGTH) throw new Error('These images are too large. Please use fewer or smaller images.')
        seenUrls.add(url)
        savedImages.push({ id: image.id, url, ...(image.alt ? { alt: image.alt } : {}) })
      }
      const input: ActivityInput = {
        name: name.trim(), description: description.trim(), category: category.trim() || undefined,
        date: date.trim() || undefined, location: location.trim() || undefined, role: role.trim() || undefined,
        images: savedImages, imageUrl: savedImages[0]?.url, isPublished: activity?.isPublished !== false,
      }
      if (activity) await updateActivity(activity.id, input)
      else await createActivity(input)
      onSaved(activity ? 'Activity updated.' : 'Activity added.')
    } catch (err) { setError(describeError(err, 'Could not save the activity.')) }
    finally { submitLock.current = false; setSaving(false) }
  }

  return <Modal title={activity ? 'Edit Activity' : 'Add Activity'} onClose={saving ? () => undefined : onClose} maxWidthClassName="max-w-2xl">
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {error && <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
      <section>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-3"><div><h3 className={labelClass}>Activity Images</h3><p className="text-xs text-light-secondary dark:text-text-secondary">First image is the cover. Up to {MAX_PROJECT_IMAGES} images; JPG, JPEG, PNG or WebP, 5 MiB each.</p></div>
          <label htmlFor="af-images" className={`${primaryButtonClass} cursor-pointer`}><ImagePlus size={15} /> Add Images</label>
          <input id="af-images" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple disabled={saving || images.length >= MAX_PROJECT_IMAGES} onChange={(event) => { addImages(event.currentTarget.files); event.currentTarget.value = '' }} className="sr-only" />
        </div>
        {images.length === 0 ? <p className="rounded-lg border border-dashed border-light-border px-3 py-4 text-sm text-light-secondary dark:border-base-border dark:text-text-secondary">No images. This activity will use the default cover.</p> :
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((image, index) => <div key={image.id} className="overflow-hidden rounded-lg border border-light-border dark:border-base-border"><div className="relative aspect-video bg-black/20"><img src={image.previewUrl} alt={image.alt ?? `Activity image ${index + 1}`} className="h-full w-full object-contain" /><span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-white">{index === 0 ? 'Cover · 1' : `Image ${index + 1}`}</span></div><div className="flex items-center justify-end gap-1 p-1.5"><button type="button" onClick={() => moveImage(index, -1)} disabled={saving || index === 0} aria-label={`Move image ${index + 1} up`} className="rounded p-1.5 text-light-secondary hover:text-light-primary disabled:opacity-40 dark:text-text-secondary dark:hover:text-text-primary"><ArrowUp size={15} /></button><button type="button" onClick={() => moveImage(index, 1)} disabled={saving || index === images.length - 1} aria-label={`Move image ${index + 1} down`} className="rounded p-1.5 text-light-secondary hover:text-light-primary disabled:opacity-40 dark:text-text-secondary dark:hover:text-text-primary"><ArrowDown size={15} /></button><button type="button" onClick={() => removeImage(image.id)} disabled={saving} aria-label={`Remove image ${index + 1}`} className="rounded p-1.5 text-red-400 hover:bg-red-500/10 disabled:opacity-40"><Trash2 size={15} /></button></div></div>)}</div>}
      </section>
      <div><label className={labelClass} htmlFor="af-name">Activity name</label><input id="af-name" className={inputClass} value={name} onChange={(event) => setName(event.target.value)} disabled={saving} maxLength={120} required /></div>
      <div><label className={labelClass} htmlFor="af-description">Description</label><textarea id="af-description" className={`${inputClass} min-h-[90px] resize-y`} value={description} onChange={(event) => setDescription(event.target.value)} disabled={saving} maxLength={2000} /></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label className={labelClass} htmlFor="af-category">Category</label><input id="af-category" className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)} disabled={saving} maxLength={120} /></div>
        <div><label className={labelClass} htmlFor="af-date">Date</label><input id="af-date" className={inputClass} value={date} onChange={(event) => setDate(event.target.value)} disabled={saving} maxLength={120} placeholder="e.g. June 2025" /></div>
        <div><label className={labelClass} htmlFor="af-location">Location</label><input id="af-location" className={inputClass} value={location} onChange={(event) => setLocation(event.target.value)} disabled={saving} maxLength={240} /></div>
        <div><label className={labelClass} htmlFor="af-role">Role</label><input id="af-role" className={inputClass} value={role} onChange={(event) => setRole(event.target.value)} disabled={saving} maxLength={240} /></div>
      </div>
      <div className="flex justify-end gap-3 pt-1">{saving && <p role="status" aria-live="polite" className="mr-auto self-center text-sm text-light-secondary dark:text-text-secondary"><Loader2 size={14} className="mr-1 inline animate-spin" />Optimizing and saving…</p>}<button type="button" onClick={onClose} disabled={saving} className={ghostButtonClass}>Cancel</button><button type="submit" disabled={saving} className={primaryButtonClass}>{saving ? 'Saving…' : activity ? 'Save changes' : 'Add Activity'}</button></div>
    </form>
  </Modal>
}
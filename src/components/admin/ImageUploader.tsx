import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2, Undo2 } from 'lucide-react'
import { validateImageFile } from '../../services/imageValidation'

interface ImageUploaderProps {
  label: string
  /** Image that is currently saved (download URL). */
  currentUrl?: string
  /** Newly chosen file that has not been uploaded yet. */
  file: File | null
  /** True when the user chose to remove the saved image. */
  removed: boolean
  /** Upload progress 0–100, or null when idle. */
  progress: number | null
  accept?: string
  validateFile?: (file: File) => string | null
  disabled?: boolean
  onFileChange: (file: File | null) => void
  onRemovedChange: (removed: boolean) => void
  onSelectingChange?: (selecting: boolean) => void
}

export function ImageUploader({
  label,
  currentUrl,
  file,
  removed,
  progress,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  validateFile = validateImageFile,
  disabled,
  onFileChange,
  onRemovedChange,
  onSelectingChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectingChange?.(false)
    const chosen = event.target.files?.[0]
    event.target.value = '' // allow re-selecting the same file later
    if (!chosen) return
    const problem = validateFile(chosen)
    if (problem) {
      setError(problem)
      return
    }
    setError(null)
    onRemovedChange(false)
    onFileChange(chosen)
  }

  const shownUrl = preview ?? (removed ? undefined : currentUrl)
  const hasSaved = Boolean(currentUrl)

  const buttonClass =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-light-border dark:border-base-border text-light-primary dark:text-text-primary hover:border-accent/50 disabled:opacity-50 transition-colors'

  return (
    <div>
      <span className="block text-sm font-medium text-light-primary dark:text-text-primary mb-1.5">{label}</span>

      <div className="flex items-center justify-center h-44 rounded-lg border border-dashed border-light-border dark:border-base-border bg-light-bg dark:bg-base-bg overflow-hidden">
        {shownUrl ? (
          <img src={shownUrl} alt={`${label} preview`} className="max-h-full max-w-full object-contain" />
        ) : (
          <p className="text-sm text-light-secondary dark:text-text-secondary">
            {removed ? 'Image will be removed when you save' : 'No image selected'}
          </p>
        )}
      </div>

      {progress !== null && (
        <div className="mt-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <div className="h-1.5 rounded-full bg-light-border dark:bg-base-border overflow-hidden">
            <div className="h-full bg-accent transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-light-secondary dark:text-text-secondary">Uploading… {progress}%</p>
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleSelect}
          disabled={disabled}
          aria-label={`Choose ${label.toLowerCase()} file`}
        />
        <button
          type="button"
          className={buttonClass}
          disabled={disabled}
          onClick={() => {
            setError(null)
            onSelectingChange?.(true)
            window.addEventListener('focus', () => onSelectingChange?.(false), { once: true })
            inputRef.current?.click()
          }}
        >
          <ImagePlus size={15} />
          {hasSaved || file ? 'Replace image' : 'Choose image'}
        </button>

        {file && (
          <button type="button" className={buttonClass} disabled={disabled} onClick={() => onFileChange(null)}>
            <Undo2 size={15} />
            Discard new image
          </button>
        )}

        {!file && hasSaved && !removed && (
          <button type="button" className={buttonClass} disabled={disabled} onClick={() => onRemovedChange(true)}>
            <Trash2 size={15} />
            Remove image
          </button>
        )}

        {!file && removed && (
          <button type="button" className={buttonClass} disabled={disabled} onClick={() => onRemovedChange(false)}>
            <Undo2 size={15} />
            Keep current image
          </button>
        )}
      </div>

      <p className="mt-1.5 text-xs text-light-secondary dark:text-text-secondary">JPG, PNG, WebP or GIF, up to 5 MB.</p>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

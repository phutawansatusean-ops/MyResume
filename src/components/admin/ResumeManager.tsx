import { FormEvent, useEffect, useRef, useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { describeError } from '../../lib/errors'
import { getResumeFileName, saveResume } from '../../services/resumeService'
import { encodeResumePdf, validateResumeFile } from '../../services/resumeFileService'
import { NotifyFn } from './types'
import { primaryButtonClass } from './formStyles'

interface ResumeManagerProps {
  notify: NotifyFn
}

type UploadState = 'idle' | 'preparing' | 'saving' | 'success' | 'error'

export function ResumeManager({ notify }: ResumeManagerProps) {
  const [currentFileName, setCurrentFileName] = useState<string | null>(null)
  const [loadingCurrent, setLoadingCurrent] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const submitLock = useRef(false)
  const busy = uploadState === 'preparing' || uploadState === 'saving'

  useEffect(() => {
    let active = true
    void getResumeFileName()
      .then((fileName) => {
        if (active) setCurrentFileName(fileName)
      })
      .catch((err: unknown) => {
        if (active) setLoadError(describeError(err, 'Could not load Resume status.'))
      })
      .finally(() => {
        if (active) setLoadingCurrent(false)
      })
    return () => { active = false }
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!file || submitLock.current || busy) return

    submitLock.current = true
    setError(null)
    setUploadState('preparing')
    try {
      const fileData = await encodeResumePdf(file)
      setUploadState('saving')
      await saveResume(file.name, fileData)
      setCurrentFileName(file.name)
      setFile(null)
      setUploadState('success')
      notify('success', 'Resume uploaded successfully.')
    } catch (err) {
      setError(describeError(err, 'Upload failed.'))
      setUploadState('error')
    } finally {
      submitLock.current = false
    }
  }

  const handleFileChange = (selectedFile: File | null) => {
    setFile(null)
    setError(null)
    setUploadState('idle')
    if (!selectedFile) return

    const validationError = validateResumeFile(selectedFile)
    if (validationError) {
      setError(validationError)
      setUploadState('error')
      return
    }
    setFile(selectedFile)
  }

  return (
    <section className="max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">Resume</h2>
      <form onSubmit={(event) => void handleSubmit(event)} className="rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card p-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-accent/15 flex items-center justify-center">
            <FileText size={17} className="text-accent" />
          </div>
          <div className="min-w-0">
            <p className="font-medium">Current Resume</p>
            <p className="mt-1 text-sm text-light-secondary dark:text-text-secondary break-all">
              {loadingCurrent ? 'Loading status…' : loadError || (currentFileName ? currentFileName : 'No Resume uploaded')}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="resume-pdf" className="block text-sm font-medium mb-1.5">Choose Resume PDF</label>
          <input
            id="resume-pdf"
            type="file"
            accept="application/pdf,.pdf"
            disabled={busy}
            onChange={(event) => {
              handleFileChange(event.currentTarget.files?.[0] ?? null)
              event.currentTarget.value = ''
            }}
            className="block w-full text-sm text-light-secondary dark:text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-accent/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/20 disabled:opacity-60"
          />
          <p className="mt-1.5 text-xs text-light-secondary dark:text-text-secondary">PDF only, up to 4 MiB. Uploading replaces the current Resume.</p>
          {file && <p className="mt-2 text-sm text-light-secondary dark:text-text-secondary break-all">Selected: {file.name}</p>}
        </div>

        {(error || loadError) && (
          <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error || loadError}
          </p>
        )}
        {uploadState !== 'idle' && uploadState !== 'error' && (
          <p role="status" aria-live="polite" className="text-sm text-light-secondary dark:text-text-secondary">
            {uploadState === 'preparing' && 'Preparing PDF…'}
            {uploadState === 'saving' && 'Saving Resume…'}
            {uploadState === 'success' && 'Resume uploaded successfully.'}
          </p>
        )}

        <button type="submit" disabled={!file || busy} className={`${primaryButtonClass} self-start`}>
          {busy && <Loader2 size={14} className="animate-spin" />}
          {uploadState === 'preparing' ? 'Preparing…' : uploadState === 'saving' ? 'Saving…' : 'Upload / Save Resume'}
        </button>
      </form>
    </section>
  )
}
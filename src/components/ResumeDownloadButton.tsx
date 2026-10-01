import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { describeError } from '../lib/errors'
import { getResume } from '../services/resumeService'

export function ResumeDownloadButton() {
  const [downloading, setDownloading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleDownload = async () => {
    if (downloading) return
    setDownloading(true)
    setMessage(null)
    try {
      const resume = await getResume()
      if (!resume) {
        setMessage('No Resume has been uploaded yet.')
        return
      }

      const binary = atob(resume.fileData)
      const bytes = new Uint8Array(binary.length)
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index)
      }

      const url = URL.createObjectURL(new Blob([bytes], { type: resume.mimeType }))
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = resume.fileName || 'resume.pdf'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMessage('Resume download started.')
    } catch (err) {
      setMessage(describeError(err, 'Could not download the Resume.'))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => void handleDownload()}
        disabled={downloading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 disabled:opacity-60 transition-colors"
      >
        {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        Download Resume
      </button>
      {message && <p role="status" aria-live="polite" className="mt-2 text-sm text-light-secondary dark:text-text-secondary">{message}</p>}
    </div>
  )
}
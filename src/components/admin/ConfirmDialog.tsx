import { Loader2 } from 'lucide-react'
import { Modal } from '../Modal'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={busy ? () => undefined : onCancel} maxWidthClassName="max-w-sm">
      <p className="text-sm text-light-secondary dark:text-text-secondary leading-relaxed">{message}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="px-4 py-2 rounded-lg text-sm font-medium text-light-secondary dark:text-text-secondary hover:text-light-primary dark:hover:text-text-primary disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-500/90 disabled:opacity-60 transition-colors"
        >
          {busy && <Loader2 size={14} className="animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

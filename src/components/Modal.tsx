import { useEffect, ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  maxWidthClassName?: string
}

export function Modal({ title, onClose, children, maxWidthClassName = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`w-full ${maxWidthClassName} max-h-[85vh] overflow-y-auto rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card shadow-soft`}
      >
        <div className="sticky top-0 flex items-center justify-between px-5 md:px-6 py-4 border-b border-light-border dark:border-base-border bg-light-card dark:bg-base-card">
          <h2 className="font-display font-semibold text-base text-light-primary dark:text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-light-secondary dark:text-text-secondary hover:text-light-primary dark:hover:text-text-primary hover:bg-light-bg dark:hover:bg-base-bg transition-colors"
          >
            <X size={17} />
          </button>
        </div>
        <div className="px-5 md:px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

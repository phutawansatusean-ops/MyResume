import { Home, FolderKanban, User, Mail, CalendarDays } from 'lucide-react'
import { Page } from '../App'

interface MobileNavProps {
  activePage: Page
  onNavigate: (page: Page) => void
}

const navItems: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'works', label: 'Works', icon: FolderKanban },
  { id: 'activities', label: 'My Activities', icon: CalendarDays },
  { id: 'about', label: 'About', icon: User },
  { id: 'contact', label: 'Contact', icon: Mail },
]

export function MobileNav({ activePage, onNavigate }: MobileNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-light-border dark:border-base-border bg-light-card/95 dark:bg-base-bg/95 backdrop-blur-sm shadow-[0_-8px_24px_rgba(10,20,16,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Primary"
    >
      <div className="flex items-stretch justify-around">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 px-1 text-[10px] font-medium leading-tight transition-colors ${
                isActive
                  ? 'text-accent'
                  : 'text-light-secondary dark:text-text-secondary'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              <span className="max-w-full text-center">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

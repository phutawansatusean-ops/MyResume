import { Home, FolderKanban, User, Mail, CalendarDays } from 'lucide-react'
import { Page } from '../App'

interface SidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
}

const navItems: { id: Page; key: string; label: string; icon: typeof Home }[] = [
  { id: 'home', key: 'profile', label: 'Profile', icon: User },
  { id: 'home', key: 'home', label: 'Home', icon: Home },
  { id: 'works', key: 'works', label: 'My Works', icon: FolderKanban },
  { id: 'activities', key: 'activities', label: 'My Activities', icon: CalendarDays },
  { id: 'about', key: 'about', label: 'About Me', icon: User },
  { id: 'contact', key: 'contact', label: 'Contact', icon: Mail },
]

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sticky top-0 z-30 hidden w-full border-b border-light-border bg-light-card dark:border-base-border dark:bg-base-bg md:block">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-center gap-1 overflow-x-auto px-2" aria-label="Primary">
        {navItems.map(({ id, key, label, icon: Icon }) => {
          const isActive = key !== 'profile' && activePage === id
          return (
            <button
              key={key}
              onClick={() => onNavigate(id)}
              aria-current={isActive ? 'page' : undefined}
              title={label}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-accent/10 text-accent ring-1 ring-inset ring-accent/20'
                    : 'text-light-secondary dark:text-text-secondary hover:bg-light-bg dark:hover:bg-base-card hover:text-light-primary dark:hover:text-text-primary'
                }`}
            >
              <Icon size={17} strokeWidth={isActive ? 2.4 : 2} className="shrink-0" />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

    </aside>
  )
}

import { Home, FolderKanban, User, Mail, Compass, CalendarDays } from 'lucide-react'
import { Page } from '../App'

interface SidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
}

const navItems: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'works', label: 'My Works', icon: FolderKanban },
  { id: 'activities', label: 'My Activities', icon: CalendarDays },
  { id: 'about', label: 'About Me', icon: User },
  { id: 'contact', label: 'Contact', icon: Mail },
]

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside
      className="hidden md:flex md:flex-col fixed left-0 top-0 h-full w-[76px] lg:w-[232px] border-r border-light-border dark:border-base-border bg-light-card dark:bg-base-bg z-30 transition-[width]"
      aria-label="Primary"
    >
      <div className="flex items-center gap-2.5 h-20 px-5 lg:px-6 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
          <Compass size={18} className="text-accent" strokeWidth={2.25} />
        </div>
        <span className="hidden lg:block font-semibold text-[15px] tracking-tight text-light-primary dark:text-text-primary">
          Portfolio
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3 lg:px-4 mt-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              aria-current={isActive ? 'page' : undefined}
              title={label}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-accent/10 text-accent ring-1 ring-inset ring-accent/20'
                    : 'text-light-secondary dark:text-text-secondary hover:bg-light-bg dark:hover:bg-base-card hover:text-light-primary dark:hover:text-text-primary'
                }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.4 : 2} className="shrink-0" />
              <span className="hidden lg:block">{label}</span>
            </button>
          )
        })}
      </nav>

    </aside>
  )
}

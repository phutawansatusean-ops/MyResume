import { Page } from '../App'
import { navigationItems } from './navigationItems'

interface SidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const activeIndex = navigationItems.findIndex(({ id }) => activePage === id)

  return (
    <aside className="sticky top-0 z-30 hidden px-4 pt-4 md:block">
      <nav
        className="glass-nav relative mx-auto grid h-16 max-w-5xl grid-cols-5 overflow-hidden rounded-full p-1.5 shadow-[0_12px_36px_rgba(7,15,20,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.34)]"
        aria-label="Primary navigation"
      >
        <span
          aria-hidden="true"
          className="glass-nav-indicator absolute inset-y-1.5 left-1.5 rounded-full"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
        {navigationItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative z-10 flex min-w-0 items-center justify-center gap-2 rounded-full px-2 text-sm font-medium transition-colors duration-300 focus-visible:rounded-full ${
                isActive
                  ? 'text-[#148B7A] dark:text-[#5FFFE0] dark:[filter:drop-shadow(0_0_8px_rgba(95,255,224,0.3))]'
                  : 'text-light-secondary hover:text-light-primary dark:text-text-secondary dark:hover:text-text-primary'
              }`}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0 transition-transform duration-300 hover:scale-105" />
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

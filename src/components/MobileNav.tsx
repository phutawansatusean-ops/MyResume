import { Page } from '../App'
import { navigationItems } from './navigationItems'

interface MobileNavProps {
  activePage: Page
  onNavigate: (page: Page) => void
}

export function MobileNav({ activePage, onNavigate }: MobileNavProps) {
  const activeIndex = navigationItems.findIndex(({ id }) => activePage === id)

  return (
    <div className="mobile-nav-position fixed inset-x-0 z-40 px-4 md:hidden">
      <nav
        className="glass-nav relative mx-auto grid h-[4.5rem] w-full max-w-md grid-cols-5 overflow-hidden rounded-full p-1.5 shadow-[0_12px_36px_rgba(7,15,20,0.16)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.48)]"
        aria-label="Primary navigation"
      >
        <span
          aria-hidden="true"
          className="glass-nav-indicator absolute inset-y-1 left-1 rounded-full"
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
              className={`relative z-10 flex min-w-0 flex-col items-center justify-center gap-1 rounded-full px-0.5 text-[10px] font-medium leading-tight transition-colors duration-300 focus-visible:rounded-full ${
                isActive
                  ? 'text-[#148B7A] dark:text-[#5FFFE0]'
                  : 'text-light-secondary hover:text-light-primary dark:text-text-secondary dark:hover:text-text-primary'
              }`}
            >
              <Icon
                size={19}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={`shrink-0 transition-all duration-300 ${
                  isActive ? 'dark:drop-shadow-[0_0_7px_rgba(95,255,224,0.45)]' : ''
                }`}
              />
              <span className="max-w-full truncate text-center">{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

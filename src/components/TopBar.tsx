import { Link } from 'react-router-dom'
import { LayoutDashboard, LogIn, Moon, Sun } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { Theme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'
import { usePortfolioData } from '../context/PortfolioDataContext'

interface TopBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  theme: Theme
  onToggleTheme: () => void
}

const iconButtonClass =
  'grid h-10 w-10 place-items-center border border-light-border dark:border-base-border text-light-secondary dark:text-text-secondary hover:text-light-primary dark:hover:text-text-primary hover:border-accent/50 transition-colors'

export function TopBar({ searchValue, onSearchChange, theme, onToggleTheme }: TopBarProps) {
  const { isAdmin } = useAuth()
  const { profile } = usePortfolioData()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-light-border bg-light-bg/90 px-4 backdrop-blur-sm dark:border-base-border dark:bg-base-bg/90 md:top-16 md:px-8">
      <SearchBar value={searchValue} onChange={onSearchChange} />

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className={iconButtonClass}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <Link
          to={isAdmin ? '/admin' : '/admin/login'}
          aria-label={isAdmin ? 'Open admin dashboard' : 'Admin login'}
          title={isAdmin ? 'Admin dashboard' : 'Login'}
          className={iconButtonClass}
        >
          {isAdmin ? <LayoutDashboard size={16} /> : <LogIn size={16} />}
        </Link>

        <img
          src={profile.avatarUrl || '/avatar.jpg'}
          alt={profile.name}
          className="h-10 w-10 object-contain shrink-0 border border-light-border dark:border-base-border bg-light-card dark:bg-base-card"
        />
      </div>
    </header>
  )
}

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xs lg:max-w-sm">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-light-secondary dark:text-text-secondary pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search projects, skills, or keywords..."
        aria-label="Search projects, skills, or keywords"
        className="w-full rounded-lg border border-light-border dark:border-base-border bg-light-bg dark:bg-base-card pl-9 pr-8 py-2 text-sm text-light-primary dark:text-text-primary placeholder:text-light-secondary dark:placeholder:text-text-secondary outline-none focus:border-accent transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-light-secondary dark:text-text-secondary hover:text-light-primary dark:hover:text-text-primary"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}

import { ProjectCategory } from '../types/project'

export type FilterValue = 'All' | ProjectCategory

interface ProjectFilterProps {
  active: FilterValue
  onChange: (value: FilterValue) => void
}

const filters: FilterValue[] = ['All', 'Web Development', 'AI / Data', 'Hardware', 'Design']

export function ProjectFilter({ active, onChange }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
      {filters.map((filter) => {
        const isActive = active === filter
        return (
          <button
            key={filter}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              isActive
                ? 'bg-accent text-[#10221c] border-accent'
                : 'border-light-border dark:border-base-border text-light-secondary dark:text-text-secondary hover:text-light-primary dark:hover:text-text-primary hover:border-accent/40'
            }`}
          >
            {filter}
          </button>
        )
      })}
    </div>
  )
}

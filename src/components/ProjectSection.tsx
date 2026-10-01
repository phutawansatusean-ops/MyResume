import { useMemo, useState } from 'react'
import { Plus, SearchX } from 'lucide-react'
import { Project } from '../types/project'
import { ProjectCard } from './ProjectCard'
import { ProjectFilter, FilterValue } from './ProjectFilter'

interface ProjectSectionProps {
  projects: Project[]
  searchQuery: string
  onViewDetails: (project: Project) => void
  /** Only passed for a logged-in admin; visitors don't get an upload button. */
  onUploadClick?: () => void
}

export function ProjectSection({ projects, searchQuery, onViewDetails, onUploadClick }: ProjectSectionProps) {
  const [filter, setFilter] = useState<FilterValue>('All')

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesFilter = filter === 'All' || project.category === filter
      if (!matchesFilter) return false
      if (!q) return true
      const haystack = [
        project.title,
        project.description,
        project.category,
        ...project.technologies,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [projects, filter, searchQuery])

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-light-primary dark:text-text-primary">My Projects</h2>
        {onUploadClick && (
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
          >
            <Plus size={16} />
            Upload Project
          </button>
        )}
      </div>

      <div className="mb-5">
        <ProjectFilter active={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 rounded-card border border-dashed border-light-border dark:border-base-border">
          <SearchX size={28} className="text-light-secondary dark:text-text-secondary mb-3" />
          <p className="text-sm font-medium text-light-primary dark:text-text-primary">
            {projects.length === 0 ? 'No projects yet' : 'No projects match'}
          </p>
          <p className="text-sm text-light-secondary dark:text-text-secondary mt-1">
            {projects.length === 0 ? 'Check back soon.' : 'Try a different keyword or filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </section>
  )
}

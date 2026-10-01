import { Project } from '../types/project'
import { ProjectCard } from './ProjectCard'

interface FeaturedProjectsProps {
  projects: Project[]
  onViewDetails: (project: Project) => void
}

export function FeaturedProjects({ projects, onViewDetails }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.featured)
  if (featured.length === 0) return null

  return (
    <section>
      <h2 className="text-lg font-semibold text-light-primary dark:text-text-primary mb-4">
        Featured Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} onViewDetails={onViewDetails} />
        ))}
      </div>
    </section>
  )
}

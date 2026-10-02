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
      <p className="portfolio-eyebrow">Selected work</p>
      <h2 className="portfolio-heading mb-5 mt-2 text-2xl md:text-3xl">
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

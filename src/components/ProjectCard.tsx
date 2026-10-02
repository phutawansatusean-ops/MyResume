import { ArrowRight } from 'lucide-react'
import { Project } from '../types/project'
import { ProjectCover } from './ProjectCover'

interface ProjectCardProps {
  project: Project
  onViewDetails: (project: Project) => void
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  return (
    <div className="portfolio-panel group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-soft">
      <ProjectCover project={project} className="aspect-[16/10] w-full" />

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-display text-lg font-semibold text-light-primary dark:text-text-primary">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-light-secondary dark:text-text-secondary line-clamp-2">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="border border-accent/20 px-2 py-1 font-mono text-[10px] text-accent"
            >
              {tech}
            </span>
          ))}
        </div>

        <button
          onClick={() => onViewDetails(project)}
          className="mt-4 flex items-center gap-1.5 text-sm font-medium text-light-primary dark:text-text-primary hover:text-accent transition-colors"
        >
          View Details
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}

import { ArrowRight } from 'lucide-react'
import { Project } from '../types/project'
import { ProjectCover } from './ProjectCover'

interface ProjectCardProps {
  project: Project
  onViewDetails: (project: Project) => void
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  return (
    <div className="group flex flex-col rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card overflow-hidden transition-colors hover:border-accent/40">
      <ProjectCover project={project} className="h-36 w-full" />

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-[15px] text-light-primary dark:text-text-primary">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-light-secondary dark:text-text-secondary line-clamp-2">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-accent/10 text-accent"
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

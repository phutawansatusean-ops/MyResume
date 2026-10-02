import { ExternalLink, Github } from 'lucide-react'
import { Modal } from './Modal'
import { Project } from '../types/project'
import { ProjectGallery } from './ProjectGallery'

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  return (
    <Modal title={project.title} onClose={onClose} maxWidthClassName="max-w-2xl">
      <div className="flex flex-col gap-5">
        <ProjectGallery project={project} />

        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="border border-accent/20 px-2 py-1 font-mono text-[10px] text-accent"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-sm text-light-secondary dark:text-text-secondary leading-7">
            {project.description}
          </p>
        </div>

        {project.details.problem && (
          <div>
            <h3 className="text-sm font-semibold text-light-primary dark:text-text-primary mb-1">Problem</h3>
            <p className="text-sm text-light-secondary dark:text-text-secondary leading-relaxed">
              {project.details.problem}
            </p>
          </div>
        )}

        {project.details.solution && (
          <div>
            <h3 className="text-sm font-semibold text-light-primary dark:text-text-primary mb-1">Solution</h3>
            <p className="text-sm text-light-secondary dark:text-text-secondary leading-relaxed">
              {project.details.solution}
            </p>
          </div>
        )}

        {project.details.features.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-light-primary dark:text-text-primary mb-2">Features</h3>
            <ul className="space-y-1.5">
              {project.details.features.map((feature) => (
                <li
                  key={feature}
                  className="text-sm text-light-secondary dark:text-text-secondary leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1 before:h-1 before:rounded-full before:bg-accent"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.details.myRole && (
          <div>
            <h3 className="text-sm font-semibold text-light-primary dark:text-text-primary mb-1">My Role</h3>
            <p className="text-sm text-light-secondary dark:text-text-secondary leading-relaxed">
              {project.details.myRole}
            </p>
          </div>
        )}

        {(project.projectUrl || project.githubUrl) && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-light-border dark:border-base-border">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-10 items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-[#10221c] bg-accent hover:bg-accent/85 transition-colors"
              >
                <ExternalLink size={15} />
                Project URL
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-lg border border-light-border dark:border-base-border text-light-primary dark:text-text-primary hover:border-accent/40 transition-colors"
              >
                <Github size={15} />
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

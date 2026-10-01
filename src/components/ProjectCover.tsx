import * as Icons from 'lucide-react'
import { Project } from '../types/project'
import { getProjectImages } from '../lib/projectImages'

interface ProjectCoverProps {
  project: Project
  className?: string
}

export function ProjectCover({ project, className = '' }: ProjectCoverProps) {
  const IconComponent = (Icons as unknown as Record<string, Icons.LucideIcon>)[project.image.icon] ?? Icons.Image
  const [from, to] = project.image.gradient
  const primaryImage = getProjectImages(project)[0]

  if (primaryImage?.url) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={primaryImage.url} alt={primaryImage.alt ?? ''} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <IconComponent size={36} strokeWidth={1.6} className="text-white/85" />
    </div>
  )
}

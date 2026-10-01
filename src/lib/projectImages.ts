import { Project, ProjectImage } from '../types/project'

/** Prefer the gallery; legacy projects fall back to their single cover image. */
export function getProjectImages(project: Project): ProjectImage[] {
  if (project.images?.length) return project.images
  if (!project.image.url) return []

  return [{ id: `${project.id}-legacy-image`, url: project.image.url }]
}

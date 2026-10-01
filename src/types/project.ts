export type ProjectCategory = 'Web Development' | 'AI / Data' | 'Hardware' | 'Design'

export const PROJECT_CATEGORIES: ProjectCategory[] = ['Web Development', 'AI / Data', 'Hardware', 'Design']

export interface ProjectDetails {
  problem: string
  solution: string
  features: string[]
  myRole: string
}

export interface ProjectImage {
  id: string
  url: string
  alt?: string
}

export interface Project {
  id: string
  title: string
  description: string
  category: ProjectCategory
  image: {
    gradient: [string, string]
    icon: string
    /** Optimized data URL or legacy Firebase Storage download URL. */
    url?: string
    /** Legacy Storage path retained when reading older project records. */
    path?: string
  }
  images?: ProjectImage[]
  technologies: string[]
  projectUrl?: string
  githubUrl?: string
  featured: boolean
  /** Missing values from older records are treated as published. */
  isPublished?: boolean
  details: ProjectDetails
  /** Lower numbers are shown first. */
  order: number
}

/** Everything about a project except its Realtime Database key. */
export type ProjectInput = Omit<Project, 'id'>

import { child, get, orderByChild, push, query, ref, serverTimestamp, update } from 'firebase/database'
import { requireDb } from '../lib/firebase'
import { Project, ProjectCategory, ProjectImage, ProjectInput } from '../types/project'
import { deleteImage } from './storageService'

const PATH = 'projects'
const PUBLIC_PATH = 'publishedProjects'
const FALLBACK_GRADIENT: [string, string] = ['#132436', '#0A121C']

/**
 * Realtime Database shape (node `/projects/{projectId}`):
 * name, description, category, technologies[], imageUrl, imagePath, coverGradient[2], coverIcon,
 * githubUrl, demoUrl, details{problem,solution,features[],myRole}, featured, order, createdAt, updatedAt
 */
function toProject(id: string, data: Record<string, unknown>): Project {
  const rawGradient = data.coverGradient
  const gradient: [string, string] =
    Array.isArray(rawGradient) && rawGradient.length === 2
      ? [String(rawGradient[0]), String(rawGradient[1])]
      : FALLBACK_GRADIENT
  const details = (data.details ?? {}) as Record<string, unknown>
  const rawFeatures = details.features
  const rawImages = data.images
  const imageEntries = Array.isArray(rawImages)
    ? rawImages
    : rawImages && typeof rawImages === 'object'
      ? Object.entries(rawImages as Record<string, unknown>)
        .sort(([left], [right]) => Number(left) - Number(right))
        .map(([, image]) => image)
      : []
  const images: ProjectImage[] = imageEntries.flatMap((candidate, index) => {
    if (!candidate || typeof candidate !== 'object') return []
    const image = candidate as Record<string, unknown>
    if (typeof image.url !== 'string' || !image.url) return []
    return [{
      id: typeof image.id === 'string' && image.id ? image.id : `${id}-image-${index}`,
      url: image.url,
      ...(typeof image.alt === 'string' ? { alt: image.alt } : {}),
    }]
  })

  return {
    id,
    title: typeof data.name === 'string' ? data.name : '',
    description: typeof data.description === 'string' ? data.description : '',
    category: (data.category ?? 'Web Development') as ProjectCategory,
    image: {
      gradient,
      icon: typeof data.coverIcon === 'string' && data.coverIcon ? data.coverIcon : 'Sparkles',
      url: typeof data.imageUrl === 'string' && data.imageUrl ? data.imageUrl : undefined,
      path: typeof data.imagePath === 'string' && data.imagePath ? data.imagePath : undefined,
    },
    images: images.length ? images : undefined,
    technologies: Array.isArray(data.technologies) ? data.technologies.map(String) : [],
    projectUrl: typeof data.demoUrl === 'string' && data.demoUrl ? data.demoUrl : undefined,
    githubUrl: typeof data.githubUrl === 'string' && data.githubUrl ? data.githubUrl : undefined,
    featured: Boolean(data.featured),
    isPublished: data.isPublished !== false,
    details: {
      problem: typeof details.problem === 'string' ? details.problem : '',
      solution: typeof details.solution === 'string' ? details.solution : '',
      features: Array.isArray(rawFeatures) ? rawFeatures.map(String) : [],
      myRole: typeof details.myRole === 'string' ? details.myRole : '',
    },
    order: typeof data.order === 'number' ? data.order : 0,
  }
}

// Realtime Database rejects `undefined`, so optional values are stored as empty strings.
function toRecord(input: ProjectInput) {
  const images = input.images ?? (input.image.url ? [{ id: 'legacy-image', url: input.image.url }] : [])
  return {
    name: input.title,
    description: input.description,
    category: input.category,
    technologies: input.technologies,
    imageUrl: input.images !== undefined ? images[0]?.url ?? '' : input.image.url ?? '',
    images: images.length ? images.map(({ id, url, alt }) => ({ id, url, ...(alt ? { alt } : {}) })) : null,
    imagePath: input.image.path ?? '',
    coverGradient: input.image.gradient,
    coverIcon: input.image.icon,
    githubUrl: input.githubUrl ?? '',
    demoUrl: input.projectUrl ?? '',
    details: input.details,
    featured: input.featured,
    isPublished: input.isPublished !== false,
    order: input.order,
  }
}

async function readProjects(path: string): Promise<Project[]> {
  const snapshot = await get(query(ref(requireDb(), path), orderByChild('order')))
  const projects: Project[] = []
  snapshot.forEach((childSnapshot) => {
    projects.push(toProject(childSnapshot.key as string, childSnapshot.val()))
    return false
  })
  return projects
}

export function getProjects(): Promise<Project[]> {
  return readProjects(PATH)
}

export function getPublishedProjects(): Promise<Project[]> {
  return readProjects(PUBLIC_PATH)
}

export async function syncPublishedProjects(projects: Project[]): Promise<void> {
  const db = requireDb()
  const publicSnapshot = await get(ref(db, PUBLIC_PATH))
  if (publicSnapshot.exists()) return

  const updates: Record<string, unknown> = {}
  projects.filter((project) => project.isPublished !== false).forEach((project) => {
    const { id, ...input } = project
    updates[`${PUBLIC_PATH}/${id}`] = {
      ...toRecord(input),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  })
  if (Object.keys(updates).length) await update(ref(db), updates)
}

export async function createProject(input: ProjectInput): Promise<string> {
  const db = requireDb()
  const newRef = push(ref(db, PATH))
  const record = {
    ...toRecord(input),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  await update(ref(db), {
    [`${PATH}/${newRef.key}`]: record,
    [`${PUBLIC_PATH}/${newRef.key}`]: input.isPublished === false ? null : record,
  })
  return newRef.key as string
}

export async function updateProject(id: string, input: ProjectInput): Promise<void> {
  const record = {
    ...toRecord(input),
    updatedAt: serverTimestamp(),
  }
  await update(ref(requireDb()), {
    [`${PATH}/${id}`]: record,
    [`${PUBLIC_PATH}/${id}`]: input.isPublished === false ? null : record,
  })
}

export async function setProjectFeatured(id: string, featured: boolean): Promise<void> {
  const db = requireDb()
  const snapshot = await get(child(ref(db, PATH), id))
  if (!snapshot.exists()) throw new Error('This project no longer exists.')
  const updates: Record<string, unknown> = {
    [`${PATH}/${id}/featured`]: featured,
    [`${PATH}/${id}/updatedAt`]: serverTimestamp(),
  }
  if (snapshot.child('isPublished').val() !== false) {
    updates[`${PUBLIC_PATH}/${id}/featured`] = featured
    updates[`${PUBLIC_PATH}/${id}/updatedAt`] = serverTimestamp()
  }
  await update(ref(db), updates)
}

export async function setProjectPublished(id: string, isPublished: boolean): Promise<void> {
  const db = requireDb()
  const snapshot = await get(child(ref(db, PATH), id))
  if (!snapshot.exists()) throw new Error('This project no longer exists.')
  const record = { ...snapshot.val(), isPublished, updatedAt: serverTimestamp() }
  await update(ref(db), {
    [`${PATH}/${id}`]: record,
    [`${PUBLIC_PATH}/${id}`]: isPublished ? record : null,
  })
}

/** Rewrites `order` so the given ids appear in exactly this sequence. */
export async function reorderProjects(orderedIds: string[]): Promise<void> {
  const db = requireDb()
  const publishedSnapshot = await get(ref(db, PUBLIC_PATH))
  const publishedIds = new Set<string>()
  publishedSnapshot.forEach((childSnapshot) => {
    if (childSnapshot.key) publishedIds.add(childSnapshot.key)
    return false
  })
  const updates: Record<string, unknown> = {}
  orderedIds.forEach((id, index) => {
    updates[`${PATH}/${id}/order`] = index
    updates[`${PATH}/${id}/updatedAt`] = serverTimestamp()
    if (publishedIds.has(id)) {
      updates[`${PUBLIC_PATH}/${id}/order`] = index
      updates[`${PUBLIC_PATH}/${id}/updatedAt`] = serverTimestamp()
    }
  })
  await update(ref(db), updates)
}

/** Deletes the project node, then its cover image. */
export async function deleteProject(project: Project): Promise<void> {
  await update(ref(requireDb()), {
    [`${PATH}/${project.id}`]: null,
    [`${PUBLIC_PATH}/${project.id}`]: null,
  })
  await deleteImage(project.image.path).catch(() => {
    // The project is already gone; a leftover image is not worth failing the whole action.
  })
}

/** One-time migration of the starter projects into Realtime Database, keeping their ids. */
export async function seedProjects(seed: Omit<Project, 'order'>[]): Promise<void> {
  const updates: Record<string, unknown> = {}
  seed.forEach((project, index) => {
    const { id, ...rest } = project
    updates[`${PATH}/${id}`] = {
      ...toRecord({ ...rest, order: index }),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    if (project.isPublished !== false) updates[`${PUBLIC_PATH}/${id}`] = updates[`${PATH}/${id}`]
  })
  await update(ref(requireDb()), updates)
}

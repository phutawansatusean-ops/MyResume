import { child, get, push, ref, serverTimestamp, update } from 'firebase/database'
import { requireDb } from '../lib/firebase'
import { Activity, ActivityImage, ActivityInput } from '../types/activity'

const PATH = 'activities'
const PUBLIC_PATH = 'publishedActivities'

function toActivity(id: string, data: Record<string, unknown>): Activity {
  const rawImages = data.images
  const entries = Array.isArray(rawImages)
    ? rawImages
    : rawImages && typeof rawImages === 'object'
      ? Object.entries(rawImages as Record<string, unknown>).sort(([left], [right]) => Number(left) - Number(right)).map(([, image]) => image)
      : []
  const images: ActivityImage[] = entries.flatMap((candidate, index) => {
    if (!candidate || typeof candidate !== 'object') return []
    const image = candidate as Record<string, unknown>
    if (typeof image.url !== 'string' || !image.url) return []
    return [{ id: typeof image.id === 'string' && image.id ? image.id : `${id}-image-${index}`, url: image.url, ...(typeof image.alt === 'string' ? { alt: image.alt } : {}) }]
  })
  return {
    id,
    name: typeof data.name === 'string' ? data.name : '',
    description: typeof data.description === 'string' ? data.description : '',
    category: typeof data.category === 'string' && data.category ? data.category : undefined,
    date: typeof data.date === 'string' && data.date ? data.date : undefined,
    location: typeof data.location === 'string' && data.location ? data.location : undefined,
    role: typeof data.role === 'string' && data.role ? data.role : undefined,
    images: images.length ? images : undefined,
    imageUrl: typeof data.imageUrl === 'string' && data.imageUrl ? data.imageUrl : images[0]?.url,
    isPublished: data.isPublished !== false,
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : undefined,
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : undefined,
  }
}

function toRecord(input: ActivityInput) {
  const images = input.images ?? (input.imageUrl ? [{ id: 'legacy-image', url: input.imageUrl }] : [])
  return {
    name: input.name.trim(), description: input.description.trim(), category: input.category?.trim() ?? '',
    date: input.date?.trim() ?? '', location: input.location?.trim() ?? '', role: input.role?.trim() ?? '',
    imageUrl: images[0]?.url ?? input.imageUrl ?? '',
    images: images.length ? images.map(({ id, url, alt }) => ({ id, url, ...(alt ? { alt } : {}) })) : null,
    isPublished: input.isPublished,
  }
}

function fromSnapshot(snapshot: Awaited<ReturnType<typeof get>>): Activity[] {
  const activities: Activity[] = []
  snapshot.forEach((childSnapshot) => {
    const value = childSnapshot.val()
    if (value && typeof value === 'object') activities.push(toActivity(childSnapshot.key as string, value))
    return false
  })
  return activities
}

export async function getActivities(): Promise<Activity[]> {
  const db = requireDb()
  const snapshot = await get(ref(db, PATH))
  const activities: Activity[] = []
  const syncUpdates: Record<string, unknown> = {}
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val() as Record<string, unknown> | null
    if (!data) return false
    const activity = toActivity(childSnapshot.key as string, data)
    activities.push(activity)
    if (activity.isPublished && data.isPublished !== true) {
      syncUpdates[`${PUBLIC_PATH}/${activity.id}`] = {
        ...toRecord(activity),
        createdAt: activity.createdAt ?? null,
        updatedAt: activity.updatedAt ?? null,
        isPublished: true,
      }
    }
    return false
  })
  if (Object.keys(syncUpdates).length) await update(ref(db), syncUpdates)
  return activities.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
}

export async function getPublishedActivities(): Promise<Activity[]> {
  return fromSnapshot(await get(ref(requireDb(), PUBLIC_PATH)))
}

export async function createActivity(input: ActivityInput): Promise<string> {
  const db = requireDb()
  const newRef = push(ref(db, PATH))
  const record = { ...toRecord(input), createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
  await update(ref(db), { [`${PATH}/${newRef.key}`]: record, [`${PUBLIC_PATH}/${newRef.key}`]: input.isPublished ? record : null })
  return newRef.key as string
}

export async function updateActivity(id: string, input: ActivityInput): Promise<void> {
  const record = { ...toRecord(input), updatedAt: serverTimestamp() }
  await update(ref(requireDb()), { [`${PATH}/${id}`]: record, [`${PUBLIC_PATH}/${id}`]: input.isPublished ? record : null })
}

export async function setActivityPublished(id: string, isPublished: boolean): Promise<void> {
  const db = requireDb()
  const snapshot = await get(child(ref(db, PATH), id))
  if (!snapshot.exists()) throw new Error('This activity no longer exists.')
  const record = snapshot.val() as Record<string, unknown>
  const updatedAt = serverTimestamp()
  await update(ref(db), {
    [`${PATH}/${id}/isPublished`]: isPublished,
    [`${PATH}/${id}/updatedAt`]: updatedAt,
    [`${PUBLIC_PATH}/${id}`]: isPublished ? { ...record, isPublished: true, updatedAt } : null,
  })
}

export async function deleteActivity(id: string): Promise<void> {
  await update(ref(requireDb()), { [`${PATH}/${id}`]: null, [`${PUBLIC_PATH}/${id}`]: null })
}
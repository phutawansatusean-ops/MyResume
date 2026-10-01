export interface ActivityImage {
  id: string
  url: string
  alt?: string
}

export interface Activity {
  id: string
  name: string
  description: string
  category?: string
  date?: string
  location?: string
  role?: string
  images?: ActivityImage[]
  imageUrl?: string
  isPublished: boolean
  createdAt?: number
  updatedAt?: number
}

export type ActivityInput = Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>
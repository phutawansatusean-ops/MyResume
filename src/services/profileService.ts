import { get, ref, serverTimestamp, update } from 'firebase/database'
import { requireDb } from '../lib/firebase'
import { DEFAULT_PROFILE } from '../data/profile'
import { Profile } from '../types/profile'

const PATH = 'profile'

/** Returns null when the profile node has not been created yet. */
export async function getProfile(): Promise<Profile | null> {
  const snapshot = await get(ref(requireDb(), PATH))
  if (!snapshot.exists()) return null
  const data = snapshot.val() as Record<string, unknown>
  return {
    name: typeof data.name === 'string' ? data.name : DEFAULT_PROFILE.name,
    tagline: typeof data.tagline === 'string' ? data.tagline : DEFAULT_PROFILE.tagline,
    bio: typeof data.bio === 'string' ? data.bio : DEFAULT_PROFILE.bio,
    location: typeof data.location === 'string' ? data.location : DEFAULT_PROFILE.location,
    email: typeof data.email === 'string' ? data.email : DEFAULT_PROFILE.email,
    birthDate: typeof data.birthDate === 'string' ? data.birthDate : DEFAULT_PROFILE.birthDate,
    avatarUrl: typeof data.avatarUrl === 'string' ? data.avatarUrl : '',
    avatarPath: typeof data.avatarPath === 'string' ? data.avatarPath : '',
    about: typeof data.about === 'string' ? data.about : DEFAULT_PROFILE.about,
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  await update(ref(requireDb(), PATH), { ...profile, updatedAt: serverTimestamp() })
}

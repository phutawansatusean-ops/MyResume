import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { get, ref } from 'firebase/database'
import { requireAuth, requireDb } from '../lib/firebase'

const EMAIL_DOMAIN = (import.meta.env.VITE_ADMIN_EMAIL_DOMAIN || 'admin.phutawan-portfolio.com').trim().toLowerCase()

/** The login form asks for a username; Firebase Auth needs an email, so we derive one. */
export function usernameToEmail(username: string): string {
  const normalizedUsername = username.trim().toLowerCase()
  return normalizedUsername.includes('@') ? normalizedUsername : `${normalizedUsername}@${EMAIL_DOMAIN}`
}

/** A user is an admin only if a node exists at /admins/{uid} (created manually in the console). */
export async function checkIsAdmin(uid: string): Promise<boolean> {
  const snapshot = await get(ref(requireDb(), `admins/${uid}`))
  return snapshot.exists()
}

export async function loginWithUsername(username: string, password: string): Promise<User> {
  const auth = requireAuth()
  const email = usernameToEmail(username)
  console.info('[admin-login] Firebase sign-in email:', email)
  const credential = await signInWithEmailAndPassword(auth, email, password)
  let isAdmin: boolean
  try {
    isAdmin = await checkIsAdmin(credential.user.uid)
  } catch (error) {
    await signOut(auth)
    throw error
  }
  if (!isAdmin) {
    await signOut(auth)
    throw new Error('Authentication succeeded, but this account is not authorised as an admin.')
  }
  return credential.user
}

export function logout(): Promise<void> {
  return signOut(requireAuth())
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(requireAuth(), callback)
}

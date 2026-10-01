import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import type { Auth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import type { Database } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import type { FirebaseStorage } from 'firebase/storage'

// All values come from .env (Vite exposes only VITE_* variables). These are public
// web-app identifiers, NOT secrets; access is controlled by the security rules.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.databaseURL && firebaseConfig.projectId && firebaseConfig.appId,
)

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

const auth: Auth | null = app ? getAuth(app) : null
const db: Database | null = app ? getDatabase(app) : null
const storage: FirebaseStorage | null = app ? getStorage(app) : null

const NOT_CONFIGURED = 'Firebase is not configured. Copy .env.example to .env and fill in your Firebase web-app values.'

export function requireAuth(): Auth {
  if (!auth) throw new Error(NOT_CONFIGURED)
  return auth
}

/** Realtime Database instance. */
export function requireDb(): Database {
  if (!db) throw new Error(NOT_CONFIGURED)
  return db
}

export function requireStorage(): FirebaseStorage {
  if (!storage) throw new Error(NOT_CONFIGURED)
  return storage
}

export { auth, db, storage }

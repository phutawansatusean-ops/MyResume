/** Turns Firebase / unknown errors into short, human-readable messages. */
export function describeError(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const code = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : ''

  switch (code) {
    // Authentication
    case 'auth/invalid-credential':
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/missing-password':
      return 'Invalid username or password.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.'
    case 'auth/user-disabled':
      return 'This account has been disabled.'
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in the Firebase console.'
    case 'auth/network-request-failed':
    case 'unavailable':
    case 'storage/retry-limit-exceeded':
      return 'Network problem. Check your connection and try again.'

    // Realtime Database
    case 'PERMISSION_DENIED':
      return 'Permission denied. Make sure you are logged in as the admin and the database rules are deployed.'

    // Storage
    case 'storage/unauthorized':
      return 'Upload not allowed. Make sure you are logged in as the admin and the storage rules are deployed.'
    case 'storage/canceled':
      return 'Upload was cancelled.'
    case 'storage/quota-exceeded':
      return 'Storage quota exceeded.'
    case 'storage/unauthenticated':
      return 'Your session expired. Please log in again.'
  }

  // The Realtime Database SDK doesn't always set `.code`; it puts it at the
  // start of `.message` instead (e.g. "PERMISSION_DENIED: Permission denied").
  if (err instanceof Error && /^PERMISSION_DENIED/i.test(err.message)) {
    return 'Permission denied. Make sure you are logged in as the admin and the database rules are deployed.'
  }

  if (err instanceof Error && err.message) return err.message
  return fallback
}

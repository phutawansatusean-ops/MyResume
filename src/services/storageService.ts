import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { requireStorage } from '../lib/firebase'
import { validateImageFile } from './imageValidation'

export { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, validateImageFile } from './imageValidation'

export type UploadFolder = 'projects' | 'profile'

export interface UploadedImage {
  url: string
  path: string
}

export function uploadImage(
  file: File,
  folder: UploadFolder,
  onProgress?: (percent: number) => void,
): Promise<UploadedImage> {
  const problem = validateImageFile(file)
  if (problem) return Promise.reject(new Error(problem))

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${folder}/${Date.now()}-${safeName}`
  const storageRef = ref(requireStorage(), path)
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type })

  return new Promise<UploadedImage>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      (error) => reject(error),
      async () => {
        try {
          resolve({ url: await getDownloadURL(task.snapshot.ref), path })
        } catch (error) {
          reject(error)
        }
      },
    )
  })
}

/** Deletes a stored image. A missing file is not an error. */
export async function deleteImage(path?: string): Promise<void> {
  if (!path) return
  try {
    await deleteObject(ref(requireStorage(), path))
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : ''
    if (code !== 'storage/object-not-found') throw error
  }
}

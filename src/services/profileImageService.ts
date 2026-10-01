import { prepareImageDataUrl } from './imageDataUrlService'

export const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_PROFILE_IMAGE_DATA_URL_LENGTH = 300_000
const MAX_COMPRESSED_IMAGE_BYTES = 210 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp'])

export function validateProfileImage(file: File): string | null {
  const extension = file.name.toLowerCase().split('.').pop() ?? ''
  const typeIsAllowed = ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase())
  const missingTypeWithAllowedExtension = !file.type && ALLOWED_IMAGE_EXTENSIONS.has(extension)

  if (!typeIsAllowed && !missingTypeWithAllowedExtension) {
    return 'Unsupported file type. Choose a JPG, JPEG, PNG or WebP image.'
  }
  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    return 'Image is too large. The original file limit is 5 MB.'
  }
  return null
}

/** Resize and compress an avatar before storing it in the existing profile record. */
export async function prepareProfileImage(file: File): Promise<string> {
  const validationError = validateProfileImage(file)
  if (validationError) throw new Error(validationError)
  return prepareImageDataUrl(file, {
    qualities: [0.82, 0.72, 0.62, 0.52],
    maxDimensions: [512, 448, 384, 320],
    maxCompressedBytes: MAX_COMPRESSED_IMAGE_BYTES,
    maxDataUrlLength: MAX_PROFILE_IMAGE_DATA_URL_LENGTH,
  })
}

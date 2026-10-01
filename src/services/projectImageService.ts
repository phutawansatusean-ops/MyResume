import { prepareImageDataUrl } from './imageDataUrlService'
import { validateProfileImage } from './profileImageService'

export const MAX_PROJECT_IMAGE_DATA_URL_LENGTH = 600_000
export const MAX_PROJECT_IMAGES = 8
export const MAX_PROJECT_TOTAL_IMAGE_DATA_URL_LENGTH = MAX_PROJECT_IMAGE_DATA_URL_LENGTH * MAX_PROJECT_IMAGES
const MAX_COMPRESSED_PROJECT_IMAGE_BYTES = 400 * 1024

export const validateProjectImage = validateProfileImage

export function prepareProjectImage(file: File): Promise<string> {
  const validationError = validateProjectImage(file)
  if (validationError) return Promise.reject(new Error(validationError))

  return prepareImageDataUrl(file, {
    maxDimensions: [1024, 896, 768, 640],
    qualities: [0.84, 0.76, 0.68, 0.6],
    maxCompressedBytes: MAX_COMPRESSED_PROJECT_IMAGE_BYTES,
    maxDataUrlLength: MAX_PROJECT_IMAGE_DATA_URL_LENGTH,
  })
}

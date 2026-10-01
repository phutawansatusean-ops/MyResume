export interface ImageDataUrlOptions {
  maxDimensions: number[]
  qualities: number[]
  maxCompressedBytes: number
  maxDataUrlLength: number
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('The selected image could not be processed.'))
    }, type, quality)
  })
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('The optimized image could not be read.'))
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('The optimized image could not be read.'))
    }
    reader.readAsDataURL(blob)
  })
}

/** Resize and compress an already-validated image to a bounded data URL. */
export async function prepareImageDataUrl(file: File, options: ImageDataUrlOptions): Promise<string> {
  let image: ImageBitmap
  try {
    image = await createImageBitmap(file)
  } catch {
    throw new Error('The selected file is not a readable image.')
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    image.close()
    throw new Error('Image processing is unavailable in this browser.')
  }

  try {
    for (const maxDimension of options.maxDimensions) {
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      for (const quality of options.qualities) {
        let blob = await canvasToBlob(canvas, 'image/webp', quality)
        if (blob.type !== 'image/webp') {
          blob = await canvasToBlob(canvas, 'image/jpeg', quality)
        }
        if (blob.size > options.maxCompressedBytes) continue

        const dataUrl = await blobToDataUrl(blob)
        if (dataUrl.length <= options.maxDataUrlLength) return dataUrl
      }
    }
  } finally {
    image.close()
    canvas.width = 0
    canvas.height = 0
  }

  throw new Error('Could not compress this image enough. Choose a simpler or smaller image.')
}

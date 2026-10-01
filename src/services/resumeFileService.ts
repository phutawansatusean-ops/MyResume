export const MAX_RESUME_FILE_SIZE_BYTES = 4 * 1024 * 1024
export const MAX_RESUME_BASE64_LENGTH = Math.ceil(MAX_RESUME_FILE_SIZE_BYTES / 3) * 4

export function validateResumeFile(file: File): string | null {
  if (!file.name.toLowerCase().endsWith('.pdf')) return 'Choose a PDF file.'
  if (file.type && file.type !== 'application/pdf') return 'Only PDF files are allowed.'
  if (file.size === 0) return 'The selected PDF is empty.'
  if (file.size > MAX_RESUME_FILE_SIZE_BYTES) return 'The PDF must be 4 MiB or smaller.'
  return null
}

export async function encodeResumePdf(file: File): Promise<string> {
  const validationError = validateResumeFile(file)
  if (validationError) throw new Error(validationError)

  const header = await file.slice(0, 1024).text()
  if (!header.includes('%PDF-')) throw new Error('The selected file is not a valid PDF.')

  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }

  const fileData = btoa(binary)
  if (fileData.length > MAX_RESUME_BASE64_LENGTH) {
    throw new Error('The encoded PDF is too large to save safely.')
  }
  return fileData
}
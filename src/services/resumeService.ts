import { get, ref, serverTimestamp, set } from 'firebase/database'
import { requireDb } from '../lib/firebase'
import { Resume } from '../types/resume'
import { MAX_RESUME_BASE64_LENGTH } from './resumeFileService'

const PATH = 'resume'

export async function getResume(): Promise<Resume | null> {
  const snapshot = await get(ref(requireDb(), PATH))
  if (!snapshot.exists()) return null

  const value = snapshot.val() as Partial<Resume>
  if (
    typeof value.fileName !== 'string' ||
    typeof value.fileData !== 'string' ||
    value.fileData.length > MAX_RESUME_BASE64_LENGTH ||
    value.mimeType !== 'application/pdf'
  ) {
    throw new Error('The stored Resume is invalid.')
  }

  return {
    fileName: value.fileName,
    fileData: value.fileData,
    mimeType: 'application/pdf',
    updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : 0,
  }
}

export async function getResumeFileName(): Promise<string | null> {
  const snapshot = await get(ref(requireDb(), `${PATH}/fileName`))
  const fileName: unknown = snapshot.val()
  return typeof fileName === 'string' ? fileName : null
}

export async function saveResume(fileName: string, fileData: string): Promise<void> {
  if (!fileName || fileName.length > 255 || fileData.length > MAX_RESUME_BASE64_LENGTH) {
    throw new Error('The Resume cannot be saved because it exceeds the supported limits.')
  }

  await set(ref(requireDb(), PATH), {
    fileName,
    fileData,
    mimeType: 'application/pdf',
    updatedAt: serverTimestamp(),
  })
}
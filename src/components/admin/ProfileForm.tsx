import { FormEvent, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ImageUploader } from './ImageUploader'
import { inputClass, labelClass, primaryButtonClass } from './formStyles'
import { describeError } from '../../lib/errors'
import { saveProfile } from '../../services/profileService'
import { prepareProfileImage, validateProfileImage } from '../../services/profileImageService'
import { Profile } from '../../types/profile'
import { NotifyFn } from './types'

interface ProfileFormProps {
  profile: Profile
  onSaved: () => Promise<void>
  notify: NotifyFn
}

type SaveState = 'idle' | 'selecting' | 'preparing' | 'saving' | 'success' | 'error'

export function ProfileForm({ profile, onSaved, notify }: ProfileFormProps) {
  const [name, setName] = useState(profile.name)
  const [tagline, setTagline] = useState(profile.tagline)
  const [bio, setBio] = useState(profile.bio)
  const [location, setLocation] = useState(profile.location)
  const [email, setEmail] = useState(profile.email)
  const [birthDate, setBirthDate] = useState(profile.birthDate)
  const [about, setAbout] = useState(profile.about)

  const [file, setFile] = useState<File | null>(null)
  const [avatarRemoved, setAvatarRemoved] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [error, setError] = useState<string | null>(null)
  const submitLock = useRef(false)
  const busy = saveState === 'selecting' || saveState === 'preparing' || saveState === 'saving'

  const markEditing = () => {
    setSaveState('idle')
    setError(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitLock.current || busy) return
    setError(null)

    if (!name.trim()) {
      setError('Name is required.')
      setSaveState('error')
      return
    }
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      setSaveState('error')
      return
    }

    submitLock.current = true
    setSaveState(file ? 'preparing' : 'saving')
    try {
      let avatarUrl = profile.avatarUrl
      let avatarPath = profile.avatarPath

      if (file) {
        avatarUrl = await prepareProfileImage(file)
        avatarPath = ''
      } else if (avatarRemoved) {
        avatarUrl = ''
        avatarPath = ''
      }

      setSaveState('saving')
      await saveProfile({
        name: name.trim(),
        tagline: tagline.trim(),
        bio: bio.trim(),
        location: location.trim(),
        email: email.trim(),
        birthDate,
        avatarUrl,
        avatarPath,
        about: about.trim(),
      })

      setFile(null)
      setAvatarRemoved(false)
      await onSaved()
      setSaveState('success')
      notify('success', 'Profile saved.')
    } catch (err) {
      setError(describeError(err, 'Could not save the profile.'))
      setSaveState('error')
    } finally {
      submitLock.current = false
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-4" noValidate>
      {error && (
        <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <ImageUploader
        label="Profile photo"
        currentUrl={profile.avatarUrl || undefined}
        file={file}
        removed={avatarRemoved}
        progress={null}
        accept="image/jpeg,image/png,image/webp"
        validateFile={validateProfileImage}
        disabled={busy}
        onFileChange={(nextFile) => {
          setFile(nextFile)
          markEditing()
        }}
        onRemovedChange={(removed) => {
          setAvatarRemoved(removed)
          markEditing()
        }}
        onSelectingChange={(selecting) => setSaveState(selecting ? 'selecting' : 'idle')}
      />
      {!profile.avatarUrl && !file && (
        <p className="-mt-2 text-xs text-light-secondary dark:text-text-secondary">
          No photo uploaded yet, so the website shows the default photo.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="pr-name">Name</label>
          <input id="pr-name" className={inputClass} value={name} onChange={(e) => { setName(e.target.value); markEditing() }} disabled={busy} maxLength={120} />
        </div>
        <div>
          <label className={labelClass} htmlFor="pr-tagline">Tagline</label>
          <input id="pr-tagline" className={inputClass} value={tagline} onChange={(e) => { setTagline(e.target.value); markEditing() }} disabled={busy} maxLength={200} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="pr-bio">Bio (shown on the home hero)</label>
        <textarea id="pr-bio" className={`${inputClass} min-h-[96px] resize-y`} value={bio} onChange={(e) => { setBio(e.target.value); markEditing() }} disabled={busy} maxLength={3000} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass} htmlFor="pr-location">Location</label>
          <input id="pr-location" className={inputClass} value={location} onChange={(e) => { setLocation(e.target.value); markEditing() }} disabled={busy} />
        </div>
        <div>
          <label className={labelClass} htmlFor="pr-email">Email</label>
          <input id="pr-email" type="email" className={inputClass} value={email} onChange={(e) => { setEmail(e.target.value); markEditing() }} disabled={busy} />
        </div>
        <div>
          <label className={labelClass} htmlFor="pr-birth">Birth date</label>
          <input id="pr-birth" type="date" className={inputClass} value={birthDate} onChange={(e) => { setBirthDate(e.target.value); markEditing() }} disabled={busy} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="pr-about">About Me (separate paragraphs with a blank line)</label>
        <textarea id="pr-about" className={`${inputClass} min-h-[140px] resize-y`} value={about} onChange={(e) => { setAbout(e.target.value); markEditing() }} disabled={busy} maxLength={6000} />
      </div>
      <div>
        {saveState !== 'idle' && (
          <p role="status" aria-live="polite" className="mb-2 text-sm text-light-secondary dark:text-text-secondary">
            {saveState === 'selecting' && 'Selecting image…'}
            {saveState === 'preparing' && 'Optimizing image…'}
            {saveState === 'saving' && 'Saving profile…'}
            {saveState === 'success' && 'Profile saved.'}
            {saveState === 'error' && error}
          </p>
        )}
        <button type="submit" disabled={busy} className={primaryButtonClass}>
          {busy && <Loader2 size={14} className="animate-spin" />}
          {saveState === 'preparing' ? 'Preparing image…' : saveState === 'saving' ? 'Saving…' : 'Save profile'}
        </button>
      </div>
    </form>
  )
}

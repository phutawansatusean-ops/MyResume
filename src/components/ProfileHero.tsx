import { useState } from 'react'
import { ArrowDownRight, ArrowRight, MapPin, Mail, Cake } from 'lucide-react'
import { Modal } from './Modal'
import { ResumeDownloadButton } from './ResumeDownloadButton'
import { Profile } from '../types/profile'
import { formatBirthDate } from '../lib/format'

interface ProfileHeroProps {
  profile: Profile
  onViewProjects: () => void
  onViewActivities: () => void
}

export function ProfileHero({ profile, onViewProjects, onViewActivities }: ProfileHeroProps) {
  const avatarSrc = profile.avatarUrl || '/avatar.jpg'
  const [isPhotoOpen, setIsPhotoOpen] = useState(false)

  return (
    <section className="portfolio-panel relative overflow-hidden">
      <div className="grid min-h-[34rem] md:min-h-[35rem] md:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col justify-center px-6 py-10 md:px-10 lg:px-14">
          <p className="portfolio-eyebrow mb-5 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Software Engineering Portfolio</p>
          <h1 className="portfolio-heading max-w-3xl break-words text-5xl leading-[1.08]">{profile.name}</h1>
          <p className="mt-3 text-sm text-accent">Student · Developer · Problem Solver</p>
          <p className="mt-1 text-sm font-bold text-light-primary dark:text-text-primary">Software Engineering Student at Thammasat University</p>
          <p className="mt-5 max-w-xl text-sm leading-7 text-light-secondary dark:text-text-secondary">{profile.bio}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={onViewProjects} className="inline-flex min-h-11 items-center gap-2 bg-accent px-4 text-sm font-semibold text-[#10221c] transition-colors hover:bg-accent/85">View projects <ArrowRight size={16} /></button>
            <button type="button" onClick={onViewActivities} className="inline-flex min-h-11 items-center gap-2 border border-light-border px-4 text-sm font-semibold text-light-primary transition-colors hover:border-accent/60 dark:border-base-border dark:text-text-primary">View activities <ArrowDownRight size={16} /></button>
          </div>
          <div className="mt-7"><ResumeDownloadButton /></div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-light-border pt-5 text-xs text-light-secondary dark:border-base-border dark:text-text-secondary">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> {profile.location}</span>
            <a href={`mailto:${profile.email}`} className="portfolio-link flex items-center gap-1.5"><Mail size={14} /> {profile.email}</a>
            <span className="flex items-center gap-1.5"><Cake size={14} /> Born {formatBirthDate(profile.birthDate)}</span>
          </div>
        </div>
        <div className="relative flex min-h-[20rem] items-center justify-center overflow-hidden border-t border-light-border bg-[#e8f0eb] p-6 dark:border-base-border dark:bg-[#182622] md:min-h-0 md:border-l md:border-t-0 md:p-8">
          <div aria-hidden="true" className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(67,198,162,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(67,198,162,0.18)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute left-5 top-5 z-10 border border-light-border bg-light-card/90 px-3 py-2 font-mono text-[11px] text-light-secondary dark:border-base-border dark:bg-base-bg/90 dark:text-text-secondary">profile.tsx <span className="ml-2 text-accent">●</span></div>
        <button
          type="button"
          onClick={() => setIsPhotoOpen(true)}
          aria-label="View profile photo larger"
          className="relative z-10 flex h-full max-h-[34rem] min-h-[18rem] w-full cursor-zoom-in items-center justify-center focus-visible:outline-offset-4"
        >
          <img
            src={avatarSrc}
            alt={profile.name}
            className="block h-full max-h-[34rem] w-full object-contain transition-transform duration-300 hover:scale-[1.015]"
          />
        </button>

        </div>
      </div>

      {isPhotoOpen && (
        <Modal title={profile.name} onClose={() => setIsPhotoOpen(false)} maxWidthClassName="max-w-md">
          <img src={avatarSrc} alt={profile.name} className="block w-full" />
        </Modal>
      )}
    </section>
  )
}

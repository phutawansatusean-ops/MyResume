import { useState } from 'react'
import { MapPin, Mail, Cake } from 'lucide-react'
import { Modal } from './Modal'
import { ResumeDownloadButton } from './ResumeDownloadButton'
import { Profile } from '../types/profile'
import { formatBirthDate } from '../lib/format'

interface ProfileHeroProps {
  profile: Profile
}

export function ProfileHero({ profile }: ProfileHeroProps) {
  const avatarSrc = profile.avatarUrl || '/avatar.jpg'
  const [isPhotoOpen, setIsPhotoOpen] = useState(false)

  return (
    <section className="relative overflow-hidden rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card">
      {/* Mountain / landscape background */}
      <div className="relative h-52 md:h-64 w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 400"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D1420" />
              <stop offset="100%" stopColor="#080B10" />
            </linearGradient>
            <linearGradient id="range1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B2735" />
              <stop offset="100%" stopColor="#111720" />
            </linearGradient>
            <linearGradient id="range2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#243244" />
              <stop offset="100%" stopColor="#161F2B" />
            </linearGradient>
          </defs>
          <rect width="1200" height="400" fill="url(#sky)" />
          <path
            d="M0 260 L140 160 L260 230 L400 110 L560 240 L700 150 L860 250 L1000 130 L1200 220 L1200 400 L0 400 Z"
            fill="url(#range1)"
            opacity="0.75"
          />
          <path
            d="M0 320 L180 240 L320 300 L480 200 L640 310 L820 220 L980 300 L1200 260 L1200 400 L0 400 Z"
            fill="url(#range2)"
          />
          <circle cx="1040" cy="90" r="46" fill="#5B8DEF" opacity="0.16" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-light-card dark:from-base-card from-0% via-transparent via-60% to-transparent" />
      </div>

      {/* Avatar + identity */}
      <div className="px-6 md:px-10 pb-8 -mt-12 md:-mt-14">
        <button
          type="button"
          onClick={() => setIsPhotoOpen(true)}
          aria-label="View profile photo larger"
          className="block w-32 md:w-[19.125rem] cursor-zoom-in"
        >
          <img
            src={avatarSrc}
            alt={profile.name}
            className="block h-auto max-h-[32rem] w-full object-contain"
          />
        </button>

        <div className="mt-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-light-primary dark:text-text-primary">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm md:text-[15px] text-accent font-medium">
              {profile.tagline}
            </p>
            <p className="mt-1 text-sm md:text-[15px] text-accent font-bold">
              Software Engineering Student at Thammasat University
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-light-secondary dark:text-text-secondary">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} /> {profile.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={15} /> {profile.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Cake size={15} /> Born {formatBirthDate(profile.birthDate)}
            </span>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-light-secondary dark:text-text-secondary">
          {profile.bio}
        </p>

        <ResumeDownloadButton />
      </div>

      {isPhotoOpen && (
        <Modal title={profile.name} onClose={() => setIsPhotoOpen(false)} maxWidthClassName="max-w-md">
          <img src={avatarSrc} alt={profile.name} className="block w-full" />
        </Modal>
      )}
    </section>
  )
}

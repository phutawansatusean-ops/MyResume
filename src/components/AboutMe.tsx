import { Profile } from '../types/profile'

interface AboutMeProps {
  profile: Profile
}

export function AboutMe({ profile }: AboutMeProps) {
  const paragraphs = profile.about
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section className="max-w-4xl">
      <p className="portfolio-eyebrow">A little about me</p>
      <h1 className="portfolio-heading mb-6 mt-2 text-3xl md:text-4xl">About Me</h1>

      <div className="portfolio-panel grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_12rem] md:gap-10 md:p-9">
        <div>
        <p className="text-base leading-8 text-light-secondary dark:text-text-secondary">{profile.bio}</p>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-base leading-8 text-light-secondary dark:text-text-secondary">
            {paragraph}
          </p>
        ))}
        </div>
        <div className="border-t border-light-border pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0 dark:border-base-border">
          <p className="portfolio-eyebrow">Based in</p>
          <p className="mt-2 text-sm font-semibold text-light-primary dark:text-text-primary">{profile.location}</p>
          <p className="portfolio-eyebrow mt-6">Email</p>
          <a href={`mailto:${profile.email}`} className="portfolio-link mt-2 block break-words text-sm text-light-primary dark:text-text-primary">{profile.email}</a>
        </div>
      </div>

      <div className="mt-8">
        <p className="portfolio-eyebrow">Education</p>
        <div className="portfolio-panel mt-3 flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center md:p-6">
          <h2 className="font-display text-lg font-semibold text-light-primary dark:text-text-primary">Thammasat University</h2>
          <p className="mt-1 text-sm text-light-secondary dark:text-text-secondary">Software Engineering</p>
        </div>
      </div>
    </section>
  )
}

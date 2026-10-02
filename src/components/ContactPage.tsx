import { Mail, MapPin, Github, Linkedin } from 'lucide-react'
import { Profile } from '../types/profile'

interface ContactPageProps {
  profile: Profile
}

export function ContactPage({ profile }: ContactPageProps) {
  return (
    <section className="max-w-3xl">
      <p className="portfolio-eyebrow">Start a conversation</p>
      <h1 className="portfolio-heading mb-6 mt-2 text-3xl md:text-4xl">Contact</h1>

      <div className="portfolio-panel p-6 md:p-9">
        <p className="max-w-2xl text-base leading-8 text-light-secondary dark:text-text-secondary mb-7">
          Open to internships, collaborations, and interesting problems to work on. The best way to
          reach me is by email.
        </p>

        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <a
            href={`mailto:${profile.email}`}
            className="portfolio-link flex min-w-0 items-center gap-3 text-sm font-medium text-light-primary dark:text-text-primary"
          >
            <span className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
              <Mail size={16} className="text-accent" />
            </span>
            {profile.email}
          </a>

          <div className="flex items-center gap-3 text-sm font-medium text-light-primary dark:text-text-primary">
            <span className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-accent" />
            </span>
            {profile.location}
          </div>

          <a
            href="https://github.com/phutawansatusean-ops?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="portfolio-link flex items-center gap-3 text-sm font-medium text-light-primary dark:text-text-primary"
          >
            <span className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
              <Github size={16} className="text-accent" />
            </span>
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/phutawan-satusean-6a944a434/"
            target="_blank"
            rel="noreferrer"
            className="portfolio-link flex items-center gap-3 text-sm font-medium text-light-primary dark:text-text-primary"
          >
            <span className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
              <Linkedin size={16} className="text-accent" />
            </span>
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}

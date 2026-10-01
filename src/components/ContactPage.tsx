import { Mail, MapPin, Github, Linkedin } from 'lucide-react'
import { Profile } from '../types/profile'

interface ContactPageProps {
  profile: Profile
}

export function ContactPage({ profile }: ContactPageProps) {
  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-light-primary dark:text-text-primary mb-4">
        Contact
      </h1>

      <div className="rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card p-6">
        <p className="text-[15px] text-light-secondary dark:text-text-secondary leading-relaxed mb-5">
          Open to internships, collaborations, and interesting problems to work on. The best way to
          reach me is by email.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-3 text-sm font-medium text-light-primary dark:text-text-primary hover:text-accent transition-colors"
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
            className="flex items-center gap-3 text-sm font-medium text-light-primary dark:text-text-primary hover:text-accent transition-colors"
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
            className="flex items-center gap-3 text-sm font-medium text-light-primary dark:text-text-primary hover:text-accent transition-colors"
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

import { Code2, Cpu, Lightbulb } from 'lucide-react'
import { Profile } from '../types/profile'

const focusAreas = [
  {
    icon: Code2,
    title: 'Software Development',
    description: 'Building web and mobile applications with React, Flutter, and Python.',
  },
  {
    icon: Cpu,
    title: 'AI & Data',
    description: 'Applying machine learning and data analysis to real-world problems.',
  },
  {
    icon: Lightbulb,
    title: 'Problem Solving',
    description: 'Drawn to challenges in sustainability, health, and community impact.',
  },
]

interface AboutMeProps {
  profile: Profile
}

export function AboutMe({ profile }: AboutMeProps) {
  const paragraphs = profile.about
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-light-primary dark:text-text-primary mb-4">
        About Me
      </h1>

      <div className="rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card p-6">
        <p className="text-[15px] leading-relaxed text-light-secondary dark:text-text-secondary">{profile.bio}</p>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-3 text-[15px] leading-relaxed text-light-secondary dark:text-text-secondary">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-light-primary dark:text-text-primary mb-4">Education</h2>
        <div className="rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card p-5">
          <h3 className="text-sm font-semibold text-light-primary dark:text-text-primary">Thammasat University</h3>
          <p className="mt-1 text-sm text-light-secondary dark:text-text-secondary">Software Engineering</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-light-primary dark:text-text-primary mt-8 mb-4">
        Focus Areas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {focusAreas.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-card border border-light-border dark:border-base-border bg-light-card dark:bg-base-card p-5"
          >
            <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center mb-3">
              <Icon size={17} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold text-light-primary dark:text-text-primary mb-1">{title}</h3>
            <p className="text-sm text-light-secondary dark:text-text-secondary leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

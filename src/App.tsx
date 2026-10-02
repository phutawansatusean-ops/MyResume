import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { MobileNav } from './components/MobileNav'
import { TopBar } from './components/TopBar'
import { ProfileHero } from './components/ProfileHero'
import { FeaturedProjects } from './components/FeaturedProjects'
import { ProjectSection } from './components/ProjectSection'
import { ProjectDetailModal } from './components/ProjectDetailModal'
import { ActivitySection } from './components/ActivitySection'
import { ActivityDetailModal } from './components/ActivityDetailModal'
import { AboutMe } from './components/AboutMe'
import { ContactPage } from './components/ContactPage'
import { DataStatus } from './components/DataStatus'
import { Footer } from './components/Footer'
import { ActivityCard } from './components/ActivityCard'
import { useAuth } from './context/AuthContext'
import { usePortfolioData } from './context/PortfolioDataContext'
import { useTheme } from './hooks/useTheme'
import { Project } from './types/project'
import { Activity } from './types/activity'

export type Page = 'home' | 'works' | 'activities' | 'about' | 'contact'

/** The public portfolio. Data comes from Firebase via PortfolioDataProvider. */
export default function App() {
  const [activePage, setActivePage] = useState<Page>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const { theme, toggleTheme } = useTheme()
  const { isAdmin } = useAuth()
  const { projects, activities, profile, loading, error, activitiesError, refresh } = usePortfolioData()
  const navigate = useNavigate()
  const publishedProjects = useMemo(() => projects.filter((project) => project.isPublished !== false), [projects])
  const publishedActivities = useMemo(() => activities.filter((activity) => activity.isPublished !== false), [activities])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (value.trim() && activePage !== 'works') {
      setActivePage('works')
    }
  }

  const dataStatus =
    loading || error ? <DataStatus loading={loading} error={error} onRetry={() => void refresh()} /> : null

  return (
    <div className="min-h-screen bg-light-bg dark:bg-base-bg">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <MobileNav activePage={activePage} onNavigate={setActivePage} />

      <div className="pb-20 md:pb-0">
        <TopBar
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="px-4 py-6 md:px-8 md:py-10 max-w-6xl mx-auto flex flex-col gap-10 md:gap-14">
          {activePage === 'home' && (
            <>
              <ProfileHero profile={profile} onViewProjects={() => setActivePage('works')} onViewActivities={() => setActivePage('activities')} />
              {dataStatus ?? (
                <>
                  <FeaturedProjects projects={publishedProjects} onViewDetails={setSelectedProject} />
                  {publishedProjects.some((project) => project.technologies.length > 0) && (
                    <section aria-labelledby="stack-heading" className="border-y border-light-border py-5 dark:border-base-border">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                        <h2 id="stack-heading" className="portfolio-eyebrow shrink-0">Across my projects</h2>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                          {[...new Set(publishedProjects.flatMap((project) => project.technologies))].slice(0, 12).map((technology) => (
                            <span key={technology} className="font-mono text-xs text-light-secondary dark:text-text-secondary">{technology}</span>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}
                  {publishedActivities.length > 0 && (
                    <section aria-labelledby="activity-preview-heading">
                      <div className="mb-5 flex items-end justify-between gap-4">
                        <div><p className="portfolio-eyebrow">Beyond the screen</p><h2 id="activity-preview-heading" className="portfolio-heading mt-2 text-2xl md:text-3xl">My Activities</h2></div>
                        <button type="button" onClick={() => setActivePage('activities')} className="portfolio-link inline-flex shrink-0 items-center gap-2 text-sm font-medium text-light-primary dark:text-text-primary">View all <span aria-hidden="true">↗</span></button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {publishedActivities.slice(0, 3).map((activity) => <ActivityCard key={activity.id} activity={activity} onViewDetails={setSelectedActivity} />)}
                      </div>
                    </section>
                  )}
                  <section aria-labelledby="education-heading" className="portfolio-panel grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center md:p-7">
                    <div><p className="portfolio-eyebrow">Education</p><h2 id="education-heading" className="portfolio-heading mt-2 text-xl md:text-2xl">Thammasat University</h2><p className="mt-1 text-sm text-light-secondary dark:text-text-secondary">Software Engineering</p></div>
                    <span className="hidden font-mono text-xs text-light-secondary dark:text-text-secondary sm:block">01 / 01</span>
                  </section>
                  <section className="relative overflow-hidden bg-[#17352d] px-5 py-8 text-white dark:bg-[#142a24] md:px-9 md:py-10">
                    <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                      <div><p className="font-mono text-xs uppercase tracking-[0.12em] text-accent">Get in touch</p><h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">Have a project, internship, or collaboration in mind?</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">Reach out to discuss a project, collaboration, or opportunity.</p></div>
                      <button type="button" onClick={() => setActivePage('contact')} className="inline-flex min-h-11 shrink-0 items-center justify-center border border-white/25 px-4 text-sm font-semibold transition-colors hover:bg-white hover:text-[#17352d]">Contact me <span className="ml-2" aria-hidden="true">↗</span></button>
                    </div>
                  </section>
                </>
              )}
            </>
          )}

          {activePage === 'works' && (dataStatus ?? (
            <>
              <ProjectSection projects={publishedProjects} searchQuery={searchQuery} onViewDetails={setSelectedProject} onUploadClick={isAdmin ? () => navigate('/admin', { state: { newProject: true } }) : undefined} />
              {searchQuery.trim() && (activitiesError ? <DataStatus loading={false} error={activitiesError} onRetry={() => void refresh()} subject="activities" /> : <ActivitySection activities={publishedActivities} searchQuery={searchQuery} onViewDetails={setSelectedActivity} title="Activity search results" />)}
            </>
          ))}

          {activePage === 'activities' && (loading ? <DataStatus loading error={null} onRetry={() => void refresh()} subject="activities" /> : activitiesError ? <DataStatus loading={false} error={activitiesError} onRetry={() => void refresh()} subject="activities" /> : <ActivitySection activities={publishedActivities} searchQuery={searchQuery} onViewDetails={setSelectedActivity} onAddClick={isAdmin ? () => navigate('/admin', { state: { newActivity: true } }) : undefined} />)}

          {activePage === 'about' && <AboutMe profile={profile} />}
          {activePage === 'contact' && <ContactPage profile={profile} />}

          <Footer />
        </main>
      </div>

      {selectedProject && (
        <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
      {selectedActivity && <ActivityDetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}
    </div>
  )
}

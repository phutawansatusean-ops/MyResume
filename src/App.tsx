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

      <div className="md:pl-[76px] lg:pl-[232px] pb-20 md:pb-0">
        <TopBar
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="px-4 md:px-8 py-6 md:py-8 max-w-6xl mx-auto flex flex-col gap-8">
          {activePage === 'home' && (
            <>
              <ProfileHero profile={profile} />
              {dataStatus ?? <FeaturedProjects projects={publishedProjects} onViewDetails={setSelectedProject} />}
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

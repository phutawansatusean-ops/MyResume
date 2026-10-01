import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isFirebaseConfigured } from '../lib/firebase'
import { describeError } from '../lib/errors'
import { DEFAULT_PROFILE } from '../data/profile'
import { initialProjects } from '../data/projects'
import { getProjects } from '../services/projectService'
import { getPublishedActivities } from '../services/activityService'
import { getProfile } from '../services/profileService'
import { Profile } from '../types/profile'
import { Project } from '../types/project'
import { Activity } from '../types/activity'

interface PortfolioDataValue {
  projects: Project[]
  activities: Activity[]
  profile: Profile
  loading: boolean
  error: string | null
  activitiesError: string | null
  /** True when Firebase env variables are missing and the bundled starter data is shown instead. */
  usingFallback: boolean
  refresh: () => Promise<void>
}

const PortfolioDataContext = createContext<PortfolioDataValue | null>(null)

const fallbackProjects: Project[] = initialProjects.map((project, index) => ({ ...project, order: index }))

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activitiesError, setActivitiesError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setProjects(fallbackProjects)
      setActivities([])
      setProfile(DEFAULT_PROFILE)
      setError(null)
      setActivitiesError(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    setActivitiesError(null)
    const [portfolioResult, activitiesResult] = await Promise.allSettled([
      Promise.all([getProjects(), getProfile()]),
      getPublishedActivities(),
    ])
    if (portfolioResult.status === 'fulfilled') {
      const [loadedProjects, loadedProfile] = portfolioResult.value
      setProjects(loadedProjects)
      setProfile(loadedProfile ?? DEFAULT_PROFILE)
    } else {
      setError(describeError(portfolioResult.reason, 'Could not load portfolio data.'))
    }
    if (activitiesResult.status === 'fulfilled') {
      setActivities(activitiesResult.value)
    } else {
      setActivities([])
      setActivitiesError(describeError(activitiesResult.reason, 'Could not load Activities.'))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ projects, activities, profile, loading, error, activitiesError, usingFallback: !isFirebaseConfigured, refresh }),
    [projects, activities, profile, loading, error, activitiesError, refresh],
  )

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>
}

export function usePortfolioData(): PortfolioDataValue {
  const context = useContext(PortfolioDataContext)
  if (!context) throw new Error('usePortfolioData must be used inside <PortfolioDataProvider>')
  return context
}

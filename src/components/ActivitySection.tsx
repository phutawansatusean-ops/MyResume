import { useMemo, useState } from 'react'
import { Plus, SearchX } from 'lucide-react'
import { Activity } from '../types/activity'
import { ActivityCard } from './ActivityCard'

interface ActivitySectionProps {
  activities: Activity[]
  searchQuery: string
  onViewDetails: (activity: Activity) => void
  onAddClick?: () => void
  title?: string
}

export function ActivitySection({ activities, searchQuery, onViewDetails, onAddClick, title = 'My Activities' }: ActivitySectionProps) {
  const [category, setCategory] = useState('All')
  const categories = useMemo(() => [...new Set(activities.map((activity) => activity.category).filter((value): value is string => Boolean(value)))].sort(), [activities])
  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return activities.filter((activity) => {
      if (category !== 'All' && activity.category !== category) return false
      if (!query) return true
      return [activity.name, activity.description, activity.category, activity.location, activity.role].filter(Boolean).join(' ').toLowerCase().includes(query)
    })
  }, [activities, category, searchQuery])

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-light-primary dark:text-text-primary">{title}</h2>
        {onAddClick && <button type="button" onClick={onAddClick} className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"><Plus size={16} /> Add Activity</button>}
      </div>
      {categories.length > 0 && <div className="mb-5 flex flex-wrap gap-2" aria-label="Filter activities by category">
        {['All', ...categories].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${category === item ? 'border-accent bg-accent/10 text-accent' : 'border-light-border text-light-secondary hover:border-accent/40 dark:border-base-border dark:text-text-secondary'}`}>{item}</button>)}
      </div>}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-light-border py-16 text-center dark:border-base-border">
          <SearchX size={28} className="mb-3 text-light-secondary dark:text-text-secondary" />
          <p className="text-sm font-medium text-light-primary dark:text-text-primary">{activities.length === 0 ? 'No activities yet' : 'No activities match'}</p>
          <p className="mt-1 text-sm text-light-secondary dark:text-text-secondary">{activities.length === 0 ? 'Check back soon.' : 'Try a different keyword or category.'}</p>
        </div>
      ) : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((activity) => <ActivityCard key={activity.id} activity={activity} onViewDetails={onViewDetails} />)}</div>}
    </section>
  )
}
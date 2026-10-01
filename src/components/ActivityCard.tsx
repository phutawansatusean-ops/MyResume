import { CalendarDays, Image as ImageIcon, MapPin } from 'lucide-react'
import { Activity } from '../types/activity'

export function ActivityCard({ activity, onViewDetails }: { activity: Activity; onViewDetails: (activity: Activity) => void }) {
  const cover = activity.images?.[0]?.url ?? activity.imageUrl
  return (
    <button type="button" onClick={() => onViewDetails(activity)} className="group overflow-hidden rounded-card border border-light-border bg-light-card text-left transition-colors hover:border-accent/50 dark:border-base-border dark:bg-base-card">
      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-light-bg dark:bg-base-bg">
        {cover ? <img src={cover} alt={activity.images?.[0]?.alt ?? activity.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" /> : <ImageIcon size={28} className="text-light-secondary/60 dark:text-text-secondary/60" aria-hidden="true" />}
      </div>
      <div className="p-4">
        {activity.category && <p className="mb-1 text-xs font-medium text-accent">{activity.category}</p>}
        <h3 className="truncate text-[15px] font-semibold text-light-primary dark:text-text-primary">{activity.name}</h3>
        {activity.description && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-light-secondary dark:text-text-secondary">{activity.description}</p>}
        {(activity.date || activity.location) && <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-light-secondary dark:text-text-secondary">
          {activity.date && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{activity.date}</span>}
          {activity.location && <span className="inline-flex items-center gap-1"><MapPin size={13} />{activity.location}</span>}
        </div>}
      </div>
    </button>
  )
}
import { CalendarDays, MapPin, UserRound } from 'lucide-react'
import { Modal } from './Modal'
import { Activity } from '../types/activity'
import { ActivityGallery } from './ActivityGallery'

export function ActivityDetailModal({ activity, onClose }: { activity: Activity; onClose: () => void }) {
  const metadata = [
    activity.date ? { label: 'Date', value: activity.date, icon: CalendarDays } : null,
    activity.location ? { label: 'Location', value: activity.location, icon: MapPin } : null,
    activity.role ? { label: 'Role', value: activity.role, icon: UserRound } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null)
  return <Modal title={activity.name || 'Activity'} onClose={onClose} maxWidthClassName="max-w-2xl">
    <div className="flex flex-col gap-5">
      <ActivityGallery activity={activity} />
      {activity.category && <span className="w-fit rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">{activity.category}</span>}
      {activity.description && <p className="text-sm leading-relaxed text-light-secondary dark:text-text-secondary">{activity.description}</p>}
      {metadata.length > 0 && <dl className="grid grid-cols-1 gap-3 border-t border-light-border pt-4 dark:border-base-border sm:grid-cols-2">{metadata.map(({ label, value, icon: Icon }) => <div key={label}><dt className="mb-1 flex items-center gap-1.5 text-xs font-medium text-light-secondary dark:text-text-secondary"><Icon size={14} />{label}</dt><dd className="text-sm text-light-primary dark:text-text-primary">{value}</dd></div>)}</dl>}
    </div>
  </Modal>
}
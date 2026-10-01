import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { Activity } from '../types/activity'

export function ActivityGallery({ activity }: { activity: Activity }) {
  const images = activity.images?.length ? activity.images : activity.imageUrl ? [{ id: `${activity.id}-legacy`, url: activity.imageUrl }] : []
  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => setActiveIndex(0), [activity.id])
  if (images.length === 0) return <div className="-mt-1 flex h-44 items-center justify-center rounded-lg bg-light-bg dark:bg-base-bg md:h-56"><ImageIcon size={30} className="text-light-secondary/60 dark:text-text-secondary/60" /></div>
  if (images.length === 1) return <div className="-mt-1 flex h-44 items-center justify-center overflow-hidden rounded-lg bg-black/10 md:h-56"><img src={images[0].url} alt={images[0].alt ?? activity.name} className="h-full w-full object-contain" /></div>
  const activeImage = images[activeIndex] ?? images[0]
  const previous = () => setActiveIndex((index) => (index - 1 + images.length) % images.length)
  const next = () => setActiveIndex((index) => (index + 1) % images.length)
  return <div className="-mt-1 flex flex-col gap-3">
    <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-lg bg-black/10 md:h-72">
      <img src={activeImage.url} alt={activeImage.alt ?? `${activity.name}, image ${activeIndex + 1} of ${images.length}`} className="h-full w-full object-contain" />
      <button type="button" onClick={previous} aria-label="Previous activity image" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2 text-white hover:bg-black/80"><ChevronLeft size={18} /></button>
      <button type="button" onClick={next} aria-label="Next activity image" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2 text-white hover:bg-black/80"><ChevronRight size={18} /></button>
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white">{activeIndex + 1} / {images.length}</span>
    </div>
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="Activity image thumbnails">
      {images.map((image, index) => <button key={image.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show image ${index + 1}`} aria-pressed={activeIndex === index} className={`aspect-video overflow-hidden rounded-md border-2 bg-black/10 ${activeIndex === index ? 'border-accent' : 'border-transparent hover:border-light-border dark:hover:border-base-border'}`}><img src={image.url} alt="" className="h-full w-full object-cover" /></button>)}
    </div>
  </div>
}
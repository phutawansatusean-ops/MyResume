import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getProjectImages } from '../lib/projectImages'
import { Project } from '../types/project'
import { ProjectCover } from './ProjectCover'

export function ProjectGallery({ project }: { project: Project }) {
  const images = getProjectImages(project)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => setActiveIndex(0), [project.id])

  if (images.length <= 1) {
    return <ProjectCover project={project} className="h-44 md:h-56 w-full rounded-lg -mt-1" />
  }

  const activeImage = images[activeIndex] ?? images[0]
  const showPrevious = () => setActiveIndex((index) => (index - 1 + images.length) % images.length)
  const showNext = () => setActiveIndex((index) => (index + 1) % images.length)

  return (
    <div className="-mt-1 flex flex-col gap-3">
      <div className="relative flex h-44 md:h-72 items-center justify-center overflow-hidden rounded-lg bg-black/20">
        <img
          src={activeImage.url}
          alt={activeImage.alt ?? `${project.title}, image ${activeIndex + 1} of ${images.length}`}
          className="h-full w-full object-contain"
        />
        <button type="button" onClick={showPrevious} aria-label="Previous project image" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2 text-white hover:bg-black/80">
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={showNext} aria-label="Next project image" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2 text-white hover:bg-black/80">
          <ChevronRight size={18} />
        </button>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2" aria-label="Project image thumbnails">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show image ${index + 1}`}
            aria-pressed={activeIndex === index}
            className={`aspect-video overflow-hidden rounded-md border-2 bg-black/20 ${activeIndex === index ? 'border-accent' : 'border-transparent hover:border-light-border dark:hover:border-base-border'}`}
          >
            <img src={image.url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
import { CalendarDays, FolderKanban, Home, Mail, User } from 'lucide-react'
import type { Page } from '../App'

export const navigationItems: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'works', label: 'My Works', icon: FolderKanban },
  { id: 'activities', label: 'My Activities', icon: CalendarDays },
  { id: 'about', label: 'About Me', icon: User },
  { id: 'contact', label: 'Contact', icon: Mail },
]

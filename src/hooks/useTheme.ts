import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('portfolio-theme', 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}

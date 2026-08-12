import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { WorldId, World, getWorld, applyWorld, DEFAULT_WORLD, WORLD_LIST } from '../../theme/worlds'

interface ThemeContextType {
  /** Current world id (also the legacy `theme` value) */
  theme: WorldId
  world: World
  worlds: World[]
  setTheme: (theme: WorldId) => void
  /** True the very first time a child opens the app (no world chosen yet) */
  hasChosenWorld: boolean
  markWorldChosen: () => void
  /** Dark mode is now baked into each world; kept for backwards compatibility */
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

const STORAGE_KEY = 'world'
const CHOSEN_KEY = 'worldChosen'

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<WorldId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    // migrate any old theme value; unknown values fall back to default
    return getWorld(saved).id
  })

  const [hasChosenWorld, setHasChosenWorld] = useState<boolean>(() => {
    return localStorage.getItem(CHOSEN_KEY) === 'true'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme)
    applyWorld(theme)
  }, [theme])

  const setTheme = (newTheme: WorldId) => {
    setThemeState(getWorld(newTheme).id)
  }

  const markWorldChosen = () => {
    localStorage.setItem(CHOSEN_KEY, 'true')
    setHasChosenWorld(true)
  }

  const world = getWorld(theme)

  return (
    <ThemeContext.Provider
      value={{
        theme,
        world,
        worlds: WORLD_LIST,
        setTheme,
        hasChosenWorld,
        markWorldChosen,
        isDarkMode: world.dark,
        toggleDarkMode: () => {
          // Dark/light is part of the chosen world now. Kept as a no-op-ish
          // helper: jump to the Cosmic (dark) world or back to the bee world.
          setTheme(world.dark ? DEFAULT_WORLD : 'space')
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LearningFlowController } from '../../services/progress/LearningFlow'

interface ProgressContextType {
  learningFlow: LearningFlowController
  refreshProgress: () => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider')
  }
  return context
}

interface ProgressProviderProps {
  children: ReactNode
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [learningFlow] = useState(() => new LearningFlowController())
  const [, setTick] = useState(0)

  useEffect(() => {
    const handleUpdate = () => {
      learningFlow.refreshProgress()
      setTick(tick => tick + 1)
    }

    window.addEventListener('learningProgressUpdated', handleUpdate)
    return () => window.removeEventListener('learningProgressUpdated', handleUpdate)
  }, [learningFlow])

  const refreshProgress = () => {
    setTick(tick => tick + 1)
  }

  return (
    <ProgressContext.Provider value={{ learningFlow, refreshProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}

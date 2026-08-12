import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'

interface AudioContextType {
  isAudioEnabled: boolean
  toggleAudio: () => void
  speak: (text: string, options?: any) => Promise<void>
  stopSpeaking: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}

interface AudioProviderProps {
  children: ReactNode
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('audioEnabled')
    return saved ? JSON.parse(saved) : true
  })

  const { speak: speechSpeak, stop } = useSpeechSynthesis()

  useEffect(() => {
    localStorage.setItem('audioEnabled', JSON.stringify(isAudioEnabled))
  }, [isAudioEnabled])

  const toggleAudio = () => {
    setIsAudioEnabled((prev: any) => !prev)
  }

  const speak = async (text: string, options?: any) => {
    if (isAudioEnabled && window.speechSynthesis) {
      // Never let speech hiccups bubble up as unhandled rejections.
      try {
        await speechSpeak(text, options)
      } catch {
        /* ignore — speech is a nice-to-have, not critical */
      }
    }
  }

  const stopSpeaking = () => {
    stop()
  }

  return (
    <AudioContext.Provider value={{
      isAudioEnabled,
      toggleAudio,
      speak,
      stopSpeaking
    }}>
      {children}
    </AudioContext.Provider>
  )
}

import { useState, useEffect, useCallback } from 'react'

interface SpeechOptions {
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice
}

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
    }

    loadVoices()

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    return new Promise<void>((resolve, reject) => {
      if (!window.speechSynthesis) {
        setError('Speech synthesis not supported')
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Set options
      utterance.rate = options.rate || 0.8 // Slower for kids
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume || 1.0

      // Try to find a child-friendly voice
      if (options.voice) {
        utterance.voice = options.voice
      } else {
        const childVoice = voices.find(v =>
          v.name.includes('Child') ||
          v.name.includes('Kids') ||
          v.name.includes('Samantha') // Common friendly voice
        )
        if (childVoice) {
          utterance.voice = childVoice
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true)
        setError(null)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        resolve()
      }

      utterance.onerror = (event) => {
        setIsSpeaking(false)
        // "interrupted"/"canceled" happen every time we start a new utterance
        // while another is speaking — that's expected, not a failure. Resolving
        // avoids a flood of "Uncaught (in promise)" rejections from callers.
        if (event.error === 'interrupted' || event.error === 'canceled') {
          resolve()
          return
        }
        setError('Speech synthesis failed')
        reject(event.error)
      }

      window.speechSynthesis.speak(utterance)
    })
  }, [voices])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    setIsSpeaking(false)
  }, [])

  const resume = useCallback(() => {
    window.speechSynthesis.resume()
    setIsSpeaking(true)
  }, [])

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    voices,
    error
  }
}

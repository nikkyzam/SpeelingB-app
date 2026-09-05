import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Spell-by-speaking.
 *
 * Lets a child spell a word out loud — "C... A... T!" — instead of typing,
 * just like a real spelling bee. Built on the browser's SpeechRecognition;
 * when the browser doesn't support it, `supported` is false and callers
 * simply hide the microphone.
 */

interface SpeechRecognitionResultLite {
  transcript: string
  isFinal: boolean
}

interface UseSpeechRecognition {
  supported: boolean
  listening: boolean
  /** latest final transcript, cleaned up */
  transcript: string | null
  start: () => void
  stop: () => void
  reset: () => void
}

/** Turn "C. A. T." / "c a t" / "cat" into "cat". */
export const parseSpelling = (raw: string): string => {
  const cleaned = raw.toLowerCase().replace(/[.,!?]/g, ' ').trim()
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  // Letter-by-letter spelling: every part is a single character.
  if (parts.every((p) => p.length === 1)) return parts.join('')
  // A whole word (or a phrase — take the last word, "the word is cat" → "cat").
  return parts[parts.length - 1]
}

export const useSpeechRecognition = (): UseSpeechRecognition => {
  const [supported] = useState(() => {
    if (typeof window === 'undefined') return false
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition
  })
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const recogRef = useRef<any>(null)

  useEffect(() => () => {
    try { recogRef.current?.stop() } catch { /* already stopped */ }
  }, [])

  const start = useCallback(() => {
    if (!supported) return
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recog = new Ctor()
    recog.lang = 'en-US'
    recog.interimResults = false
    recog.maxAlternatives = 1

    recog.onresult = (event: any) => {
      const results: SpeechRecognitionResultLite[] = []
      for (let i = 0; i < event.results.length; i++) {
        results.push({
          transcript: event.results[i][0].transcript,
          isFinal: event.results[i].isFinal,
        })
      }
      const final = results.find((r) => r.isFinal) || results[results.length - 1]
      if (final) setTranscript(final.transcript)
    }
    recog.onend = () => setListening(false)
    recog.onerror = () => setListening(false)

    recogRef.current = recog
    setTranscript(null)
    setListening(true)
    try {
      recog.start()
    } catch {
      setListening(false)
    }
  }, [supported])

  const stop = useCallback(() => {
    try { recogRef.current?.stop() } catch { /* ignore */ }
    setListening(false)
  }, [])

  const reset = useCallback(() => setTranscript(null), [])

  return { supported, listening, transcript, start, stop, reset }
}

export default useSpeechRecognition

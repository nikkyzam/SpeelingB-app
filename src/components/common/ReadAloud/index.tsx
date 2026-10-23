import React, { useEffect, useRef } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { usePreferences } from '../../../hooks/usePreferences'

export default function ReadAloud({ text, label = 'Hear the instructions' }: { text: string; label?: string }) {
  const { speak } = useAudio()
  const [prefs] = usePreferences()
  const read = useRef(speak)
  read.current = speak
  useEffect(() => { if (prefs.readPrompts || prefs.stage === 'early') void read.current(text) }, [text, prefs.readPrompts, prefs.stage])
  return <button type="button" className="read-aloud-button" onClick={() => speak(text)} aria-label={label}>🔊 {label}</button>
}

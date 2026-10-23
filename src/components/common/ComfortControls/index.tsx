import React from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { usePreferences } from '../../../hooks/usePreferences'

export default function ComfortControls({ compact = false }: { compact?: boolean }) {
  const audio = useAudio()
  const [prefs, set] = usePreferences()
  return <div className={`comfort-controls ${compact ? 'compact' : ''}`} aria-label="Sound and pace">
    <button className="comfort-button" aria-pressed={audio.isAudioEnabled} onClick={audio.toggleAudio}>
      {audio.isAudioEnabled ? '🔊 Voice on' : '🔇 Voice off'}
    </button>
    <button className="comfort-button" aria-pressed={prefs.effectsEnabled && !prefs.calm} onClick={() => set({ effectsEnabled: !prefs.effectsEnabled, calm: false })}>
      {prefs.effectsEnabled && !prefs.calm ? '🎵 Sounds on' : '🎵 Sounds off'}
    </button>
    <button className="comfort-button" onClick={audio.stopSpeaking}>■ Stop voice</button>
    {!compact && <>
      <label>Reading speed<select value={prefs.narrationRate} onChange={e => set({ narrationRate: Number(e.target.value) })}>
        <option value={0.6}>Slower</option><option value={0.8}>Steady</option><option value={1}>Faster</option>
      </select></label>
      <label><input type="checkbox" checked={prefs.calm} onChange={e => set({ calm: e.target.checked })} /> Calm celebrations</label>
      <label><input type="checkbox" checked={prefs.waitForMe} onChange={e => set({ waitForMe: e.target.checked })} /> Wait for me in lessons and quizzes</label>
      <label><input type="checkbox" checked={prefs.relaxed} onChange={e => set({ relaxed: e.target.checked })} /> Relaxed games with no countdown</label>
      <label><input type="checkbox" checked={prefs.readPrompts} onChange={e => set({ readPrompts: e.target.checked })} /> Read new instructions aloud</label>
    </>}
    {audio.speechError && <p role="status">Read aloud is unavailable. You can keep using the words and buttons on screen.</p>}
  </div>
}

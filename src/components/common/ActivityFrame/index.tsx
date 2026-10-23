import React, { useEffect, useRef, useState } from 'react'
import { activityClock } from '../../../services/games/activityClock'
import { useAudio } from '../../../contexts/AudioContext'
import Dialog from '../Dialog'
import ReadAloud from '../ReadAloud'
import PracticeExample from '../PracticeExample'

export default function ActivityFrame({ children, onExit, instructions, example = 'letters' }: { children: React.ReactNode; onExit: () => void; instructions?: string; example?: 'letters' | 'choice' | 'math' }) {
  const [paused, setPaused] = useState(false)
  const [help, setHelp] = useState(false)
  const { stopSpeaking } = useAudio()
  const stop = useRef(stopSpeaking)
  stop.current = stopSpeaking
  useEffect(() => {
    activityClock.setPaused(paused)
    if (paused) stop.current()
  }, [paused])
  useEffect(() => {
    const hide = () => { if (document.visibilityState === 'hidden') { activityClock.setPaused(true); setPaused(true) } }
    document.addEventListener('visibilitychange', hide)
    return () => { document.removeEventListener('visibilitychange', hide); activityClock.setPaused(false); stop.current() }
  }, [])
  return <>
    <button className="comfort-button activity-pause" onClick={() => { activityClock.setPaused(true); setPaused(true) }}>⏸ Pause</button>
    {instructions && <button className="comfort-button" onClick={() => { activityClock.setPaused(true); setHelp(true); setPaused(true) }}>How to play · try an example</button>}
    <div className={paused ? 'activity-paused' : ''}>{children}</div>
    {paused && <Dialog title="Take a break" onClose={() => { setHelp(false); setPaused(false) }}>
      <h2>{help ? 'Let’s try it together' : 'Take a break'}</h2><p>Your game is waiting. Nothing is counting down.</p>
      {help && instructions && <><p>{instructions}</p><ReadAloud text={instructions} /><PracticeExample kind={example} /></>}
      <button className="btn" onClick={() => { setHelp(false); setPaused(false) }}>Keep playing</button>
      <button className="comfort-button" onClick={onExit}>Done for now</button>
    </Dialog>}
  </>
}

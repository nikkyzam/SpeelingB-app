import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../../../contexts/ThemeContext'
import { useAudio } from '../../../contexts/AudioContext'
import { useProgress } from '../../../contexts/ProgressContext'
import WordMastery, { MASTERY_EVENT } from '../../../services/progress/WordMastery'
import BuddyService, { BUDDY_EVENT, stageForLevel } from '../../../services/buddy/BuddyService'
import { itemById } from '../../../services/buddy/wardrobe'
import { buddyVoiceOptions, reactionFor } from '../../../services/buddy/personality'
import sfx from '../../games/shared/sfx'
import './BuddyCompanion.css'

/** Don't chatter more than once per this many ms. */
const CHATTER_GAP = 12_000

/**
 * The buddy, everywhere.
 *
 * BuddyCard is where the child cares for their buddy; this little companion is
 * the buddy coming along for the rest of the app — cheering from the corner
 * when a word lands, dancing when stars arrive, and always up for a poke.
 * It stays off the Home page, where the full BuddyCard already lives.
 */
const BuddyCompanion: React.FC = () => {
  const location = useLocation()
  const { world } = useTheme()
  const { speak } = useAudio()
  const { learningFlow } = useProgress()

  const [tick, setTick] = useState(0)
  const [bubble, setBubble] = useState<string | null>(null)
  const [anim, setAnim] = useState<'' | 'bounce' | 'dance'>('')
  const bubbleTimer = useRef<number | null>(null)
  const lastChatter = useRef(0)

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    window.addEventListener(BUDDY_EVENT, bump)
    window.addEventListener(MASTERY_EVENT, bump)
    return () => {
      window.removeEventListener(BUDDY_EVENT, bump)
      window.removeEventListener(MASTERY_EVENT, bump)
    }
  }, [])

  useEffect(() => () => { if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current) }, [])

  const buddy = useMemo(() => BuddyService.get(), [tick])
  const level = useMemo(
    () => WordMastery.level(learningFlow.getWordsLearnedTotal(), learningFlow.getWordsSpelledTotal()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [learningFlow, tick]
  )
  const stage = stageForLevel(level.level)
  const hat = buddy.equipped.hat ? itemById(buddy.equipped.hat) : undefined

  // The companion renders nothing on Home (the full BuddyCard lives there) and
  // before the buddy is named. Effects still run when a component returns null,
  // so every one of them has to check this too — otherwise the buddy talks out
  // loud with nothing on screen.
  const hidden = location.pathname === '/' || !buddy.name

  const say = (text: string, force = false) => {
    if (hidden) return
    const now = Date.now()
    if (!force && now - lastChatter.current < CHATTER_GAP) return
    lastChatter.current = now
    setBubble(text)
    speak(text, buddyVoiceOptions(buddy.name))
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current)
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 4500)
  }

  const animTimer = useRef<number | null>(null)
  const wiggle = (kind: 'bounce' | 'dance') => {
    setAnim(kind)
    if (animTimer.current) window.clearTimeout(animTimer.current)
    animTimer.current = window.setTimeout(() => setAnim(''), kind === 'dance' ? 1600 : 700)
  }
  useEffect(() => () => { if (animTimer.current) window.clearTimeout(animTimer.current) }, [])

  // Cheer when learning happens; dance when stars arrive.
  useEffect(() => {
    const onMastery = () => {
      if (hidden) return
      wiggle('bounce')
      say(reactionFor(buddy.name, Math.random() < 0.5 ? 'wordLearned' : 'wordSpelled'))
    }
    const onStars = () => {
      if (hidden) return
      wiggle('dance')
      say(reactionFor(buddy.name, 'stars'))
    }
    window.addEventListener(MASTERY_EVENT, onMastery)
    window.addEventListener('pointsEarned', onStars)
    return () => {
      window.removeEventListener(MASTERY_EVENT, onMastery)
      window.removeEventListener('pointsEarned', onStars)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buddy.name, hidden])

  // A hello when the child wanders to a new part of the app (occasionally).
  useEffect(() => {
    if (hidden) return
    if (Math.random() < 0.35) say(reactionFor(buddy.name, 'greeting'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, hidden])

  const poke = () => {
    BuddyService.play()
    sfx.pop()
    wiggle('bounce')
    const text = Math.random() < 0.3 ? BuddyService.joke() : BuddyService.cheer()
    say(text, true)
  }

  if (hidden || !buddy.name) return null

  return (
    <div className="buddy-companion" data-world={world.id}>
      {bubble && <div className="companion-bubble" role="status">{bubble}</div>}
      <button
        className={`companion-creature ${anim}`}
        onClick={poke}
        aria-label={`Say hello to ${buddy.name}`}
        title={buddy.name}
      >
        {hat && <span className="companion-hat" aria-hidden>{hat.emoji}</span>}
        <span className="companion-emoji" aria-hidden>{stage.emoji || world.mascot}</span>
      </button>
    </div>
  )
}

export default BuddyCompanion

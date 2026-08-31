import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import { useProgress } from '../../../contexts/ProgressContext'
import { useAudio } from '../../../contexts/AudioContext'
import WordMastery, { MASTERY_EVENT } from '../../../services/progress/WordMastery'
import BuddyService, { BUDDY_EVENT, stageForLevel } from '../../../services/buddy/BuddyService'
import { itemById } from '../../../services/buddy/wardrobe'
import Wardrobe from '../Wardrobe'
import sfx from '../../games/shared/sfx'
import './BuddyCard.css'

/**
 * The buddy lives here: hatched from an egg, grown by learning, fed by hand.
 *
 * Everything it says is encouragement or nonsense — never a reminder, never a
 * guilt trip. It is the friend in the app, not the taskmaster.
 */
const BuddyCard: React.FC = () => {
  const { world } = useTheme()
  const { learningFlow } = useProgress()
  const { speak } = useAudio()

  const [tick, setTick] = useState(0)
  const [bubble, setBubble] = useState<string | null>(null)
  const [animation, setAnimation] = useState<'' | 'bounce' | 'eat' | 'evolve'>('')
  const [naming, setNaming] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [evolved, setEvolved] = useState<string | null>(null)
  const [dressing, setDressing] = useState(false)
  const bubbleTimer = useRef<number | null>(null)

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    window.addEventListener(BUDDY_EVENT, bump)
    window.addEventListener(MASTERY_EVENT, bump)
    window.addEventListener('learningProgressUpdated', bump)
    return () => {
      window.removeEventListener(BUDDY_EVENT, bump)
      window.removeEventListener(MASTERY_EVENT, bump)
      window.removeEventListener('learningProgressUpdated', bump)
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
  const name = buddy.name || 'your buddy'

  // What the buddy is wearing right now, bought with real stars.
  const hat = buddy.equipped.hat ? itemById(buddy.equipped.hat) : undefined
  const face = buddy.equipped.face ? itemById(buddy.equipped.face) : undefined
  const held = buddy.equipped.held ? itemById(buddy.equipped.held) : undefined
  const aura = buddy.equipped.aura ? itemById(buddy.equipped.aura) : undefined

  // A new stage is a big deal — but only the first time it happens.
  useEffect(() => {
    if (!BuddyService.shouldCelebrate(stage.index)) return
    BuddyService.markCelebrated(stage.index)
    // The very first stage is just "here is your egg", not an evolution party.
    if (stage.index > 0) {
      setEvolved(stage.label)
      setAnimation('evolve')
      sfx.fanfare()
      window.dispatchEvent(new Event('show-confetti'))
      window.setTimeout(() => { setEvolved(null); setAnimation('') }, 4200)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.index])

  // Coming back after a while should feel like being missed, not like being
  // told off for leaving. This is the only thing the buddy says unprompted.
  useEffect(() => {
    const away = BuddyService.daysAway()
    const current = BuddyService.get()
    if (!current.name || away < 1) return
    const greeting = away === 1
      ? `You came back! I missed you!`
      : `${away} whole days! I saved you a hug.`
    BuddyService.play()
    setBubble(greeting)
    speak(greeting)
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 6000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const say = (text: string) => {
    setBubble(text)
    speak(text)
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current)
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 5200)
  }

  const poke = () => {
    if (!buddy.name) { setNaming(true); return }
    BuddyService.play()
    sfx.pop()
    setAnimation('bounce')
    window.setTimeout(() => setAnimation(''), 600)
    // Mostly encouragement, occasionally a terrible joke.
    say(Math.random() < 0.25 ? BuddyService.joke() : BuddyService.cheer())
  }

  const feed = () => {
    if (buddy.snacks <= 0) return
    BuddyService.feed()
    sfx.star()
    setAnimation('eat')
    window.setTimeout(() => setAnimation(''), 900)
    say('Yum! Thank you!')
  }

  const saveName = () => {
    const chosen = draftName.trim()
    if (!chosen) return
    BuddyService.name(chosen)
    setNaming(false)
    sfx.win()
    say(`Hi! I am ${chosen}. Nice to meet you!`)
  }

  const toNextStage = level.next
    ? `${level.next.at - level.xp} XP until ${buddy.name ? `${buddy.name} grows` : 'the next stage'}`
    : `${name} is fully grown — legendary!`

  return (
    <section className={`buddy-card ${animation}`}>
      {/* A banner across the card, not a floating tooltip: overlapping the
          buddy's own name was worse than taking a line of space. */}
      {bubble && <div className="buddy-bubble" role="status">{bubble}</div>}

      <div className="buddy-stage-wrap">
        <button
          className={`buddy-creature ${animation}`}
          onClick={poke}
          aria-label={buddy.name ? `Play with ${buddy.name}` : 'Name your new buddy'}
          style={{ '--buddy-scale': stage.scale } as React.CSSProperties}
        >
          {aura && (
            <span className="buddy-aura" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className={`buddy-aura-bit a${i}`}>{aura.emoji}</span>
              ))}
            </span>
          )}
          {/* A bought hat beats the royal stage's automatic crown. */}
          {hat
            ? <span className="buddy-hat" aria-hidden>{hat.emoji}</span>
            : stage.crown && <span className="buddy-crown" aria-hidden>👑</span>}
          <span className="buddy-emoji" aria-hidden>{stage.emoji || world.mascot}</span>
          {face && <span className="buddy-face" aria-hidden>{face.emoji}</span>}
          {held && <span className="buddy-held" aria-hidden>{held.emoji}</span>}
          {animation === 'eat' && <span className="buddy-crumbs" aria-hidden>✨🍪✨</span>}
        </button>

        <div className="buddy-sparkles" aria-hidden>
          {world.sprinkles.slice(0, 3).map((s, i) => (
            <span key={i} className={`buddy-sparkle s${i}`}>{s}</span>
          ))}
        </div>
      </div>

      <div className="buddy-info">
        {buddy.name ? (
          <h3 className="buddy-name">
            {buddy.name} <span className="buddy-stage-label">the {stage.label}</span>
          </h3>
        ) : (
          <h3 className="buddy-name">A mystery egg! 🥚</h3>
        )}

        <p className="buddy-blurb">{buddy.name ? stage.blurb : 'Tap the egg to give it a name.'}</p>

        <div className="buddy-meter" title={toNextStage}>
          <div className="buddy-meter-fill" style={{ width: `${Math.round(level.progress * 100)}%` }} />
        </div>
        <p className="buddy-next">{toNextStage}</p>

        <div className="buddy-actions">
          <button className="buddy-btn" onClick={feed} disabled={buddy.snacks <= 0}>
            🍪 Feed {buddy.snacks > 0 ? `(${buddy.snacks})` : ''}
          </button>
          <button className="buddy-btn ghost" onClick={poke}>
            {buddy.name ? '👋 Say hello' : '✏️ Name me!'}
          </button>
          {buddy.name && (
            <button className="buddy-btn dress" onClick={() => { sfx.tap(); setDressing(true) }}>
              🎽 Dress up
            </button>
          )}
        </div>

        {buddy.snacks <= 0 && buddy.name && (
          <p className="buddy-hint">Learn a word to earn a snack for {buddy.name}! 🍪</p>
        )}
      </div>

      {naming && (
        <div className="buddy-namer" role="dialog" aria-label="Name your buddy">
          <div className="buddy-namer-card">
            <div className="buddy-namer-egg" aria-hidden>🥚</div>
            <h4>What shall we call them?</h4>
            <input
              className="buddy-input"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveName()}
              placeholder="Type a name…"
              maxLength={14}
              autoFocus
            />
            <div className="buddy-namer-actions">
              <button className="buddy-btn" onClick={saveName} disabled={!draftName.trim()}>That's the one!</button>
              <button className="buddy-btn ghost" onClick={() => setNaming(false)}>Later</button>
            </div>
          </div>
        </div>
      )}

      {dressing && buddy.name && (
        <Wardrobe
          buddyName={buddy.name}
          onClose={() => setDressing(false)}
          onSay={say}
        />
      )}

      {evolved && (
        <div className="buddy-evolved" role="status">
          <div className="buddy-evolved-card">
            <div className="buddy-evolved-icon" aria-hidden>{stage.emoji || world.mascot}</div>
            <h4>{buddy.name || 'Your buddy'} grew!</h4>
            <p>Now a <strong>{evolved}</strong> — all because you keep learning. 🎉</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default BuddyCard

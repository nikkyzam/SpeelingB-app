import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAudio } from '../../contexts/AudioContext'
import { useProgress } from '../../contexts/ProgressContext'
import TrophyService, { SHELVES, ShelfItem, TROPHY_EVENT } from '../../services/trophies/TrophyService'
import BuddyService, { stageForLevel } from '../../services/buddy/BuddyService'
import { itemById } from '../../services/buddy/wardrobe'
import WordMastery from '../../services/progress/WordMastery'
import { wordBank } from '../../services/wordBank'
import sfx from '../../components/games/shared/sfx'
import Button from '../../components/common/Button'
import './TrophyRoom.css'

const earnedOn = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'long' }) : ''

/**
 * A room for the things a child has won.
 *
 * Badges used to unlock silently into a list nobody opened. Here every
 * accomplishment has a place, and — just as importantly — so does every one
 * not yet earned: the empty silhouettes are what tell a child there is more to
 * come. They carry a hint and never a countdown, so the shelf invites rather
 * than nags.
 */
const TrophyRoom: React.FC = () => {
  const navigate = useNavigate()
  const { world } = useTheme()
  const { speak } = useAudio()
  const { learningFlow } = useProgress()

  const [tick, setTick] = useState(0)
  const [open, setOpen] = useState<ShelfItem | null>(null)
  const [showing, setShowing] = useState(false) // "show a grown-up" mode

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    window.addEventListener(TROPHY_EVENT, bump)
    return () => window.removeEventListener(TROPHY_EVENT, bump)
  }, [])

  // Anything already true but never awarded is caught up on arrival — a child
  // who earned things before this room existed finds them waiting, instead of
  // an empty shelf implying they have done nothing.
  const freshlyWon = useMemo(() => {
    const learnedIds = learningFlow.getWordsLearnedTotal()
    const known = learnedIds.filter((id) => wordBank.getWordById(id))
    const seasonal = learnedIds.filter((id) => id.startsWith('seasonal-'))
    return TrophyService.sync({
      wordsLearned: known.length,
      streak: learningFlow.getCurrentStreak(),
      seasonalWordsLearned: seasonal.length,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningFlow])

  const items = useMemo(() => TrophyService.all(), [tick, freshlyWon])
  const earned = items.filter((i) => i.earnedAt)

  const buddy = BuddyService.get()
  const level = useMemo(
    () => WordMastery.level(learningFlow.getWordsLearnedTotal(), learningFlow.getWordsSpelledTotal()),
    [learningFlow]
  )
  const stage = stageForLevel(level.level)
  const hat = buddy.equipped.hat ? itemById(buddy.equipped.hat) : undefined

  const tap = (item: ShelfItem) => {
    setOpen(item)
    if (item.earnedAt) {
      sfx.star()
      speak(item.story)
    } else {
      sfx.tap()
      speak(item.hint)
    }
  }

  return (
    <div className={`trophy-room ${showing ? 'showing' : ''}`} data-world={world.id}>
      <div className="tr-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/')}>← Home</Button>
        <h1>🏆 My Trophy Room</h1>
        <span className="tr-count">{earned.length}/{items.length}</span>
      </div>

      {earned.length === 0 ? (
        <p className="tr-intro">
          This is your room. Every cup, plaque and medal you win will live here —
          tap a shadow to see what it takes to fill it.
        </p>
      ) : (
        <p className="tr-intro">
          {earned.length === 1
            ? 'Your first trophy! Tap it to hear how you won it.'
            : `${earned.length} trophies so far. Tap one to hear how you won it.`}
        </p>
      )}

      {freshlyWon.length > 0 && (
        <div className="tr-fresh" role="status">
          ✨ {freshlyWon.length === 1 ? 'A trophy was' : `${freshlyWon.length} trophies were`} waiting for you!
        </div>
      )}

      {/* The buddy lives here too, wearing whatever it has on. */}
      <div className="tr-buddy" aria-hidden>
        {hat && <span className="tr-buddy-hat">{hat.emoji}</span>}
        <span className="tr-buddy-creature">{stage.emoji || world.mascot}</span>
        {buddy.name && <span className="tr-buddy-name">{buddy.name}</span>}
      </div>

      {SHELVES.map((shelf) => {
        const row = items.filter((i) => i.kind === shelf.kind)
        if (row.length === 0) return null
        return (
          <section key={shelf.kind} className="tr-shelf">
            <div className="tr-shelf-label">
              <h2>{shelf.title}</h2>
              <span>{shelf.blurb}</span>
            </div>
            <div className="tr-shelf-items">
              {row.map((item) => (
                <button
                  key={item.id}
                  className={`tr-item ${item.earnedAt ? 'won' : 'empty'}`}
                  onClick={() => tap(item)}
                  aria-label={
                    item.earnedAt ? `${item.name}, won ${earnedOn(item.earnedAt)}` : `Not yet won: ${item.hint}`
                  }
                >
                  <span className="tr-item-icon" aria-hidden>{item.earnedAt ? item.icon : '◇'}</span>
                  <span className="tr-item-name">{item.earnedAt ? item.name : '???'}</span>
                </button>
              ))}
            </div>
            <div className="tr-shelf-plank" aria-hidden />
          </section>
        )
      })}

      <div className="tr-actions">
        <Button variant="primary" onClick={() => setShowing((s) => !s)}>
          {showing ? 'Done showing' : '👀 Show a grown-up'}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/tournament')}>
          🏆 Enter the Spelling Bee
        </Button>
      </div>

      {open && (
        <div className="tr-detail" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <div className="tr-detail-card pop-in" onClick={(e) => e.stopPropagation()}>
            <div className={`tr-detail-icon ${open.earnedAt ? 'won' : ''}`} aria-hidden>
              {open.earnedAt ? open.icon : '◇'}
            </div>
            <h3>{open.earnedAt ? open.name : 'Not won yet'}</h3>
            <p>{open.earnedAt ? open.story : open.hint}</p>
            {open.earnedAt && <p className="tr-detail-date">Won on {earnedOn(open.earnedAt)}</p>}
            <Button variant="primary" onClick={() => setOpen(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrophyRoom

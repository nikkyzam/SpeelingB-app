import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../../contexts/ProgressContext'
import { useAudio } from '../../contexts/AudioContext'
import { wordBank, Word } from '../../services/wordBank'
import WordMastery, { MASTERY_EVENT, MasteryLevel } from '../../services/progress/WordMastery'
import { chunkWord } from '../../services/words/wordShape'
import ReviewSchedule from '../../services/progress/ReviewSchedule'
import ExplorerLevel from '../../components/progress/ExplorerLevel'
import Button from '../../components/common/Button'
import './WordCollection.css'

type Filter = 'all' | 'tricky' | 1 | 2 | 3

const FILTERS: { id: Filter; label: string; icon: string }[] = [
  { id: 'all', label: 'Everything', icon: '📚' },
  { id: 1, label: 'Just met', icon: '⭐' },
  { id: 2, label: 'Spelled', icon: '⭐⭐' },
  { id: 3, label: 'Mastered', icon: '⭐⭐⭐' },
  { id: 'tricky', label: 'Tricky', icon: '💪' },
]

interface CollectedWord {
  word: Word
  stars: MasteryLevel
  /** keeps getting missed — worth extra practice */
  tricky: boolean
}

/**
 * Every word the child has met, kept as a collection.
 *
 * A counter that says "47 words" is a fact; a shelf with 47 cards on it is a
 * thing you want to fill. Each card earns its stars — met it, spelled it,
 * mastered it — so old words stay worth coming back to.
 */
const WordCollection: React.FC = () => {
  const navigate = useNavigate()
  const { learningFlow } = useProgress()
  const { speak } = useAudio()

  const [tick, setTick] = useState(0)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    window.addEventListener(MASTERY_EVENT, bump)
    window.addEventListener('learningProgressUpdated', bump)
    return () => {
      window.removeEventListener(MASTERY_EVENT, bump)
      window.removeEventListener('learningProgressUpdated', bump)
    }
  }, [])

  const collected = useMemo<CollectedWord[]>(() => {
    const learnedIds = learningFlow.getWordsLearnedTotal()
    const spelledIds = learningFlow.getWordsSpelledTotal()
    const learned = new Set(learnedIds)
    const spelled = new Set(spelledIds)

    // A saved id can stop resolving (ids are positional), so drop anything the
    // word bank no longer knows rather than rendering blank cards.
    return [...new Set([...learnedIds, ...spelledIds])]
      .map((id) => ({ id, word: wordBank.getWordById(id) }))
      .filter((entry): entry is { id: string; word: Word } => !!entry.word)
      .map(({ id, word }) => ({
        word,
        stars: WordMastery.levelFor(id, learned, spelled),
        tricky: ReviewSchedule.isTricky(id),
      }))
      .sort((a, b) => b.stars - a.stars || a.word.word.localeCompare(b.word.word))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningFlow, tick])

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase()
    return collected.filter((c) => {
      if (filter === 'tricky' && !c.tricky) return false
      if (filter !== 'all' && filter !== 'tricky' && c.stars !== filter) return false
      return !q || c.word.word.toLowerCase().includes(q)
    })
  }, [collected, filter, search])

  const counts = useMemo(
    () => ({
      total: collected.length,
      spelled: collected.filter((c) => c.stars >= 2).length,
      mastered: collected.filter((c) => c.stars === 3).length,
      bank: wordBank.getWordCount(),
    }),
    [collected]
  )

  const openWord = (entry: CollectedWord) => {
    setOpenId((id) => (id === entry.word.id ? null : entry.word.id))
    speak(entry.word.word)
  }

  return (
    <div className="word-collection">
      <div className="wc-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/learn')}>← Back to Learning</Button>
        <h1>🗂️ My Word Collection</h1>
      </div>

      <ExplorerLevel />

      <div className="wc-stats">
        <div className="wc-stat">
          <span className="wc-stat-value">{counts.total}</span>
          <span className="wc-stat-label">words collected</span>
        </div>
        <div className="wc-stat">
          <span className="wc-stat-value">{counts.spelled}</span>
          <span className="wc-stat-label">spelled right</span>
        </div>
        <div className="wc-stat">
          <span className="wc-stat-value">{counts.mastered}</span>
          <span className="wc-stat-label">mastered 🏅</span>
        </div>
        <div className="wc-stat">
          <span className="wc-stat-value">{counts.bank - counts.total}</span>
          <span className="wc-stat-label">still out there</span>
        </div>
      </div>

      {collected.length === 0 ? (
        <div className="wc-empty">
          <div className="wc-empty-icon" aria-hidden>🗂️</div>
          <h2>Your collection is empty… for now!</h2>
          <p>Every word you learn gets a card here. Go and meet your first one!</p>
          <Button variant="primary" icon="📖" onClick={() => navigate('/learn')}>Learn a word</Button>
        </div>
      ) : (
        <>
          <div className="wc-controls">
            <div className="wc-filters">
              {FILTERS.map((f) => (
                <button
                  key={String(f.id)}
                  className={`wc-chip ${filter === f.id ? 'active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  <span aria-hidden>{f.icon}</span> {f.label}
                </button>
              ))}
            </div>
            <input
              className="wc-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a word…"
              aria-label="Search your collection"
            />
          </div>

          {collected.some((c) => c.tricky) && (
            <div className="wc-tricky-cta">
              <span>💪 Some words keep catching you out — want to beat them?</span>
              <Button variant="warning" icon="💪" onClick={() => navigate('/review?mode=tricky')}>
                Practise tricky words
              </Button>
            </div>
          )}

          <p className="wc-hint">Tap a card to hear the word and see what it means. ⭐ met it · ⭐⭐ spelled it · ⭐⭐⭐ mastered it</p>

          <div className="wc-grid">
            {shown.map(({ word, stars, tricky }) => {
              const open = openId === word.id
              return (
                <button
                  key={word.id}
                  className={`wc-card stars-${stars} ${tricky ? 'tricky' : ''} ${open ? 'open' : ''}`}
                  onClick={() => openWord({ word, stars, tricky })}
                >
                  <span className="wc-card-stars" aria-label={`${stars} of 3 stars`}>
                    {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
                  </span>
                  <span className="wc-card-word">{word.word}</span>
                  {tricky && <span className="wc-card-tricky" title="This one keeps catching you out">💪 tricky</span>}
                  {/* Only worth showing when it actually splits into pieces. */}
                  {chunkWord(word.word).length > 1 && (
                    <span className="wc-card-chunks">{chunkWord(word.word).join('·')}</span>
                  )}
                  {open && (
                    <span className="wc-card-meaning">
                      {word.meaning || 'A word you have met!'}
                      {stars < 3 && (
                        <em className="wc-card-tip">
                          {stars === 1 ? 'Spell it right to earn a second star!' : 'Spell it right a few more times to master it!'}
                        </em>
                      )}
                    </span>
                  )}
                </button>
              )
            })}

            {shown.length === 0 && (
              <p className="wc-none">No words here yet — try another filter! 🔎</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default WordCollection

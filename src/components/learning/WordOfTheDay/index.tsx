import React, { useMemo, useState } from 'react'
import { useAudio } from '../../../contexts/AudioContext'
import { useProgress } from '../../../contexts/ProgressContext'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import { wordBank, Word } from '../../../services/wordBank'
import { chunkWord, wordFacts } from '../../../services/words/wordShape'
import WordMastery from '../../../services/progress/WordMastery'
import ReviewSchedule from '../../../services/progress/ReviewSchedule'
import BuddyService from '../../../services/buddy/BuddyService'
import sfx from '../../games/shared/sfx'
import './WordOfTheDay.css'

const COLLECTED_KEY = 'word_of_day_collected'

const todayKey = (): string => new Date().toISOString().slice(0, 10)

/** Same word for everyone all day, a new one tomorrow — no randomness on reload. */
const pickForToday = (words: Word[]): Word | undefined => {
  if (words.length === 0) return undefined
  const key = todayKey()
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return words[hash % words.length]
}

/**
 * One word a day, for free, with no test attached.
 *
 * Everything else in the app asks a child to prove something. This just shows
 * them something interesting and lets them keep it — which is how people
 * actually fall for words.
 */
const WordOfTheDay: React.FC = () => {
  const { speak } = useAudio()
  const { learningFlow } = useProgress()
  const { addStars } = useRewardStore()

  const word = useMemo(() => {
    // Draw from the easiest tier so the daily word is always approachable.
    const pool = wordBank.getWordsByDifficulty(1).filter((w) => /^[a-z]+$/i.test(w.word) && (w.meaning || '').length > 5)
    return pickForToday(pool.length > 0 ? pool : wordBank.getAllWords())
  }, [])

  const [collected, setCollected] = useState(() => {
    try {
      return localStorage.getItem(COLLECTED_KEY) === todayKey()
    } catch {
      return false
    }
  })

  const chunks = useMemo(() => (word ? chunkWord(word.word) : []), [word])
  const facts = useMemo(() => (word ? wordFacts(word.word) : []), [word])

  if (!word) return null

  const keepIt = () => {
    if (collected) return
    learningFlow.completeWord(word.id)
    WordMastery.recordLearned()
    // Met but never tested, so it starts in box 1 and comes back tomorrow.
    ReviewSchedule.record(word.id, false)
    BuddyService.earnSnack()
    addStars(3)
    try {
      localStorage.setItem(COLLECTED_KEY, todayKey())
    } catch {
      /* the word is still theirs for this session */
    }
    setCollected(true)
    sfx.star()
    speak(`${word.word} is yours!`)
  }

  return (
    <section className="wotd">
      <div className="wotd-ribbon">✨ Word of the Day</div>

      <button className="wotd-word" onClick={() => speak(word.word)}>
        {word.word}
        <span className="wotd-speak" aria-hidden>🔊</span>
      </button>

      {chunks.length > 1 && (
        <div className="wotd-chunks">
          {chunks.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="wotd-dash" aria-hidden>-</span>}
              <button className="wotd-chunk" onClick={() => speak(c)}>{c}</button>
            </React.Fragment>
          ))}
        </div>
      )}

      <p className="wotd-meaning">{word.meaning}</p>
      {word.sentence && <p className="wotd-sentence">“{word.sentence}”</p>}

      <div className="wotd-facts">
        {facts.slice(0, 3).map((f) => (
          <span key={f} className="wotd-fact">{f}</span>
        ))}
      </div>

      <button className={`wotd-keep ${collected ? 'done' : ''}`} onClick={keepIt} disabled={collected}>
        {collected ? '✅ It’s in your collection!' : '⭐ Keep this word'}
      </button>
    </section>
  )
}

export default WordOfTheDay

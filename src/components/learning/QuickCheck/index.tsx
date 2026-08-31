import React, { useMemo, useState } from 'react'
import { Word } from '../../../services/wordBank'
import { useAudio } from '../../../contexts/AudioContext'
import { shuffle, misspell } from '../../games/shared/wordTricks'
import sfx from '../../games/shared/sfx'
import './QuickCheck.css'

interface QuickCheckProps {
  word: Word
  /** Rotates the kind of check so five words aren't five identical puzzles. */
  variant?: number
  /** Called once the child has got it (or asked to be shown). */
  onPass: (helped: boolean) => void
  /** Label the continue button as the end of the lesson. */
  isLast?: boolean
}

type Kind = 'build' | 'choose' | 'missing'
type Phase = 'working' | 'right' | 'revealed'

const KINDS: Kind[] = ['build', 'choose', 'missing']
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

/**
 * A five-second check that turns "I read it" into "I know it".
 *
 * Tapping "Got it!" on a flashcard proves nothing — a child can flip five cards
 * without reading one. This asks for something small back before the word counts
 * as learned. It can never block them: "Not sure?" shows the answer and the
 * lesson carries on, because a stuck child stops playing.
 */
const QuickCheck: React.FC<QuickCheckProps> = ({ word, variant = 0, onPass, isLast }) => {
  const { speak } = useAudio()
  const answer = word.word.toLowerCase()

  // Very short words have nothing to hide, so they always get built.
  const kind: Kind = answer.length < 4 ? 'build' : KINDS[variant % KINDS.length]

  const [phase, setPhase] = useState<Phase>('working')
  const [picked, setPicked] = useState<number[]>([]) // build: indexes into tray
  const [wrong, setWrong] = useState<string | null>(null)

  const tray = useMemo(() => shuffle([...answer]), [answer])

  const options = useMemo(() => {
    if (kind === 'choose') {
      const fakes = new Set<string>()
      for (let i = 0; i < 10 && fakes.size < 2; i++) {
        const bad = misspell(answer)
        if (bad !== answer) fakes.add(bad)
      }
      while (fakes.size < 2) fakes.add(answer + answer.slice(-1))
      return shuffle([answer, ...fakes])
    }
    return []
  }, [kind, answer])

  // Which letter is hidden in the "missing" check, plus its decoys.
  const hidden = useMemo(() => {
    const at = 1 + Math.floor(variant % Math.max(answer.length - 2, 1))
    const letter = answer[at]
    const decoys = shuffle(ALPHABET.split('').filter((c) => c !== letter)).slice(0, 2)
    return { at, letter, choices: shuffle([letter, ...decoys]) }
  }, [answer, variant])

  const pass = (helped: boolean) => {
    if (helped) {
      setPhase('revealed')
      speak(word.word)
      return
    }
    setPhase('right')
    sfx.correct()
    speak('Yes!')
    setTimeout(() => onPass(false), 900)
  }

  const miss = (label: string) => {
    sfx.wrong()
    setWrong(label)
    setTimeout(() => setWrong((w) => (w === label ? null : w)), 600)
  }

  // --- build: tap the letters in order ---
  const tapTile = (index: number) => {
    if (phase !== 'working' || picked.includes(index)) return
    const next = [...picked, index]
    const attempt = next.map((i) => tray[i]).join('')

    if (!answer.startsWith(attempt)) {
      miss(`tile-${index}`)
      return
    }
    sfx.tap()
    setPicked(next)
    if (attempt === answer) pass(false)
  }

  const undo = () => {
    if (phase !== 'working') return
    setPicked((p) => p.slice(0, -1))
  }

  const built = picked.map((i) => tray[i]).join('')

  const prompt =
    kind === 'build'
      ? 'Tap the letters in order'
      : kind === 'choose'
        ? 'Which one is spelled right?'
        : 'Which letter is missing?'

  return (
    <div className={`quick-check ${phase}`}>
      <div className="qc-title">
        <span className="qc-spark" aria-hidden>⚡</span> Quick check!
        <button className="qc-hear" onClick={() => speak(word.word)} aria-label="Hear the word again">🔊</button>
      </div>
      <p className="qc-prompt">{prompt}</p>

      {kind === 'build' && (
        <>
          <div className="qc-slots">
            {answer.split('').map((c, i) => (
              <span key={i} className={`qc-slot ${i < built.length ? 'filled' : ''}`}>
                {i < built.length ? built[i] : phase === 'revealed' ? c : ''}
              </span>
            ))}
          </div>
          <div className="qc-tray">
            {tray.map((c, i) => (
              <button
                key={i}
                className={`qc-tile ${picked.includes(i) ? 'used' : ''} ${wrong === `tile-${i}` ? 'miss' : ''}`}
                onClick={() => tapTile(i)}
                disabled={phase !== 'working' || picked.includes(i)}
              >
                {c}
              </button>
            ))}
          </div>
          {picked.length > 0 && phase === 'working' && (
            <button className="qc-undo" onClick={undo}>⌫ Undo</button>
          )}
        </>
      )}

      {kind === 'choose' && (
        <div className="qc-options">
          {options.map((o) => (
            <button
              key={o}
              className={`qc-option ${wrong === o ? 'miss' : ''} ${phase !== 'working' && o === answer ? 'right' : ''}`}
              onClick={() => (o === answer ? pass(false) : miss(o))}
              disabled={phase !== 'working'}
            >
              {o}
            </button>
          ))}
        </div>
      )}

      {kind === 'missing' && (
        <>
          <div className="qc-slots">
            {answer.split('').map((c, i) => (
              <span key={i} className={`qc-slot ${i === hidden.at ? 'gap' : 'filled'}`}>
                {i === hidden.at ? (phase === 'working' ? '?' : c) : c}
              </span>
            ))}
          </div>
          <div className="qc-options letters">
            {hidden.choices.map((c) => (
              <button
                key={c}
                className={`qc-option ${wrong === c ? 'miss' : ''} ${phase !== 'working' && c === hidden.letter ? 'right' : ''}`}
                onClick={() => (c === hidden.letter ? pass(false) : miss(c))}
                disabled={phase !== 'working'}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'working' && (
        <button className="qc-help" onClick={() => pass(true)}>
          Not sure? 👀 Show me
        </button>
      )}

      {phase === 'right' && <div className="qc-flash ok">🎉 Yes! You know this one!</div>}

      {phase === 'revealed' && (
        <div className="qc-revealed">
          <div className="qc-flash soft">It&apos;s <strong>{word.word}</strong> — now you know! 💡</div>
          <button className="qc-next" onClick={() => onPass(true)}>
            {isLast ? 'Finish! 🏁' : 'Next word →'}
          </button>
        </div>
      )}
    </div>
  )
}

export default QuickCheck

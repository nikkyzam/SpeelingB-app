import React, { useState } from 'react'
import { useAudio } from '../../../contexts/AudioContext'

/** A no-score warm-up: children can learn the controls without losing a turn. */
export default function PracticeExample({ kind = 'letters' }: { kind?: 'letters' | 'choice' | 'math' }) {
  const [built, setBuilt] = useState('')
  const [message, setMessage] = useState('')
  const { speak } = useAudio()
  if (kind === 'choice' || kind === 'math') return <section className="card">
    <h3>Try a practice tap</h3>
    <p>{kind === 'math' ? '2 + 1 = ?' : 'Hear “cat”, then tap the matching word.'}</p>
    {kind === 'choice' && <button className="comfort-button" onClick={() => speak('cat')}>🔊 Hear cat</button>}
    {(kind === 'math' ? ['3', '4', '5'] : ['cat', 'cap', 'can']).map((word, i) => <button key={word} className="comfort-button" onClick={() => setMessage(i === 0 ? 'You did it! This example does not change your score.' : 'Have another go. This is just practice.')}>{word}</button>)}
    <p role="status">{message}</p>
  </section>
  return <section className="card"><h3>Try building a word</h3><p>Tap c, then a, then t. This example has no score.</p>
    <p aria-live="polite">{built || '— — —'}</p>
    {['t', 'c', 'a'].map(letter => <button key={letter} className="comfort-button" onClick={() => {
      const next = built + letter
      if ('cat'.startsWith(next)) { setBuilt(next); setMessage(next === 'cat' ? 'You built cat! Ready to play?' : '') }
      else setMessage('Try the next letter in cat. You can take your time.')
    }}>{letter}</button>)}
    <button className="comfort-button" onClick={() => { setBuilt(''); setMessage('') }}>Start the example again</button><p role="status">{message}</p>
  </section>
}

import React, { useEffect, useRef, useState } from 'react'
import MysteryBoxService, { MYSTERY_BOX_EVENT, MysteryPrize } from '../../../services/rewards/MysteryBox'
import { useAudio } from '../../../contexts/AudioContext'
import sfx from '../../games/shared/sfx'
import './MysteryBox.css'

const describe = (prize: MysteryPrize): { icon: string; title: string; detail: string } => {
  switch (prize.kind) {
    case 'stars':
      return {
        icon: '⭐',
        title: `+${prize.amount} stars!`,
        detail: prize.amount >= 50 ? 'A JACKPOT! Spend them in the prize shop!' : 'Added to your star jar — nice!',
      }
    case 'snacks':
      return {
        icon: '🍪',
        title: `${prize.amount} buddy snack${prize.amount === 1 ? '' : 's'}!`,
        detail: 'Your buddy is going to be SO happy. Feed them below!',
      }
    case 'wardrobe':
      return {
        icon: prize.item.emoji,
        title: `A ${prize.item.name}!`,
        detail: `${prize.item.blurb} Dress your buddy up to wear it!`,
      }
  }
}

/**
 * One free gift a day. The box sits on the Home page wiggling until it is
 * opened — no timers, no pressure, just a small daily moment of "ooh!".
 */
const MysteryBox: React.FC = () => {
  const { speak } = useAudio()
  const [available, setAvailable] = useState(() => MysteryBoxService.isAvailable())
  const [opening, setOpening] = useState(false)
  const [prize, setPrize] = useState<MysteryPrize | null>(null)
  const revealTimer = useRef<number | null>(null)

  // Without this, walking away mid-suspense still opens the box: the prize is
  // granted and the day marked used, on a screen the child never sees.
  useEffect(() => () => { if (revealTimer.current) window.clearTimeout(revealTimer.current) }, [])

  useEffect(() => {
    const bump = () => setAvailable(MysteryBoxService.isAvailable())
    window.addEventListener(MYSTERY_BOX_EVENT, bump)
    return () => window.removeEventListener(MYSTERY_BOX_EVENT, bump)
  }, [])

  const open = () => {
    if (!available || opening) return
    setOpening(true)
    sfx.pop()
    // A beat of suspense before the reveal — half the fun of a present.
    revealTimer.current = window.setTimeout(() => {
      const won = MysteryBoxService.open()
      setOpening(false)
      if (!won) return
      setPrize(won)
      sfx.fanfare()
      window.dispatchEvent(new Event('show-confetti'))
      const d = describe(won)
      speak(`You got ${d.title.replace('!', '')}!`)
    }, 900)
  }

  if (!available && !prize) return null

  return (
    <section className="mystery-box pop-in" aria-label="Daily mystery box">
      {prize ? (
        <div className="mystery-reveal" role="status">
          <div className="mystery-reveal-icon" aria-hidden>{describe(prize).icon}</div>
          <div className="mystery-reveal-text">
            <h2>{describe(prize).title}</h2>
            <p>{describe(prize).detail}</p>
            <p className="mystery-again">Come back tomorrow for another surprise! 🎁</p>
          </div>
          <button className="mystery-close" onClick={() => setPrize(null)} aria-label="Close">✕</button>
        </div>
      ) : (
        <button
          className={`mystery-gift ${opening ? 'opening' : 'wiggle'}`}
          onClick={open}
          aria-label="Open your daily mystery box"
        >
          <span className="mystery-gift-icon" aria-hidden>{opening ? '✨' : '🎁'}</span>
          <span className="mystery-gift-text">
            <strong>{opening ? 'Opening…' : 'Your daily Mystery Box is here!'}</strong>
            <small>{opening ? 'Ooh, what could it be?' : 'Tap to open your free surprise!'}</small>
          </span>
        </button>
      )}
    </section>
  )
}

export default MysteryBox

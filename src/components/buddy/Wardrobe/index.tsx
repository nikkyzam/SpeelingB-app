import React, { useMemo, useState } from 'react'
import { useRewardStore } from '../../../stores/rewards/useRewardStore'
import BuddyService from '../../../services/buddy/BuddyService'
import { WARDROBE, SLOT_LABELS, Slot, WardrobeItem, buyItem } from '../../../services/buddy/wardrobe'
import sfx from '../../games/shared/sfx'
import './Wardrobe.css'

interface WardrobeProps {
  buddyName: string
  onClose: () => void
  /** so the buddy can react to being dressed */
  onSay: (text: string) => void
}

const SLOT_ORDER: Slot[] = ['hat', 'face', 'held', 'aura']

/**
 * Where stars finally turn into something a child can see.
 *
 * Buying dresses the buddy immediately — no confirmation step, no "purchased"
 * list. You tap, and your friend is wearing a top hat.
 */
const Wardrobe: React.FC<WardrobeProps> = ({ buddyName, onClose, onSay }) => {
  const { heavenlyStars, loadPoints } = useRewardStore()
  const [tick, setTick] = useState(0)
  const [denied, setDenied] = useState<string | null>(null)

  const buddy = useMemo(() => BuddyService.get(), [tick])

  const refresh = () => {
    loadPoints()
    setTick((t) => t + 1)
  }

  const buy = (item: WardrobeItem) => {
    if (BuddyService.isOwned(item.id)) return
    if (!buyItem(item)) {
      // Never a dead end: say how close they are instead of just refusing.
      sfx.wrong()
      setDenied(item.id)
      window.setTimeout(() => setDenied((d) => (d === item.id ? null : d)), 1800)
      return
    }
    BuddyService.own(item.id)
    BuddyService.equip(item.slot, item.id)
    sfx.fanfare()
    refresh()
    onSay(`Look at me in my ${item.name.toLowerCase()}!`)
  }

  const toggle = (item: WardrobeItem) => {
    const wearing = buddy.equipped[item.slot] === item.id
    BuddyService.equip(item.slot, wearing ? null : item.id)
    sfx.tap()
    refresh()
    if (!wearing) onSay(`How do I look?`)
  }

  return (
    <div className="wardrobe" role="dialog" aria-label={`${buddyName}'s wardrobe`}>
      <div className="wd-card">
        <div className="wd-head">
          <h3>🎽 {buddyName}&apos;s Wardrobe</h3>
          <div className="wd-purse" title="Your stars">⭐ {heavenlyStars}</div>
          <button className="wd-close" onClick={onClose} aria-label="Close the wardrobe">✕</button>
        </div>

        <div className="wd-body">
          {SLOT_ORDER.map((slot) => (
            <section key={slot} className="wd-section">
              <h4>{SLOT_LABELS[slot]}</h4>
              <div className="wd-grid">
                {WARDROBE.filter((i) => i.slot === slot).map((item) => {
                  const owned = buddy.owned.includes(item.id)
                  const wearing = buddy.equipped[slot] === item.id
                  const short = Math.max(0, item.cost - heavenlyStars)
                  return (
                    <button
                      key={item.id}
                      className={`wd-item ${owned ? 'owned' : ''} ${wearing ? 'wearing' : ''} ${denied === item.id ? 'denied' : ''}`}
                      onClick={() => (owned ? toggle(item) : buy(item))}
                      title={item.blurb}
                    >
                      <span className="wd-emoji" aria-hidden>{item.emoji}</span>
                      <span className="wd-name">{item.name}</span>
                      <span className="wd-tag">
                        {wearing ? 'Wearing ✓' : owned ? 'Wear it' : `⭐ ${item.cost}`}
                      </span>
                      {denied === item.id && (
                        <span className="wd-denied">{short} more star{short === 1 ? '' : 's'}!</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <p className="wd-foot">Earn stars by learning words and playing games. 🌟</p>
      </div>
    </div>
  )
}

export default Wardrobe

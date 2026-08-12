import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { World, getWorld } from '../../theme/worlds'
import './WorldPicker.css'

interface WorldPickerProps {
  /** Called after a world is picked (e.g. to close a modal) */
  onPicked?: (world: World) => void
  /** Show a title header above the grid */
  showTitle?: boolean
}

/** A grid of big, tappable "world" cards. Picking one instantly re-skins the app. */
const WorldPicker: React.FC<WorldPickerProps> = ({ onPicked, showTitle = true }) => {
  const { theme, worlds, setTheme, markWorldChosen } = useTheme()

  const handlePick = (world: World) => {
    setTheme(world.id)
    markWorldChosen()
    onPicked?.(world)
  }

  return (
    <div className="world-picker">
      {showTitle && (
        <div className="world-picker__head">
          <h2>Pick your world! 🌍</h2>
          <p>Choose your adventure — you can change it any time.</p>
        </div>
      )}

      <div className="world-picker__grid">
        {worlds.map((world) => {
          const isActive = theme === world.id
          const t = world.tokens
          return (
            <button
              key={world.id}
              type="button"
              className={`world-card ${isActive ? 'is-active' : ''}`}
              style={
                {
                  '--wc-bg': t.bg,
                  '--wc-primary': t.primary,
                  '--wc-primary2': t.primary2,
                  '--wc-border': t.border,
                } as React.CSSProperties
              }
              onClick={() => handlePick(world)}
              aria-pressed={isActive}
            >
              <span className="world-card__mascot" aria-hidden>
                {world.mascot}
              </span>
              <span className="world-card__name">{world.name}</span>
              <span className="world-card__tagline">{world.tagline}</span>
              <span className="world-card__sprinkles" aria-hidden>
                {world.sprinkles.slice(0, 3).join(' ')}
              </span>
              {isActive && <span className="world-card__check" aria-hidden>✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Full-screen first-run modal shown until a child picks a world. */
export const WorldPickerModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  if (!open) return null
  return (
    <div className="world-picker-modal" role="dialog" aria-modal="true">
      <div className="world-picker-modal__sheet pop-in">
        <div className="world-picker-modal__welcome">
          <span className="world-picker-modal__wave wiggle" aria-hidden>👋</span>
          <h1>Welcome!</h1>
          <p>Let&apos;s make this <strong>your</strong> spelling world.</p>
        </div>
        <WorldPicker showTitle={false} onPicked={onClose} />
      </div>
    </div>
  )
}

export default WorldPicker

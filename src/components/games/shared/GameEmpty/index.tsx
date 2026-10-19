import React from 'react'
import './GameEmpty.css'

interface GameEmptyProps {
  /** A big friendly emoji for the game. */
  icon?: string
  children: React.ReactNode
}

/**
 * What a game shows when it has nothing to play with yet.
 *
 * Deliberately no button: `onComplete()` is a finished game to the hub, which
 * pays a star and a daily-challenge play for it, so a "Back" button that
 * called it let a child farm stars from an empty screen. "← Back to Games" in
 * the hub's header is the way out.
 */
const GameEmpty: React.FC<GameEmptyProps> = ({ icon = '🐝', children }) => (
  <div className="ge-empty" role="status">
    <div className="ge-icon" aria-hidden>{icon}</div>
    <p className="ge-text">{children}</p>
  </div>
)

export default GameEmpty

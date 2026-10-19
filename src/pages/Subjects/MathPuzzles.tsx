import React from 'react'
import PuzzleBox from '../../components/subjects/PuzzleBox'
import BackLink from './BackLink'
import './Subjects.css'

/** /subjects/math/puzzles — untimed puzzles with a hint ladder. */
const MathPuzzles: React.FC = () => (
  <div className="subjects-page">
    <BackLink to="/subjects/math" label="Math" />
    <header className="sj-hero sj-tone-secondary">
      <h1>🔍 Puzzles</h1>
      <p>Take your time. No clock, no score — just thinking.</p>
    </header>
    <PuzzleBox />
  </div>
)

export default MathPuzzles

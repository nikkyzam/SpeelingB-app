import React from 'react'
import ProofTrainer from '../../components/subjects/ProofTrainer'
import BackLink from './BackLink'
import './Subjects.css'

/** /subjects/math/proofs — the proof trainer under the Math heading. */
const MathProofs: React.FC = () => (
  <div className="subjects-page">
    <BackLink to="/subjects/math" label="Math" />
    <header className="sj-hero sj-tone-accent">
      <h1>🧩 Proofs</h1>
      <p>Show why it's true, one step at a time.</p>
    </header>
    <ProofTrainer />
  </div>
)

export default MathProofs

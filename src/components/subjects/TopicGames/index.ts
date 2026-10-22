import type React from 'react'
import type { TopicGameProps } from '../../../services/subjects/gamePool'
import QuizSprint from './QuizSprint'
import MatchUp from './MatchUp'
import BubblePop from './BubblePop'

/**
 * Games every topic gets, built from that topic's own questions. Adding a
 * game here adds it to every Math Quest topic and every practice test.
 */
export interface TopicGame {
  id: string
  name: string
  icon: string
  blurb: string
  Component: React.FC<TopicGameProps>
}

export const TOPIC_GAMES: TopicGame[] = [
  { id: 'quiz-sprint', name: 'Quiz Sprint', icon: '⏱️', blurb: 'How many can you get in 90 seconds?', Component: QuizSprint },
  { id: 'match-up', name: 'Match Up', icon: '🧩', blurb: 'Pair each question with its answer.', Component: MatchUp },
  { id: 'bubble-pop', name: 'Bubble Pop', icon: '🫧', blurb: 'Pop the bubble with the right answer.', Component: BubblePop },
]

export interface GameProps {
  onComplete: (score: number) => void
  difficulty?: 'easy' | 'medium' | 'hard'
  duration?: number
  category?: string
}

export interface GameStats {
  score: number
  timeSpent: number
  accuracy: number
  wordsCompleted: number
  streak: number
}

export interface GameConfig {
  id: string
  name: string
  description: string
  icon: string
  category: string
  difficulty: string[]
  estimatedTime: number
  minPlayers: number
  maxPlayers: number
}

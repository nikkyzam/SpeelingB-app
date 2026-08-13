import React, { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { useProgress } from '../../contexts/ProgressContext'
import { wordBank } from '../../services/wordBank'
import Button from '../../components/common/Button'
import { 
  BonusGame, 
  WordRace, 
  MemoryMatch, 
  BalloonPop,
  WordScramble,
  SpellSprint,
  ShapeCatcher,
  SpellingAdventure,
  PatternMemory,
  RhythmTap,
  MemoryGrid,
  ReactionTest,
  PatternSequencer,
  ColorMixer,
  MathPuzzle,
  MusicComposer,
  PhysicsPuzzle,
  PuzzleSlider,
  WordBuilder,
  MissingLetter,
  SpellingCheck,
  RescueTheBee,
  BibleTriviaEnhanced,
  BibleMemorizer
} from '../../components/games'
import BibleApiDashboard from '../../components/bible/BibleApiDashboard'
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import './GameCenter.css'

const prettyGameName = (id: string) =>
  id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

type GameMode = 
  | 'bonus' | 'word-race' | 'memory-match' | 'balloon-pop' 
  | 'word-scramble' | 'spell-sprint' | 'shape-catcher' | 'spelling-adventure'
  | 'pattern-memory' | 'rhythm-tap' | 'memory-grid' | 'reaction-test'
  | 'pattern-sequencer' | 'color-mixer' | 'math-puzzle' | 'music-composer'
  | 'physics-puzzle' | 'puzzle-slider'
  | 'word-builder' | 'missing-letter'
  | 'spelling-check' | 'rescue-the-bee'
  | 'bible-trivia' | 'bible-memorizer'
  | null

const GameCenter: React.FC = () => {
  const location = useLocation()
  const [activeGame, setActiveGame] = useState<GameMode>(null)
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  const { addStars } = useRewardStore()
  const { learningFlow } = useProgress()

  const selectedWords = useMemo(() => {
    const difficulty = learningFlow.getDifficulty()
    const selectedGroup = learningFlow.getSelectedGroup()
    const groupSize = learningFlow.getDailyGoal('learn')
    
    const filteredWords = difficulty 
      ? wordBank.getWordsByDifficulty(difficulty) 
      : wordBank.getAllWords()
    
    const start = selectedGroup * groupSize
    return filteredWords.slice(start, start + groupSize)
  }, [learningFlow])

  useEffect(() => {
    if (location.state && (location.state as any).startGame) {
      setActiveGame((location.state as any).startGame)
    }
  }, [location.state])

  const isGamesUnlocked = learningFlow.areGamesUnlocked()

  const handleStartChallenge = () => {
    // For "Memory Match Master" challenge
    setActiveGame('memory-match')
  }

  const games = [
    {
      id: 'bonus',
      title: '🎁 Bonus Game',
      description: 'Tap everything! 15 seconds of fun',
      icon: '🎯',
      color: '#FF6B6B',
      duration: '15s',
      unlocked: true
    },
    {
      id: 'word-race',
      title: '🏃 Word Race',
      description: 'Catch falling words before they hit the ground',
      icon: '📝',
      color: '#4ECDC4',
      duration: '60s',
      unlocked: true
    },
    {
      id: 'memory-match',
      title: '🧠 Memory Match',
      description: 'Match words with their meanings',
      icon: '🎴',
      color: '#FFD166',
      duration: 'Unlimited',
      unlocked: true
    },
    {
      id: 'word-builder',
      title: '🧱 Word Builder',
      description: 'Tap the letters in order to build the word',
      icon: '🧱',
      color: '#8338EC',
      duration: '5 words',
      unlocked: true
    },
    {
      id: 'missing-letter',
      title: '🔡 Missing Letter',
      description: 'Pick the letter that completes the word',
      icon: '🔡',
      color: '#0EA5E9',
      duration: '6 words',
      unlocked: true
    },
    {
      id: 'spelling-check',
      title: '🔍 Spelling Check',
      description: 'Hear the word, tap the correct spelling',
      icon: '🔍',
      color: '#EF476F',
      duration: '6 words',
      unlocked: true
    },
    {
      id: 'rescue-the-bee',
      title: '🐝 Rescue the Bee',
      description: 'Guess the letters to spell the word',
      icon: '🐝',
      color: '#F4A300',
      duration: '5 words',
      unlocked: true
    },
    {
      id: 'balloon-pop',
      title: '🎈 Balloon Pop',
      description: 'Pop balloons in order to spell words',
      icon: '💥',
      color: '#06D6A0',
      duration: '3 words',
      unlocked: true
    },
    {
      id: 'word-scramble',
      title: '🔤 Word Scramble',
      description: 'Unscramble letters to form words',
      icon: '🌀',
      color: '#118AB2',
      duration: '45s',
      unlocked: learningFlow.isGameUnlocked('word-scramble')
    },
    {
      id: 'spell-sprint',
      title: '🏃‍♂️ Spell Sprint',
      description: 'Spell as many words as possible',
      icon: '🏃‍♂️',
      color: '#8338EC',
      duration: '60s',
      unlocked: learningFlow.isGameUnlocked('spell-sprint')
    },
    {
      id: 'shape-catcher',
      title: '🔺 Shape Catcher',
      description: 'Catch target shapes (non-spelling)',
      icon: '🎮',
      color: '#FF006E',
      duration: '60s',
      unlocked: learningFlow.isGameUnlocked('shape-catcher')
    },
    {
      id: 'spelling-adventure',
      title: '🗺️ Spelling Adventure',
      description: '3D exploration and learning game',
      icon: '🌟',
      color: '#FB5607',
      duration: 'Adventure',
      unlocked: learningFlow.isGameUnlocked('spelling-adventure')
    },
    {
      id: 'pattern-memory',
      title: '🧩 Pattern Memory',
      description: 'Remember and repeat the pattern',
      icon: '🧩',
      color: '#FF9F1C',
      duration: '60s',
      unlocked: learningFlow.isGameUnlocked('pattern-memory')
    },
    {
      id: 'rhythm-tap',
      title: '🎵 Rhythm Tap',
      description: 'Tap in rhythm with the music',
      icon: '🎵',
      color: '#2EC4B6',
      duration: '60s',
      unlocked: learningFlow.isGameUnlocked('rhythm-tap')
    },
    {
      id: 'memory-grid',
      title: '🔢 Memory Grid',
      description: 'Find the matching pairs in the grid',
      icon: '🔢',
      color: '#E71D36',
      duration: '90s',
      unlocked: learningFlow.isGameUnlocked('memory-grid')
    },
    {
      id: 'reaction-test',
      title: '⚡ Reaction Test',
      description: 'Test your reaction speed',
      icon: '⚡',
      color: '#FF9F1C',
      duration: '30s',
      unlocked: learningFlow.isGameUnlocked('reaction-test')
    },
    {
      id: 'pattern-sequencer',
      title: '🧬 Pattern Sequencer',
      description: 'Complete the logical sequence',
      icon: '🧬',
      color: '#7209B7',
      duration: '120s',
      unlocked: learningFlow.isGameUnlocked('pattern-sequencer')
    },
    {
      id: 'color-mixer',
      title: '🎨 Color Mixer',
      description: 'Mix colors to match the target',
      icon: '🎨',
      color: '#3A86FF',
      duration: '60s',
      unlocked: learningFlow.isGameUnlocked('color-mixer')
    },
    {
      id: 'math-puzzle',
      title: '➕ Math Puzzle',
      description: 'Solve simple math problems',
      icon: '➕',
      color: '#8AC926',
      duration: '60s',
      unlocked: learningFlow.isGameUnlocked('math-puzzle')
    },
    {
      id: 'music-composer',
      title: '🎹 Music Composer',
      description: 'Create your own melodies',
      icon: '🎹',
      color: '#FFCA3A',
      duration: 'Unlimited',
      unlocked: learningFlow.isGameUnlocked('music-composer')
    },
    {
      id: 'physics-puzzle',
      title: '⚙️ Physics Puzzle',
      description: 'Use physics to solve the puzzle',
      icon: '⚙️',
      color: '#1982C4',
      duration: '120s',
      unlocked: learningFlow.isGameUnlocked('physics-puzzle')
    },
    {
      id: 'puzzle-slider',
      title: '🖼️ Puzzle Slider',
      description: 'Slide tiles to complete the image',
      icon: '🖼️',
      color: '#6A4C93',
      duration: '180s',
      unlocked: learningFlow.isGameUnlocked('puzzle-slider')
    },
    {
      id: 'bible-trivia',
      title: '📖 Bible Trivia',
      description: 'Test your knowledge of the Bible',
      icon: '✝️',
      color: '#FFD700',
      duration: 'Unlimited',
      unlocked: true
    },
    {
      id: 'bible-memorizer',
      title: '💭 Bible Memorizer',
      description: 'Memorize and fill in the blanks of Bible verses',
      icon: '🧠',
      color: '#4A90E2',
      duration: 'Unlimited',
      unlocked: true
    }
  ]

  const handleGameComplete = (score: number) => {
    // Award stars based on score
    const starsEarned = Math.max(1, Math.floor(score / 100))
    addStars(starsEarned)

    const nextGame = activeGame ? learningFlow.unlockNextGame(activeGame) : null

    setCelebration({
      title: 'Great job! 🎉',
      message: `You scored ${score}!`,
      stars: starsEarned,
      unlockedLabel: nextGame ? prettyGameName(nextGame) : null,
    })

    // Return to game selection behind the celebration
    setActiveGame(null)
  }

  const handleBackToGames = () => {
    setActiveGame(null)
  }

  const renderActiveGame = () => {
    switch (activeGame) {
      case 'bonus': return <BonusGame onComplete={handleGameComplete} />
      case 'word-race': return <WordRace words={selectedWords} onComplete={handleGameComplete} />
      case 'memory-match': return <MemoryMatch words={selectedWords} onComplete={handleGameComplete} />
      case 'balloon-pop': return <BalloonPop words={selectedWords} onComplete={handleGameComplete} />
      case 'word-scramble': return <WordScramble words={selectedWords} onComplete={handleGameComplete} />
      case 'spell-sprint': return <SpellSprint words={selectedWords} onComplete={handleGameComplete} />
      case 'shape-catcher': return <ShapeCatcher onComplete={handleGameComplete} />
      case 'spelling-adventure': return <SpellingAdventure words={selectedWords} onComplete={handleGameComplete} />
      case 'pattern-memory': return <PatternMemory onComplete={handleGameComplete} />
      case 'rhythm-tap': return <RhythmTap onComplete={handleGameComplete} />
      case 'memory-grid': return <MemoryGrid onComplete={handleGameComplete} />
      case 'reaction-test': return <ReactionTest onComplete={handleGameComplete} />
      case 'pattern-sequencer': return <PatternSequencer onComplete={handleGameComplete} />
      case 'color-mixer': return <ColorMixer onComplete={handleGameComplete} />
      case 'math-puzzle': return <MathPuzzle onComplete={handleGameComplete} />
      case 'music-composer': return <MusicComposer onComplete={handleGameComplete} />
      case 'physics-puzzle': return <PhysicsPuzzle onComplete={handleGameComplete} />
      case 'puzzle-slider': return <PuzzleSlider onComplete={handleGameComplete} />
      case 'word-builder': return <WordBuilder words={selectedWords} onComplete={handleGameComplete} />
      case 'missing-letter': return <MissingLetter words={selectedWords} onComplete={handleGameComplete} />
      case 'spelling-check': return <SpellingCheck words={selectedWords} onComplete={handleGameComplete} />
      case 'rescue-the-bee': return <RescueTheBee words={selectedWords} onComplete={handleGameComplete} />
      case 'bible-trivia': return <BibleTriviaEnhanced onComplete={handleGameComplete} />
      case 'bible-memorizer': return <BibleMemorizer onComplete={handleGameComplete} />
      default: return null
    }
  }

  if (activeGame) {
    const gameInfo = games.find(g => g.id === activeGame)
    return (
      <div className="game-container">
        <div className="game-header-bar">
          <Button onClick={handleBackToGames} variant="secondary" size="small">
            ← Back to Games
          </Button>
          <h1>{gameInfo?.title || 'Game'}</h1>
        </div>
        {renderActiveGame()}
        <Celebration data={celebration} onClose={() => setCelebration(null)} />
      </div>
    )
  }

  return (
    <div className="game-center">
      <div className="games-header">
        <h1>🎮 Game Zone</h1>
        <p className="subtitle">Play, giggle, and earn Heavenly Stars! ⭐</p>

        <div className="stars-display">
          <div className="stars-count">
            <span className="stars-icon">⭐</span>
            <span className="stars-text">Play games to earn stars!</span>
          </div>
          <div className="games-tip">
            <span className="tip-icon">💡</span>
            <span className="tip-text">Complete daily learning to unlock more games</span>
          </div>
        </div>
      </div>

      <div className="games-grid">
        {games.map(game => (
          <div
            key={game.id}
            className={`game-card ${game.unlocked ? '' : 'locked'}`}
            style={{ '--card-color': game.color } as React.CSSProperties}
          >
            <div className="game-card-header">
              <div className="game-icon">{game.icon}</div>
              <div className="game-meta">
                <span className="game-duration">{game.duration}</span>
                {!game.unlocked && <span className="lock-icon">🔒</span>}
              </div>
            </div>

            <div className="game-card-content">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
            </div>

            <div className="game-card-footer">
              <Button
                onClick={() => game.unlocked && setActiveGame(game.id as GameMode)}
                variant={game.unlocked ? 'primary' : 'secondary'}
                disabled={!game.unlocked}
                fullWidth
              >
                {game.unlocked ? 'Play Now' : 'Locked'}
              </Button>

              {!game.unlocked && (
                <p className="unlock-requirement">
                  Complete daily learning to unlock
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="games-info">
        <div className="info-card">
          <div className="info-icon">⭐</div>
          <div className="info-content">
            <h3>Earn Stars</h3>
            <p>Play games to earn Heavenly Stars for rewards!</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">🏆</div>
          <div className="info-content">
            <h3>Achievements</h3>
            <p>Unlock badges by playing games and setting high scores!</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">📚</div>
          <div className="info-content">
            <h3>Learn & Play</h3>
            <p>Games help reinforce spelling skills in a fun way!</p>
          </div>
        </div>
      </div>

      <div className="todays-challenge">
        <h2>🏆 Today's Game Challenge</h2>
        <div className="challenge-card">
          <div className="challenge-icon">🎯</div>
          <div className="challenge-content">
            <h3>Memory Match Master</h3>
            <p>Complete 3 Memory Match games with perfect scores to earn a special sticker!</p>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '33%' }} />
              </div>
              <span className="progress-text">1/3 games</span>
            </div>
          </div>
          <Button variant="success" icon="🎮" onClick={handleStartChallenge}>
            Start Challenge
          </Button>
        </div>
      </div>

      <Celebration data={celebration} onClose={() => setCelebration(null)} />
    </div>
  )
}

export default GameCenter

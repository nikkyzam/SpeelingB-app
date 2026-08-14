import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  WordSearch,
  BeeCatch,
  WordChef,
  AbcOrder,
  TypoDetective,
  MysteryPicture,
  SecretCode,
  GhostWord,
  BibleTriviaEnhanced,
  BibleMemorizer
} from '../../components/games'
import BibleApiDashboard from '../../components/bible/BibleApiDashboard'
import Celebration, { CelebrationData } from '../../components/common/Celebration'
import './GameCenter.css'

// Off-topic mini-games (reflex/memory/art/math/music/physics) are hidden so the
// Games hub stays focused on spelling & words. Their code remains for later.
const HIDDEN_GAMES = new Set([
  'bonus', 'shape-catcher', 'pattern-memory', 'rhythm-tap', 'memory-grid',
  'reaction-test', 'pattern-sequencer', 'color-mixer', 'math-puzzle',
  'music-composer', 'physics-puzzle', 'puzzle-slider',
])

type GameMode = 
  | 'bonus' | 'word-race' | 'memory-match' | 'balloon-pop' 
  | 'word-scramble' | 'spell-sprint' | 'shape-catcher' | 'spelling-adventure'
  | 'pattern-memory' | 'rhythm-tap' | 'memory-grid' | 'reaction-test'
  | 'pattern-sequencer' | 'color-mixer' | 'math-puzzle' | 'music-composer'
  | 'physics-puzzle' | 'puzzle-slider'
  | 'word-builder' | 'missing-letter'
  | 'spelling-check' | 'rescue-the-bee'
  | 'word-search' | 'bee-catch'
  | 'word-chef' | 'abc-order'
  | 'typo-detective' | 'mystery-picture' | 'secret-code' | 'ghost-word'
  | 'bible-trivia' | 'bible-memorizer'
  | null

const GameCenter: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeGame, setActiveGame] = useState<GameMode>(null)
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  const { addStars } = useRewardStore()
  const { learningFlow } = useProgress()

  // Games practise what the child has ALREADY studied. We draw from their
  // learned words first; only if they haven't learned enough yet do we top up
  // with words from their current level so no game is left unplayable.
  const MIN_GAME_WORDS = 12

  const selectedWords = useMemo(() => {
    const shuffled = <T,>(a: T[]): T[] => [...a].sort(() => 0.5 - Math.random())
    // Games spell words letter by letter, so only plain a-z words of a sane
    // length are usable. Anything else (hyphens, accents, 1-2 letters) would
    // break a game's own filter and leave it stuck on an empty screen.
    const playable = (w: { word: string }) => /^[a-z]+$/i.test(w.word) && w.word.length >= 3

    const learned = learningFlow
      .getWordsLearnedTotal()
      .map((id) => wordBank.getWordById(id))
      .filter((w): w is NonNullable<typeof w> => !!w && playable(w))

    const difficulty = learningFlow.getDifficulty()
    const levelPool = (difficulty ? wordBank.getWordsByDifficulty(difficulty) : wordBank.getAllWords())
      .filter(playable)

    if (learned.length >= MIN_GAME_WORDS) {
      return shuffled(learned).slice(0, 60)
    }

    // Not enough studied words yet — top up from the child's level so every
    // game still has plenty to work with.
    const learnedIds = new Set(learned.map((w) => w.id))
    const filler = shuffled(levelPool.filter((w) => !learnedIds.has(w.id)))
    const combined = [...learned, ...filler].slice(0, 60)
    // Last resort: if a level somehow has nothing usable, fall back to all words.
    return combined.length > 0 ? combined : shuffled(wordBank.getAllWords().filter(playable)).slice(0, 60)
    // activeGame in deps → a fresh shuffle each time a game is opened.
  }, [learningFlow, activeGame])

  useEffect(() => {
    if (location.state && (location.state as any).startGame) {
      setActiveGame((location.state as any).startGame)
    }
  }, [location.state])

  const isGamesUnlocked = learningFlow.areGamesUnlocked()
  const quizPassed = learningFlow.isDailyQuizPassed()
  // Count words the quiz can actually ASK. Word ids are positional, so a saved
  // id could stop resolving; counting raw ids here would promise a quiz that
  // then says "no words" — leaving the games locked with no way through.
  const learnedCount = learningFlow
    .getWordsLearnedTotal()
    .filter((id) => !!wordBank.getWordById(id)).length

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
      unlocked: learningFlow.isGameUnlocked('bonus')
    },
    {
      id: 'word-race',
      title: '🏃 Word Race',
      description: 'Catch falling words before they hit the ground',
      icon: '📝',
      color: '#4ECDC4',
      duration: '60s',
      unlocked: learningFlow.isGameUnlocked('word-race')
    },
    {
      id: 'memory-match',
      title: '🧠 Memory Match',
      description: 'Match words with their meanings',
      icon: '🎴',
      color: '#FFD166',
      duration: 'Unlimited',
      unlocked: learningFlow.isGameUnlocked('memory-match')
    },
    {
      id: 'word-builder',
      title: '🧱 Word Builder',
      description: 'Tap the letters in order to build the word',
      icon: '🧱',
      color: '#8338EC',
      duration: '5 words',
      unlocked: learningFlow.isGameUnlocked('word-builder')
    },
    {
      id: 'missing-letter',
      title: '🔡 Missing Letter',
      description: 'Pick the letter that completes the word',
      icon: '🔡',
      color: '#0EA5E9',
      duration: '6 words',
      unlocked: learningFlow.isGameUnlocked('missing-letter')
    },
    {
      id: 'spelling-check',
      title: '🔍 Spelling Check',
      description: 'Hear the word, tap the correct spelling',
      icon: '🔍',
      color: '#EF476F',
      duration: '6 words',
      unlocked: learningFlow.isGameUnlocked('spelling-check')
    },
    {
      id: 'rescue-the-bee',
      title: '🐝 Rescue the Bee',
      description: 'Guess the letters to spell the word',
      icon: '🐝',
      color: '#F4A300',
      duration: '5 words',
      unlocked: learningFlow.isGameUnlocked('rescue-the-bee')
    },
    {
      id: 'word-search',
      title: '🔎 Word Search',
      description: 'Find the hidden words in the grid',
      icon: '🔎',
      color: '#06B6A4',
      duration: '5 words',
      unlocked: learningFlow.isGameUnlocked('word-search')
    },
    {
      id: 'bee-catch',
      title: '🐝 Bee Catch',
      description: 'Tap the buzzing letters in order!',
      icon: '🐝',
      color: '#FF8C42',
      duration: '60s',
      unlocked: learningFlow.isGameUnlocked('bee-catch')
    },
    {
      id: 'word-chef',
      title: '🍲 Word Chef',
      description: 'Cook up as many words as you can!',
      icon: '🍲',
      color: '#E85D75',
      duration: '90s',
      unlocked: learningFlow.isGameUnlocked('word-chef')
    },
    {
      id: 'abc-order',
      title: '🔤 ABC Order',
      description: 'Tap the words in alphabet order',
      icon: '🔤',
      color: '#7C5CFF',
      duration: '4 rounds',
      unlocked: learningFlow.isGameUnlocked('abc-order')
    },
    {
      id: 'typo-detective',
      title: '🕵️ Typo Detective',
      description: 'One word is spelled wrong — catch it!',
      icon: '🕵️',
      color: '#5B7CFA',
      duration: '5 cases',
      unlocked: learningFlow.isGameUnlocked('typo-detective')
    },
    {
      id: 'mystery-picture',
      title: '🖼️ Mystery Picture',
      description: 'Spell words to uncover a hidden picture',
      icon: '🖼️',
      color: '#20C997',
      duration: '6 words',
      unlocked: learningFlow.isGameUnlocked('mystery-picture')
    },
    {
      id: 'secret-code',
      title: '🔐 Secret Code',
      description: 'Crack the number code to find the word',
      icon: '🔐',
      color: '#845EF7',
      duration: '5 codes',
      unlocked: learningFlow.isGameUnlocked('secret-code')
    },
    {
      id: 'ghost-word',
      title: '👻 Ghost Word',
      description: 'It vanishes! Type it from memory',
      icon: '👻',
      color: '#748FFC',
      duration: '5 words',
      unlocked: learningFlow.isGameUnlocked('ghost-word')
    },
    {
      id: 'balloon-pop',
      title: '🎈 Balloon Pop',
      description: 'Pop balloons in order to spell words',
      icon: '💥',
      color: '#06D6A0',
      duration: '3 words',
      unlocked: learningFlow.isGameUnlocked('balloon-pop')
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
      unlocked: learningFlow.isGameUnlocked('word-scramble')
    },
    {
      id: 'bible-memorizer',
      title: '💭 Bible Memorizer',
      description: 'Memorize and fill in the blanks of Bible verses',
      icon: '🧠',
      color: '#4A90E2',
      duration: 'Unlimited',
      unlocked: learningFlow.isGameUnlocked('bible-memorizer')
    }
  ]

  const handleGameComplete = (score: number) => {
    // Award stars based on score
    const starsEarned = Math.max(1, Math.floor(score / 100))
    addStars(starsEarned)

    setCelebration({
      title: 'Great job! 🎉',
      message: `You scored ${score}!`,
      stars: starsEarned,
    })

    // Return to game selection behind the celebration
    setActiveGame(null)
  }

  const handleBackToGames = () => {
    setActiveGame(null)
  }

  // How many visible games are still behind today's quiz.
  const lockedCount = games.filter((g) => !HIDDEN_GAMES.has(g.id) && !g.unlocked).length

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
      case 'word-search': return <WordSearch words={selectedWords} onComplete={handleGameComplete} />
      case 'bee-catch': return <BeeCatch words={selectedWords} onComplete={handleGameComplete} />
      case 'word-chef': return <WordChef words={selectedWords} onComplete={handleGameComplete} />
      case 'abc-order': return <AbcOrder words={selectedWords} onComplete={handleGameComplete} />
      case 'typo-detective': return <TypoDetective words={selectedWords} onComplete={handleGameComplete} />
      case 'mystery-picture': return <MysteryPicture words={selectedWords} onComplete={handleGameComplete} />
      case 'secret-code': return <SecretCode words={selectedWords} onComplete={handleGameComplete} />
      case 'ghost-word': return <GhostWord words={selectedWords} onComplete={handleGameComplete} />
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
            <span className="tip-text">
              {quizPassed
                ? 'Today’s quiz is done — every game is unlocked!'
                : 'Pass today’s quiz to unlock every game'}
            </span>
          </div>
        </div>
      </div>

      {/* The daily gate: spell every word you've learned to open all the games. */}
      <div className={`daily-gate ${quizPassed ? 'done' : ''}`}>
        <div className="daily-gate-icon" aria-hidden>{quizPassed ? '🏆' : '🔒'}</div>
        <div className="daily-gate-text">
          <h3>{quizPassed ? 'All games unlocked today!' : 'Today’s Quiz'}</h3>
          <p>
            {quizPassed
              ? 'Great work — come back tomorrow for a new quiz.'
              : learnedCount === 0
                ? 'Learn some words first, then take the quiz to open every game.'
                : `Spell all ${learnedCount} of your words to unlock ${lockedCount} more games.`}
          </p>
        </div>
        {!quizPassed && (
          <Button
            variant="primary"
            icon="🏆"
            onClick={() => navigate(learnedCount === 0 ? '/learn' : '/daily-quiz')}
          >
            {learnedCount === 0 ? 'Learn Words' : 'Start Quiz'}
          </Button>
        )}
      </div>

      <div className="games-grid">
        {games.filter(game => !HIDDEN_GAMES.has(game.id)).map(game => (
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

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRewardStore } from '../../stores/rewards/useRewardStore'
import { useProgress } from '../../contexts/ProgressContext'
import { wordBank } from '../../services/wordBank'
import GameStats, {
  GAME_STATS_EVENT,
  DAILY_CHALLENGE_TARGET,
  DAILY_CHALLENGE_REWARD,
} from '../../services/games/GameStats'
import { AchievementsService } from '../../services/rewards/AchievementsService'
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
  WordSnake,
  DragonDuel,
  WordWhack,
  WordFishing,
  RhymeTime,
  SpellTower,
  WordSort,
  ParrotParty,
  SillyStory,
  TreasureTrail,
  HomophoneHero,
  WordFamily,
  SyllableClap,
  DefinitionDetective,
  PrizeWheel,
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
  | 'word-snake' | 'dragon-duel' | 'word-whack' | 'word-fishing' | 'rhyme-time'
  | 'spell-tower' | 'word-sort' | 'parrot-party' | 'silly-story' | 'treasure-trail'
  | 'homophone-hero' | 'word-family' | 'syllable-clap' | 'definition-detective'
  | 'bible-trivia' | 'bible-memorizer'
  | null

/** How the hub groups games so a child can find the kind of play they're after. */
type Category = 'spelling' | 'listen' | 'arcade' | 'think' | 'bible'

interface GameCard {
  id: string
  title: string
  description: string
  icon: string
  color: string
  duration: string
  category: Category
  /** freshly added — flagged in the grid until the child opens it once */
  isNew?: boolean
  unlocked: boolean
}

const FILTERS: { id: Category | 'all' | 'favorites'; label: string; icon: string }[] = [
  { id: 'all', label: 'All games', icon: '🎮' },
  { id: 'favorites', label: 'Favorites', icon: '⭐' },
  { id: 'spelling', label: 'Spelling', icon: '✏️' },
  { id: 'listen', label: 'Listening', icon: '👂' },
  { id: 'arcade', label: 'Arcade', icon: '🕹️' },
  { id: 'think', label: 'Puzzles', icon: '🧠' },
  { id: 'bible', label: 'Bible', icon: '✝️' },
]

const GameCenter: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeGame, setActiveGame] = useState<GameMode>(null)
  const [celebration, setCelebration] = useState<CelebrationData | null>(null)
  const [filter, setFilter] = useState<Category | 'all' | 'favorites'>('all')
  // Bumped whenever a best score, favourite or daily play is written, so the
  // cards below always show what actually happened.
  const [statsTick, setStatsTick] = useState(0)
  const { addStars } = useRewardStore()
  const { learningFlow } = useProgress()

  useEffect(() => {
    const bump = () => setStatsTick((t) => t + 1)
    window.addEventListener(GAME_STATS_EVENT, bump)
    return () => window.removeEventListener(GAME_STATS_EVENT, bump)
  }, [])

  const bests = useMemo(() => GameStats.getAllBests(), [statsTick])
  const favorites = useMemo(() => GameStats.getFavorites(), [statsTick])
  const challenge = useMemo(() => GameStats.getDailyChallenge(), [statsTick])
  const seen = useMemo(() => GameStats.getSeen(), [statsTick])
  const gridRef = useRef<HTMLDivElement>(null)

  // Games practise what the child has ALREADY studied — nothing else. Feeding a
  // game words a child has never met turns practice into a guessing exercise
  // and pollutes the review scheduler with words they were never taught.
  const MIN_GAME_WORDS = 4

  const selectedWords = useMemo(() => {
    const shuffled = <T,>(a: T[]): T[] => [...a].sort(() => 0.5 - Math.random())
    // Games spell words letter by letter, so only plain a-z words of a sane
    // length are usable. Anything else (hyphens, accents, 1-2 letters) would
    // break a game's own filter and leave it stuck on an empty screen.
    const playable = (w: { word: string }) => /^[a-z]+$/i.test(w.word) && w.word.length >= 3

    // Everything the child has actually studied: met in a lesson, or spelled.
    const studiedIds = new Set([
      ...learningFlow.getWordsLearnedTotal(),
      ...learningFlow.getWordsSpelledTotal(),
    ])

    const studied = [...studiedIds]
      .map((id) => wordBank.getWordById(id))
      .filter((w): w is NonNullable<typeof w> => !!w && playable(w))

    // No top-up from the wider bank: if they have not learned enough words yet,
    // the hub keeps the games shut rather than handing over strangers.
    return shuffled(studied).slice(0, 60)
    // activeGame in deps → a fresh shuffle each time a game is opened.
  }, [learningFlow, activeGame])

  useEffect(() => {
    if (location.state && (location.state as any).startGame) {
      setActiveGame((location.state as any).startGame)
    }
  }, [location.state])

  const quizPassed = learningFlow.isDailyQuizPassed()
  // Count words the quiz can actually ASK. Word ids are positional, so a saved
  // id could stop resolving; counting raw ids here would promise a quiz that
  // then says "no words" — leaving the games locked with no way through.
  const learnedCount = learningFlow
    .getWordsLearnedTotal()
    .filter((id) => !!wordBank.getWordById(id)).length

  // Enough studied words to fill a game? Bible and reflex games don't use the
  // word list, so they are never gated on it.
  const enoughWords = selectedWords.length >= MIN_GAME_WORDS
  const wordlessGames = new Set([
    'bible-trivia', 'bible-memorizer', 'bonus', 'shape-catcher', 'pattern-memory',
    'rhythm-tap', 'memory-grid', 'reaction-test', 'pattern-sequencer', 'color-mixer',
    'math-puzzle', 'music-composer', 'physics-puzzle', 'puzzle-slider',
    'homophone-hero', 'word-family',
  ])

  const rawGames: GameCard[] = [
    {
      id: 'bonus',
      title: '🎁 Bonus Game',
      description: 'Tap everything! 15 seconds of fun',
      icon: '🎯',
      color: '#FF6B6B',
      duration: '15s',
      category: 'arcade' as Category,
      unlocked: learningFlow.isGameUnlocked('bonus')
    },
    {
      id: 'word-race',
      title: '🏃 Word Race',
      description: 'Catch falling words before they hit the ground',
      icon: '📝',
      color: '#4ECDC4',
      duration: '60s',
      category: 'arcade' as Category,
      unlocked: learningFlow.isGameUnlocked('word-race')
    },
    {
      id: 'memory-match',
      title: '🧠 Memory Match',
      description: 'Match words with their meanings',
      icon: '🎴',
      color: '#FFD166',
      duration: 'Unlimited',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('memory-match')
    },
    {
      id: 'word-builder',
      title: '🧱 Word Builder',
      description: 'Tap the letters in order to build the word',
      icon: '🧱',
      color: '#8338EC',
      duration: '5 words',
      category: 'spelling' as Category,
      unlocked: learningFlow.isGameUnlocked('word-builder')
    },
    {
      id: 'missing-letter',
      title: '🔡 Missing Letter',
      description: 'Pick the letter that completes the word',
      icon: '🔡',
      color: '#0EA5E9',
      duration: '6 words',
      category: 'spelling' as Category,
      unlocked: learningFlow.isGameUnlocked('missing-letter')
    },
    {
      id: 'spelling-check',
      title: '🔍 Spelling Check',
      description: 'Hear the word, tap the correct spelling',
      icon: '🔍',
      color: '#EF476F',
      duration: '6 words',
      category: 'listen' as Category,
      unlocked: learningFlow.isGameUnlocked('spelling-check')
    },
    {
      id: 'rescue-the-bee',
      title: '🐝 Rescue the Bee',
      description: 'Guess the letters to spell the word',
      icon: '🐝',
      color: '#F4A300',
      duration: '5 words',
      category: 'spelling' as Category,
      unlocked: learningFlow.isGameUnlocked('rescue-the-bee')
    },
    {
      id: 'word-search',
      title: '🔎 Word Search',
      description: 'Find the hidden words in the grid',
      icon: '🔎',
      color: '#06B6A4',
      duration: '5 words',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('word-search')
    },
    {
      id: 'bee-catch',
      title: '🐝 Bee Catch',
      description: 'Tap the buzzing letters in order!',
      icon: '🐝',
      color: '#FF8C42',
      duration: '60s',
      category: 'arcade' as Category,
      unlocked: learningFlow.isGameUnlocked('bee-catch')
    },
    {
      id: 'word-chef',
      title: '🍲 Word Chef',
      description: 'Cook up as many words as you can!',
      icon: '🍲',
      color: '#E85D75',
      duration: '90s',
      category: 'spelling' as Category,
      unlocked: learningFlow.isGameUnlocked('word-chef')
    },
    {
      id: 'abc-order',
      title: '🔤 ABC Order',
      description: 'Tap the words in alphabet order',
      icon: '🔤',
      color: '#7C5CFF',
      duration: '4 rounds',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('abc-order')
    },
    {
      id: 'typo-detective',
      title: '🕵️ Typo Detective',
      description: 'One word is spelled wrong — catch it!',
      icon: '🕵️',
      color: '#5B7CFA',
      duration: '5 cases',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('typo-detective')
    },
    {
      id: 'mystery-picture',
      title: '🖼️ Mystery Picture',
      description: 'Spell words to uncover a hidden picture',
      icon: '🖼️',
      color: '#20C997',
      duration: '6 words',
      category: 'spelling' as Category,
      unlocked: learningFlow.isGameUnlocked('mystery-picture')
    },
    {
      id: 'secret-code',
      title: '🔐 Secret Code',
      description: 'Crack the number code to find the word',
      icon: '🔐',
      color: '#845EF7',
      duration: '5 codes',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('secret-code')
    },
    {
      id: 'ghost-word',
      title: '👻 Ghost Word',
      description: 'It vanishes! Type it from memory',
      icon: '👻',
      color: '#748FFC',
      duration: '5 words',
      category: 'spelling' as Category,
      unlocked: learningFlow.isGameUnlocked('ghost-word')
    },
    {
      id: 'word-snake',
      title: '🐍 Word Snake',
      description: 'Slither around and eat the letters in order',
      icon: '🐍',
      color: '#3AB795',
      duration: '90s',
      category: 'arcade' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('word-snake')
    },
    {
      id: 'dragon-duel',
      title: '🐉 Dragon Duel',
      description: 'Spell to attack — can you tame the dragon?',
      icon: '🐉',
      color: '#E03131',
      duration: 'Boss fight',
      category: 'spelling' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('dragon-duel')
    },
    {
      id: 'word-whack',
      title: '🔨 Word Whack',
      description: 'Bonk the bugs holding misspelled words!',
      icon: '🔨',
      color: '#FF922B',
      duration: '45s',
      category: 'arcade' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('word-whack')
    },
    {
      id: 'word-fishing',
      title: '🎣 Word Fishing',
      description: 'Hook the fish with the missing word ending',
      icon: '🎣',
      color: '#1C7ED6',
      duration: '6 words',
      category: 'listen' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('word-fishing')
    },
    {
      id: 'rhyme-time',
      title: '🎤 Rhyme Time',
      description: 'Find the word that rhymes — use your ears!',
      icon: '🎤',
      color: '#BE4BDB',
      duration: '6 rounds',
      category: 'listen' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('rhyme-time')
    },
    {
      id: 'spell-tower',
      title: '🏰 Spell Tower',
      description: 'Every word you spell builds another floor',
      icon: '🏰',
      color: '#F59F00',
      duration: '8 floors',
      category: 'spelling' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('spell-tower')
    },
    {
      id: 'word-sort',
      title: '🧺 Word Sort',
      description: 'Drop each word in the basket where it belongs',
      icon: '🧺',
      color: '#12B886',
      duration: '10 words',
      category: 'think' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('word-sort')
    },
    {
      id: 'parrot-party',
      title: '🦜 Parrot Party',
      description: 'Polly says… now say the words back in order!',
      icon: '🦜',
      color: '#40C057',
      duration: '6 rounds',
      category: 'listen' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('parrot-party')
    },
    {
      id: 'silly-story',
      title: '📜 Silly Story',
      description: 'Fill the blanks and make a giggly story',
      icon: '📜',
      color: '#FA5252',
      duration: '4 blanks',
      category: 'think' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('silly-story')
    },
    {
      id: 'treasure-trail',
      title: '🗺️ Treasure Trail',
      description: 'Roll the dice, solve puzzles, find the treasure',
      icon: '🗺️',
      color: '#D6336C',
      duration: '12 steps',
      category: 'think' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('treasure-trail')
    },
    {
      id: 'homophone-hero',
      title: '🦸 Homophone Hero',
      description: 'Their or there? Pick the right one and learn the trick',
      icon: '🦸',
      color: '#4C6EF5',
      duration: '6 rounds',
      category: 'spelling' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('homophone-hero')
    },
    {
      id: 'word-family',
      title: '🏭 Word Family Factory',
      description: 'Build a whole family of words from one ending',
      icon: '🏭',
      color: '#0CA678',
      duration: '3 families',
      category: 'spelling' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('word-family')
    },
    {
      id: 'syllable-clap',
      title: '👏 Syllable Clap',
      description: 'Clap out the beats hiding inside a long word',
      icon: '👏',
      color: '#F76707',
      duration: '6 words',
      category: 'listen' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('syllable-clap')
    },
    {
      id: 'definition-detective',
      title: '🕵️ Definition Detective',
      description: 'Read the clue and work out which word it means',
      icon: '🕵️',
      color: '#7048E8',
      duration: '6 cases',
      category: 'think' as Category,
      isNew: true,
      unlocked: learningFlow.isGameUnlocked('definition-detective')
    },
    {
      id: 'balloon-pop',
      title: '🎈 Balloon Pop',
      description: 'Pop balloons in order to spell words',
      icon: '💥',
      color: '#06D6A0',
      duration: '3 words',
      category: 'arcade' as Category,
      unlocked: learningFlow.isGameUnlocked('balloon-pop')
    },
    {
      id: 'word-scramble',
      title: '🔤 Word Scramble',
      description: 'Unscramble letters to form words',
      icon: '🌀',
      color: '#118AB2',
      duration: '45s',
      category: 'spelling' as Category,
      unlocked: learningFlow.isGameUnlocked('word-scramble')
    },
    {
      id: 'spell-sprint',
      title: '🏃‍♂️ Spell Sprint',
      description: 'Spell as many words as possible',
      icon: '🏃‍♂️',
      color: '#8338EC',
      duration: '60s',
      category: 'spelling' as Category,
      unlocked: learningFlow.isGameUnlocked('spell-sprint')
    },
    {
      id: 'shape-catcher',
      title: '🔺 Shape Catcher',
      description: 'Catch target shapes (non-spelling)',
      icon: '🎮',
      color: '#FF006E',
      duration: '60s',
      category: 'arcade' as Category,
      unlocked: learningFlow.isGameUnlocked('shape-catcher')
    },
    {
      id: 'spelling-adventure',
      title: '🗺️ Spelling Adventure',
      description: '3D exploration and learning game',
      icon: '🌟',
      color: '#FB5607',
      duration: 'Adventure',
      category: 'arcade' as Category,
      unlocked: learningFlow.isGameUnlocked('spelling-adventure')
    },
    {
      id: 'pattern-memory',
      title: '🧩 Pattern Memory',
      description: 'Remember and repeat the pattern',
      icon: '🧩',
      color: '#FF9F1C',
      duration: '60s',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('pattern-memory')
    },
    {
      id: 'rhythm-tap',
      title: '🎵 Rhythm Tap',
      description: 'Tap in rhythm with the music',
      icon: '🎵',
      color: '#2EC4B6',
      duration: '60s',
      category: 'arcade' as Category,
      unlocked: learningFlow.isGameUnlocked('rhythm-tap')
    },
    {
      id: 'memory-grid',
      title: '🔢 Memory Grid',
      description: 'Find the matching pairs in the grid',
      icon: '🔢',
      color: '#E71D36',
      duration: '90s',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('memory-grid')
    },
    {
      id: 'reaction-test',
      title: '⚡ Reaction Test',
      description: 'Test your reaction speed',
      icon: '⚡',
      color: '#FF9F1C',
      duration: '30s',
      category: 'arcade' as Category,
      unlocked: learningFlow.isGameUnlocked('reaction-test')
    },
    {
      id: 'pattern-sequencer',
      title: '🧬 Pattern Sequencer',
      description: 'Complete the logical sequence',
      icon: '🧬',
      color: '#7209B7',
      duration: '120s',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('pattern-sequencer')
    },
    {
      id: 'color-mixer',
      title: '🎨 Color Mixer',
      description: 'Mix colors to match the target',
      icon: '🎨',
      color: '#3A86FF',
      duration: '60s',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('color-mixer')
    },
    {
      id: 'math-puzzle',
      title: '➕ Math Puzzle',
      description: 'Solve simple math problems',
      icon: '➕',
      color: '#8AC926',
      duration: '60s',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('math-puzzle')
    },
    {
      id: 'music-composer',
      title: '🎹 Music Composer',
      description: 'Create your own melodies',
      icon: '🎹',
      color: '#FFCA3A',
      duration: 'Unlimited',
      category: 'arcade' as Category,
      unlocked: learningFlow.isGameUnlocked('music-composer')
    },
    {
      id: 'physics-puzzle',
      title: '⚙️ Physics Puzzle',
      description: 'Use physics to solve the puzzle',
      icon: '⚙️',
      color: '#1982C4',
      duration: '120s',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('physics-puzzle')
    },
    {
      id: 'puzzle-slider',
      title: '🖼️ Puzzle Slider',
      description: 'Slide tiles to complete the image',
      icon: '🖼️',
      color: '#6A4C93',
      duration: '180s',
      category: 'think' as Category,
      unlocked: learningFlow.isGameUnlocked('puzzle-slider')
    },
    {
      id: 'bible-trivia',
      title: '📖 Bible Trivia',
      description: 'Test your knowledge of the Bible',
      icon: '✝️',
      color: '#FFD700',
      duration: 'Unlimited',
      category: 'bible' as Category,
      unlocked: learningFlow.isGameUnlocked('word-scramble')
    },
    {
      id: 'bible-memorizer',
      title: '💭 Bible Memorizer',
      description: 'Memorize and fill in the blanks of Bible verses',
      icon: '🧠',
      color: '#4A90E2',
      duration: 'Unlimited',
      category: 'bible' as Category,
      unlocked: learningFlow.isGameUnlocked('bible-memorizer')
    }
  ]

  // A word game with nothing of the child's to practise would have to invent
  // words, so it stays shut until they have studied a few.
  const games: GameCard[] = rawGames.map((g) =>
    wordlessGames.has(g.id) ? g : { ...g, unlocked: g.unlocked && enoughWords }
  )

  const handleGameComplete = (score: number) => {
    const finishedId = activeGame

    // Award stars based on score
    const starsEarned = Math.max(1, Math.floor(score / 100))
    addStars(starsEarned)

    let newBest = false
    if (finishedId) {
      newBest = GameStats.recordScore(finishedId, score).isNewBest
      GameStats.recordDailyPlay(finishedId)
      // Counts towards the "play lots of different games" badge.
      AchievementsService.recordGamePlayed(finishedId)
    }

    setCelebration({
      title: newBest ? '🏆 New best score!' : 'Great job! 🎉',
      message: newBest
        ? `${score} points — that's your best ever at this game!`
        : `You scored ${score}!`,
      stars: starsEarned,
    })

    // Return to game selection behind the celebration
    setActiveGame(null)
  }

  const openGame = (id: string) => {
    GameStats.markSeen(id)
    setActiveGame(id as GameMode)
  }

  const toggleFavorite = (id: string) => {
    GameStats.toggleFavorite(id)
  }

  const claimChallenge = () => {
    if (!GameStats.claimDailyChallenge()) return
    addStars(DAILY_CHALLENGE_REWARD)
    setCelebration({
      title: 'Daily challenge complete! 🏅',
      message: `You played ${DAILY_CHALLENGE_TARGET} different games today!`,
      stars: DAILY_CHALLENGE_REWARD,
    })
  }

  const handleBackToGames = () => {
    setActiveGame(null)
  }

  const visibleGames = games.filter((g) => !HIDDEN_GAMES.has(g.id))

  // How many visible games are still behind today's quiz.
  const lockedCount = visibleGames.filter((g) => !g.unlocked).length

  // Favourites float to the top, then anything brand new, then the usual order.
  const shownGames = visibleGames
    .filter((g) => {
      if (filter === 'all') return true
      if (filter === 'favorites') return favorites.includes(g.id)
      return g.category === filter
    })
    .map((g, i) => ({ ...g, order: i }))
    .sort((a, b) => {
      const fav = Number(favorites.includes(b.id)) - Number(favorites.includes(a.id))
      if (fav !== 0) return fav
      const fresh = Number(!!b.isNew) - Number(!!a.isNew)
      if (fresh !== 0) return fresh
      return a.order - b.order
    })

  const challengeProgress = Math.min(challenge.games.length, DAILY_CHALLENGE_TARGET)
  const challengeDone = challengeProgress >= DAILY_CHALLENGE_TARGET

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
      case 'word-snake': return <WordSnake words={selectedWords} onComplete={handleGameComplete} />
      case 'dragon-duel': return <DragonDuel words={selectedWords} onComplete={handleGameComplete} />
      case 'word-whack': return <WordWhack words={selectedWords} onComplete={handleGameComplete} />
      case 'word-fishing': return <WordFishing words={selectedWords} onComplete={handleGameComplete} />
      case 'rhyme-time': return <RhymeTime words={selectedWords} onComplete={handleGameComplete} />
      case 'spell-tower': return <SpellTower words={selectedWords} onComplete={handleGameComplete} />
      case 'word-sort': return <WordSort words={selectedWords} onComplete={handleGameComplete} />
      case 'parrot-party': return <ParrotParty words={selectedWords} onComplete={handleGameComplete} />
      case 'silly-story': return <SillyStory words={selectedWords} onComplete={handleGameComplete} />
      case 'treasure-trail': return <TreasureTrail words={selectedWords} onComplete={handleGameComplete} />
      case 'homophone-hero': return <HomophoneHero onComplete={handleGameComplete} />
      case 'word-family': return <WordFamily onComplete={handleGameComplete} />
      case 'syllable-clap': return <SyllableClap words={selectedWords} onComplete={handleGameComplete} />
      case 'definition-detective': return <DefinitionDetective words={selectedWords} onComplete={handleGameComplete} />
      case 'bible-trivia': return <BibleTriviaEnhanced onComplete={handleGameComplete} />
      case 'bible-memorizer': return <BibleMemorizer onComplete={handleGameComplete} />
      default: return null
    }
  }

  if (activeGame) {
    const gameInfo = games.find(g => g.id === activeGame)
    const best = bests[activeGame] || 0
    return (
      <div className="game-container">
        <div className="game-header-bar">
          <Button onClick={handleBackToGames} variant="secondary" size="small">
            ← Back to Games
          </Button>
          <h1>{gameInfo?.title || 'Game'}</h1>
          {best > 0 && <span className="game-best-chip">🏆 Best: {best}</span>}
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

      {/* A free spin every day — the reason to open the app tomorrow. */}
      <PrizeWheel />

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

      {/* Pick the kind of play you're in the mood for. */}
      <div className="games-filters" role="tablist" aria-label="Game categories">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            className={`filter-chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            <span aria-hidden>{f.icon}</span> {f.label}
            {f.id === 'favorites' && favorites.length > 0 && (
              <span className="filter-count">{favorites.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="games-grid" ref={gridRef}>
        {shownGames.map(game => {
          const best = bests[game.id] || 0
          const isFavorite = favorites.includes(game.id)
          return (
            <div
              key={game.id}
              className={`game-card ${game.unlocked ? '' : 'locked'}`}
              style={{ '--card-color': game.color } as React.CSSProperties}
            >
              <div className="game-card-header">
                <div className="game-icon">{game.icon}</div>
                <div className="game-meta">
                  {game.isNew && !seen.includes(game.id) && <span className="new-badge">NEW</span>}
                  <span className="game-duration">{game.duration}</span>
                  {!game.unlocked && <span className="lock-icon">🔒</span>}
                  <button
                    className={`fav-btn ${isFavorite ? 'on' : ''}`}
                    onClick={() => toggleFavorite(game.id)}
                    aria-label={isFavorite ? `Remove ${game.title} from favorites` : `Add ${game.title} to favorites`}
                    aria-pressed={isFavorite}
                    title="Favorite"
                  >
                    {isFavorite ? '⭐' : '☆'}
                  </button>
                </div>
              </div>

              <div className="game-card-content">
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                {best > 0 && <p className="game-best">🏆 Your best: <strong>{best}</strong></p>}
              </div>

              <div className="game-card-footer">
                <Button
                  onClick={() => game.unlocked && openGame(game.id)}
                  variant={game.unlocked ? 'primary' : 'secondary'}
                  disabled={!game.unlocked}
                  fullWidth
                >
                  {game.unlocked ? (best > 0 ? 'Beat your best!' : 'Play Now') : 'Locked'}
                </Button>

                {!game.unlocked && (
                  <p className="unlock-requirement">
                    {!wordlessGames.has(game.id) && !enoughWords
                      ? `Learn ${MIN_GAME_WORDS - selectedWords.length} more word${MIN_GAME_WORDS - selectedWords.length === 1 ? '' : 's'} to play`
                      : 'Complete daily learning to unlock'}
                  </p>
                )}
              </div>
            </div>
          )
        })}

        {shownGames.length === 0 && (
          <p className="games-empty">
            {filter === 'favorites'
              ? 'No favorites yet — tap the ☆ on a game to pin it here!'
              : 'No games in this group yet.'}
          </p>
        )}
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
            <h3>Beat Your Best</h3>
            <p>Every game remembers your top score. Can you beat it?</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">📚</div>
          <div className="info-content">
            <h3>Learn &amp; Play</h3>
            <p>Games help reinforce spelling skills in a fun way!</p>
          </div>
        </div>
      </div>

      {/* Real progress, counted from the games actually finished today. */}
      <div className="todays-challenge">
        <h2>🏆 Today&apos;s Game Challenge</h2>
        <div className="challenge-card">
          <div className="challenge-icon">{challengeDone ? '🎉' : '🎯'}</div>
          <div className="challenge-content">
            <h3>Play {DAILY_CHALLENGE_TARGET} different games</h3>
            <p>
              {challenge.claimed
                ? 'Reward claimed — brilliant playing today!'
                : challengeDone
                  ? `You did it! Claim your ${DAILY_CHALLENGE_REWARD} bonus stars.`
                  : `Finish ${DAILY_CHALLENGE_TARGET - challengeProgress} more to earn ${DAILY_CHALLENGE_REWARD} bonus stars!`}
            </p>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(challengeProgress / DAILY_CHALLENGE_TARGET) * 100}%` }}
                />
              </div>
              <span className="progress-text">{challengeProgress}/{DAILY_CHALLENGE_TARGET} games</span>
            </div>
          </div>
          <Button
            variant="success"
            icon={challengeDone && !challenge.claimed ? '⭐' : '🎮'}
            // Never launches a game directly — some are still behind today's
            // quiz, so we point at the grid and let the cards do the gating.
            onClick={() =>
              challengeDone && !challenge.claimed
                ? claimChallenge()
                : gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            disabled={challenge.claimed}
          >
            {challenge.claimed ? 'Claimed' : challengeDone ? 'Claim stars' : 'Pick a game'}
          </Button>
        </div>
      </div>

      <Celebration data={celebration} onClose={() => setCelebration(null)} />
    </div>
  )
}

export default GameCenter

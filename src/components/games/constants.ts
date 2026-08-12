export const GAME_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const

export const GAME_CATEGORIES = {
  SPELLING: 'spelling',
  VOCABULARY: 'vocabulary',
  GRAMMAR: 'grammar',
  READING: 'reading',
  WRITING: 'writing'
} as const

export const GAME_DURATIONS = {
  SHORT: 30,
  MEDIUM: 60,
  LONG: 120,
  EXTENDED: 300
} as const

export const GAME_CONFIGS = {
  WORD_SCRAMBLE: {
    id: 'word-scramble',
    name: 'Word Scramble',
    description: 'Unscramble letters to form words',
    icon: '🔤',
    category: 'spelling',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM, GAME_DIFFICULTY.HARD],
    estimatedTime: 45,
    minPlayers: 1,
    maxPlayers: 1
  },
  SPELL_SPRINT: {
    id: 'spell-sprint',
    name: 'Spell Sprint',
    description: 'Spell words as fast as you can',
    icon: '⚡',
    category: 'spelling',
    difficulty: [GAME_DIFFICULTY.MEDIUM, GAME_DIFFICULTY.HARD],
    estimatedTime: 60,
    minPlayers: 1,
    maxPlayers: 4
  },
  SHAPE_CATCHER: {
    id: 'shape-catcher',
    name: 'Shape Catcher',
    description: 'Catch shapes with correct letters',
    icon: '🔺',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM],
    estimatedTime: 60,
    minPlayers: 1,
    maxPlayers: 1
  },
  SPELLING_ADVENTURE: {
    id: 'spelling-adventure',
    name: 'Spelling Adventure',
    description: 'Embark on a spelling adventure through levels',
    icon: '🗺️',
    category: 'spelling',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM, GAME_DIFFICULTY.HARD],
    estimatedTime: 180,
    minPlayers: 1,
    maxPlayers: 1
  },
  WORD_SEARCH: {
    id: 'word-search',
    name: 'Word Search',
    description: 'Find hidden words in a grid',
    icon: '🔍',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM],
    estimatedTime: 90,
    minPlayers: 1,
    maxPlayers: 1
  },
  VOCABULARY_RACE: {
    id: 'vocabulary-race',
    name: 'Vocabulary Race',
    description: 'Race against time to match words with definitions',
    icon: '🏎️',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.MEDIUM, GAME_DIFFICULTY.HARD],
    estimatedTime: 75,
    minPlayers: 1,
    maxPlayers: 4
  },
  MISSING_LETTERS: {
    id: 'missing-letters',
    name: 'Missing Letters',
    description: 'Fill in the missing letters in words',
    icon: '❓',
    category: 'spelling',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM],
    estimatedTime: 45,
    minPlayers: 1,
    maxPlayers: 1
  },
  WORD_MATCH: {
    id: 'word-match',
    name: 'Word Match',
    description: 'Match words with their definitions',
    icon: '🔄',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM, GAME_DIFFICULTY.HARD],
    estimatedTime: 60,
    minPlayers: 1,
    maxPlayers: 2
  },
  PATTERN_MEMORY: {
    id: 'pattern-memory',
    name: 'Pattern Memory',
    description: 'Remember and repeat the pattern',
    icon: '🧩',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM],
    estimatedTime: 60,
    minPlayers: 1,
    maxPlayers: 1
  },
  RHYTHM_TAP: {
    id: 'rhythm-tap',
    name: 'Rhythm Tap',
    description: 'Tap in rhythm with the music',
    icon: '🎵',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM],
    estimatedTime: 60,
    minPlayers: 1,
    maxPlayers: 1
  },
  MEMORY_GRID: {
    id: 'memory-grid',
    name: 'Memory Grid',
    description: 'Find the matching pairs in the grid',
    icon: '🔢',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM],
    estimatedTime: 90,
    minPlayers: 1,
    maxPlayers: 1
  },
  REACTION_TEST: {
    id: 'reaction-test',
    name: 'Reaction Test',
    description: 'Test your reaction speed',
    icon: '⚡',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM],
    estimatedTime: 30,
    minPlayers: 1,
    maxPlayers: 1
  },
  PATTERN_SEQUENCER: {
    id: 'pattern-sequencer',
    name: 'Pattern Sequencer',
    description: 'Complete the logical sequence',
    icon: '🧬',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.MEDIUM, GAME_DIFFICULTY.HARD],
    estimatedTime: 120,
    minPlayers: 1,
    maxPlayers: 1
  },
  COLOR_MIXER: {
    id: 'color-mixer',
    name: 'Color Mixer',
    description: 'Mix colors to match the target',
    icon: '🎨',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM],
    estimatedTime: 60,
    minPlayers: 1,
    maxPlayers: 1
  },
  MATH_PUZZLE: {
    id: 'math-puzzle',
    name: 'Math Puzzle',
    description: 'Solve simple math problems',
    icon: '➕',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM],
    estimatedTime: 60,
    minPlayers: 1,
    maxPlayers: 1
  },
  MUSIC_COMPOSER: {
    id: 'music-composer',
    name: 'Music Composer',
    description: 'Create your own melodies',
    icon: '🎹',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.EASY, GAME_DIFFICULTY.MEDIUM],
    estimatedTime: 180,
    minPlayers: 1,
    maxPlayers: 1
  },
  PHYSICS_PUZZLE: {
    id: 'physics-puzzle',
    name: 'Physics Puzzle',
    description: 'Use physics to solve the puzzle',
    icon: '⚙️',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.MEDIUM, GAME_DIFFICULTY.HARD],
    estimatedTime: 120,
    minPlayers: 1,
    maxPlayers: 1
  },
  PUZZLE_SLIDER: {
    id: 'puzzle-slider',
    name: 'Puzzle Slider',
    description: 'Slide tiles to complete the image',
    icon: '🖼️',
    category: 'vocabulary',
    difficulty: [GAME_DIFFICULTY.MEDIUM, GAME_DIFFICULTY.HARD],
    estimatedTime: 180,
    minPlayers: 1,
    maxPlayers: 1
  }
} as const

export const SCORING_RULES = {
  BASE_SCORE: 10,
  TIME_BONUS_MULTIPLIER: 0.1,
  STREAK_BONUS_MULTIPLIER: 0.2,
  ACCURACY_BONUS_MULTIPLIER: 0.5,
  PERFECT_GAME_BONUS: 100,
  COMBO_BONUS: 5
} as const

export const GAME_THEMES = {
  DEFAULT: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFD166',
    background: '#1A1A2E',
    text: '#FFFFFF'
  },
  FOREST: {
    primary: '#2E8B57',
    secondary: '#8FBC8F',
    accent: '#FFD700',
    background: '#0A3D2F',
    text: '#FFFFFF'
  },
  OCEAN: {
    primary: '#1E90FF',
    secondary: '#87CEEB',
    accent: '#FF69B4',
    background: '#00008B',
    text: '#FFFFFF'
  },
  SPACE: {
    primary: '#9370DB',
    secondary: '#4169E1',
    accent: '#FFD700',
    background: '#0F0F23',
    text: '#FFFFFF'
  }
} as const

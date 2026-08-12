// Kid-friendly "worlds" — each world is a full visual theme with its own
// palette, mascot and playful voice. Picking a world re-skins the whole app
// by setting CSS custom properties on <html> (see ThemeContext).

export type WorldId =
  | 'bee'
  | 'space'
  | 'unicorn'
  | 'dino'
  | 'ocean'
  | 'princess'
  | 'jungle'
  | 'candy'

export interface WorldTokens {
  // page background (colorful gradient) + a soft blob color for decoration
  bg: string
  bgSolid: string
  blob1: string
  blob2: string
  // surfaces
  card: string
  cardSoft: string
  border: string
  // brand colors (used for buttons, accents, heading gradient)
  primary: string
  primary2: string
  primaryRgb: string
  secondary: string
  secondary2: string
  accent: string
  // text
  text: string
  textSoft: string
  onPrimary: string
  // feedback
  success: string
  error: string
}

export interface World {
  id: WorldId
  /** Fun world name shown to kids */
  name: string
  /** One-line playful tagline */
  tagline: string
  /** Big mascot emoji */
  mascot: string
  /** Decorative emoji sprinkled around */
  sprinkles: string[]
  /** Who it tends to appeal to — used only to group the picker */
  vibe: 'neutral' | 'cool' | 'sweet'
  /** True if this world reads as a dark background (affects text defaults) */
  dark: boolean
  tokens: WorldTokens
}

export const WORLDS: Record<WorldId, World> = {
  bee: {
    id: 'bee',
    name: 'Buzzy Meadow',
    tagline: "Buzz from flower to flower!",
    mascot: '🐝',
    sprinkles: ['🌻', '🍯', '🌼', '🐝'],
    vibe: 'neutral',
    dark: false,
    tokens: {
      bg: 'linear-gradient(160deg, #FFF4C2 0%, #FFE08A 45%, #FFC94D 100%)',
      bgSolid: '#FFE08A',
      blob1: '#FFD34D',
      blob2: '#FFEFB0',
      card: '#FFFFFF',
      cardSoft: '#FFF8E1',
      border: '#F4C430',
      primary: '#F5A623',
      primary2: '#FF7A00',
      primaryRgb: '245, 166, 35',
      secondary: '#3AB795',
      secondary2: '#57CC99',
      accent: '#7B4B94',
      text: '#4A3200',
      textSoft: '#8A6D2F',
      onPrimary: '#ffffff',
      success: '#2FBF71',
      error: '#EF476F',
    },
  },
  space: {
    id: 'space',
    name: 'Cosmic Quest',
    tagline: 'Blast off across the stars!',
    mascot: '🚀',
    sprinkles: ['⭐', '🪐', '🌟', '👾'],
    vibe: 'cool',
    dark: true,
    tokens: {
      bg: 'linear-gradient(165deg, #1B1150 0%, #2A1B6B 50%, #3B1E7A 100%)',
      bgSolid: '#241463',
      blob1: '#5B3FD6',
      blob2: '#7B2FF7',
      card: '#2B1D63',
      cardSoft: '#33246F',
      border: '#5B3FD6',
      primary: '#7B5CFF',
      primary2: '#B14BFF',
      primaryRgb: '123, 92, 255',
      secondary: '#22D3EE',
      secondary2: '#38BDF8',
      accent: '#FFD166',
      text: '#F3EEFF',
      textSoft: '#C4B8F0',
      onPrimary: '#ffffff',
      success: '#34E0A1',
      error: '#FF6B8B',
    },
  },
  unicorn: {
    id: 'unicorn',
    name: 'Rainbow Kingdom',
    tagline: 'Sparkle your way to victory!',
    mascot: '🦄',
    sprinkles: ['🌈', '✨', '💖', '⭐'],
    vibe: 'sweet',
    dark: false,
    tokens: {
      bg: 'linear-gradient(160deg, #FFE3F3 0%, #E9D5FF 50%, #C7ECFF 100%)',
      bgSolid: '#F3D9FF',
      blob1: '#F0ABFC',
      blob2: '#A5B4FC',
      card: '#FFFFFF',
      cardSoft: '#FDF0FF',
      border: '#E9A8F5',
      primary: '#C026D3',
      primary2: '#7C3AED',
      primaryRgb: '192, 38, 211',
      secondary: '#38BDF8',
      secondary2: '#22D3EE',
      accent: '#FB7185',
      text: '#4A1D57',
      textSoft: '#8A5A9C',
      onPrimary: '#ffffff',
      success: '#2FBF71',
      error: '#EF476F',
    },
  },
  dino: {
    id: 'dino',
    name: 'Dino Valley',
    tagline: 'Stomp through prehistoric fun!',
    mascot: '🦖',
    sprinkles: ['🌋', '🌿', '🦕', '🥚'],
    vibe: 'cool',
    dark: false,
    tokens: {
      bg: 'linear-gradient(160deg, #D8F3C4 0%, #A7E88F 50%, #6DBE45 100%)',
      bgSolid: '#A7E88F',
      blob1: '#7CC950',
      blob2: '#C7F0A8',
      card: '#FFFFFF',
      cardSoft: '#F2FBE9',
      border: '#7CB342',
      primary: '#EA6A1E',
      primary2: '#F59E0B',
      primaryRgb: '234, 106, 30',
      secondary: '#2E9E5B',
      secondary2: '#57CC99',
      accent: '#0EA5E9',
      text: '#22410F',
      textSoft: '#5C7A3F',
      onPrimary: '#ffffff',
      success: '#2FBF71',
      error: '#EF476F',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Mermaid Cove',
    tagline: 'Dive into an underwater adventure!',
    mascot: '🧜‍♀️',
    sprinkles: ['🐠', '🐚', '🫧', '🐬'],
    vibe: 'sweet',
    dark: false,
    tokens: {
      bg: 'linear-gradient(165deg, #CFFAFE 0%, #7DD3FC 50%, #38BDF8 100%)',
      bgSolid: '#7DD3FC',
      blob1: '#22D3EE',
      blob2: '#A5F3FC',
      card: '#FFFFFF',
      cardSoft: '#ECFEFF',
      border: '#38BDF8',
      primary: '#0EA5B7',
      primary2: '#2563EB',
      primaryRgb: '14, 165, 183',
      secondary: '#F472B6',
      secondary2: '#FB7185',
      accent: '#FBBF24',
      text: '#0B3B54',
      textSoft: '#3E6E88',
      onPrimary: '#ffffff',
      success: '#2FBF71',
      error: '#EF476F',
    },
  },
  princess: {
    id: 'princess',
    name: 'Sparkle Castle',
    tagline: 'Rule your royal word kingdom!',
    mascot: '👑',
    sprinkles: ['🏰', '💎', '🌷', '✨'],
    vibe: 'sweet',
    dark: false,
    tokens: {
      bg: 'linear-gradient(160deg, #FFE4EC 0%, #FFC9DE 50%, #FDA4C7 100%)',
      bgSolid: '#FFC9DE',
      blob1: '#FB7BB0',
      blob2: '#FFD9E7',
      card: '#FFFFFF',
      cardSoft: '#FFF1F6',
      border: '#F9A8C9',
      primary: '#DB2777',
      primary2: '#E11D48',
      primaryRgb: '219, 39, 119',
      secondary: '#A855F7',
      secondary2: '#C084FC',
      accent: '#F5A623',
      text: '#5A1436',
      textSoft: '#9C5476',
      onPrimary: '#ffffff',
      success: '#2FBF71',
      error: '#EF476F',
    },
  },
  jungle: {
    id: 'jungle',
    name: 'Adventure Jungle',
    tagline: 'Swing through leafy word trees!',
    mascot: '🐵',
    sprinkles: ['🌴', '🦜', '🍌', '🐆'],
    vibe: 'neutral',
    dark: false,
    tokens: {
      bg: 'linear-gradient(160deg, #DFF5D0 0%, #9BD576 45%, #3F9142 100%)',
      bgSolid: '#9BD576',
      blob1: '#57A639',
      blob2: '#CDEAB0',
      card: '#FFFFFF',
      cardSoft: '#F1FAE8',
      border: '#5FA83D',
      primary: '#2E9E5B',
      primary2: '#15803D',
      primaryRgb: '46, 158, 91',
      secondary: '#F59E0B',
      secondary2: '#FB923C',
      accent: '#0EA5E9',
      text: '#20401F',
      textSoft: '#517A3E',
      onPrimary: '#ffffff',
      success: '#2FBF71',
      error: '#EF476F',
    },
  },
  candy: {
    id: 'candy',
    name: 'Candy Land',
    tagline: 'A sweet treat for every word!',
    mascot: '🍭',
    sprinkles: ['🍬', '🧁', '🍩', '🌈'],
    vibe: 'sweet',
    dark: false,
    tokens: {
      bg: 'linear-gradient(160deg, #FFF0F6 0%, #FFE0F0 40%, #E0F0FF 100%)',
      bgSolid: '#FFE0F0',
      blob1: '#FF9CC9',
      blob2: '#9CD0FF',
      card: '#FFFFFF',
      cardSoft: '#FFF5FA',
      border: '#FFB3D6',
      primary: '#F43F8E',
      primary2: '#8B5CF6',
      primaryRgb: '244, 63, 142',
      secondary: '#22C1DC',
      secondary2: '#38BDF8',
      accent: '#FBBF24',
      text: '#5A2244',
      textSoft: '#9C5A80',
      onPrimary: '#ffffff',
      success: '#2FBF71',
      error: '#EF476F',
    },
  },
}

export const WORLD_LIST: World[] = [
  WORLDS.bee,
  WORLDS.space,
  WORLDS.unicorn,
  WORLDS.dino,
  WORLDS.ocean,
  WORLDS.princess,
  WORLDS.jungle,
  WORLDS.candy,
]

export const DEFAULT_WORLD: WorldId = 'bee'

export function getWorld(id: string | null | undefined): World {
  if (id && id in WORLDS) return WORLDS[id as WorldId]
  return WORLDS[DEFAULT_WORLD]
}

/** Apply a world's tokens to the document root as CSS custom properties. */
export function applyWorld(id: WorldId) {
  const world = getWorld(id)
  const t = world.tokens
  const root = document.documentElement
  const set = (k: string, v: string) => root.style.setProperty(k, v)

  set('--bg', t.bg)
  set('--bg-solid', t.bgSolid)
  set('--blob-1', t.blob1)
  set('--blob-2', t.blob2)
  set('--card', t.card)
  set('--card-soft', t.cardSoft)
  set('--border', t.border)
  set('--primary', t.primary)
  set('--primary-2', t.primary2)
  set('--primary-rgb', t.primaryRgb)
  set('--secondary', t.secondary)
  set('--secondary-2', t.secondary2)
  set('--accent', t.accent)
  set('--text', t.text)
  set('--text-soft', t.textSoft)
  set('--on-primary', t.onPrimary)
  set('--success', t.success)
  set('--error', t.error)

  root.setAttribute('data-world', id)
  root.setAttribute('data-mode', world.dark ? 'dark' : 'light')
}

/**
 * Tiny sound-effect kit for the games.
 *
 * Kids feel a game long before they read its instructions — a "ding" on a right
 * answer is worth a paragraph of praise. These are synthesised with the Web
 * Audio API rather than shipped as files so there is nothing to download and
 * nothing to go missing offline.
 *
 * Everything honours the same `audioEnabled` flag as the spoken words, so one
 * mute switch silences the whole app.
 */

let ctx: AudioContext | null = null

const audioAllowed = (): boolean => {
  try {
    const saved = localStorage.getItem('audioEnabled')
    return saved ? JSON.parse(saved) : true
  } catch {
    return true
  }
}

const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as any).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  // Browsers park the context until the first gesture; a tap on a game tile is
  // that gesture, so nudge it awake rather than staying silent forever.
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

interface ToneOptions {
  freq: number
  /** seconds */
  duration?: number
  /** seconds from now */
  delay?: number
  type?: OscillatorType
  volume?: number
  /** slide to this frequency over the note */
  glideTo?: number
}

const tone = ({ freq, duration = 0.14, delay = 0, type = 'sine', volume = 0.18, glideTo }: ToneOptions) => {
  const ac = getCtx()
  if (!ac) return
  const start = ac.currentTime + delay
  const osc = ac.createOscillator()
  const gain = ac.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(glideTo, 1), start + duration)

  // A quick swell in and a soft tail — square-edged notes click unpleasantly.
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  osc.connect(gain).connect(ac.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

const play = (notes: ToneOptions[]) => {
  if (!audioAllowed()) return
  try {
    notes.forEach(tone)
  } catch {
    /* audio is a garnish — never let it break a game */
  }
}

// --- Per-world sound personality -------------------------------------------
//
// Every world gets its own instrument and its own win-tune, so switching
// worlds *sounds* different, not just looks different. Buzzy Meadow is bright
// and square-wave chiptune; Cosmic Quest is slow, low and swooshy.

interface WorldSoundProfile {
  /** oscillator flavour for the world's win jingle */
  type: OscillatorType
  /** the four notes of the world's win jingle */
  winNotes: number[]
  /** tap tick frequency */
  tapFreq: number
  /** short motif played when the child arrives in the world */
  motif: number[]
}

const SOUND_PROFILES: Record<string, WorldSoundProfile> = {
  bee:      { type: 'square',   winNotes: [523, 659, 784, 1047], tapFreq: 620, motif: [784, 880, 784] },
  space:    { type: 'sawtooth', winNotes: [392, 523, 659, 880],  tapFreq: 340, motif: [523, 392, 659] },
  unicorn:  { type: 'triangle', winNotes: [659, 784, 988, 1319], tapFreq: 720, motif: [988, 1175, 1319] },
  dino:     { type: 'square',   winNotes: [330, 392, 494, 659],  tapFreq: 240, motif: [330, 294, 392] },
  ocean:    { type: 'sine',     winNotes: [440, 554, 659, 880],  tapFreq: 520, motif: [659, 554, 440] },
  princess: { type: 'triangle', winNotes: [587, 740, 880, 1175], tapFreq: 680, motif: [880, 988, 1175] },
  jungle:   { type: 'square',   winNotes: [440, 523, 587, 784],  tapFreq: 300, motif: [587, 523, 440] },
  candy:    { type: 'triangle', winNotes: [698, 880, 1047, 1397], tapFreq: 760, motif: [1047, 1175, 1397] },
}

let currentProfile: WorldSoundProfile = SOUND_PROFILES.bee

/** Called by the theme system whenever the world changes. */
export const setWorldSoundProfile = (worldId: string): void => {
  currentProfile = SOUND_PROFILES[worldId] || SOUND_PROFILES.bee
}

export const sfx = {
  /** light tick for taps and selections — pitched to the current world */
  tap: () => play([{ freq: currentProfile.tapFreq, duration: 0.06, type: 'triangle', volume: 0.1 }]),

  /** cheerful two-note "yes!" */
  correct: () =>
    play([
      { freq: 660, duration: 0.1, type: 'triangle', volume: 0.16 },
      { freq: 880, duration: 0.16, delay: 0.09, type: 'triangle', volume: 0.16 },
    ]),

  /** soft "not quite" — deliberately gentle, never a buzzer */
  wrong: () =>
    play([
      { freq: 300, duration: 0.16, type: 'sine', volume: 0.13, glideTo: 200 },
    ]),

  /** rising arpeggio for finishing a game or level — each world has its own tune */
  win: () =>
    play(
      currentProfile.winNotes.map((freq, i) => ({
        freq,
        duration: i === 3 ? 0.3 : 0.13,
        delay: i * 0.12,
        type: currentProfile.type,
        volume: i === 3 ? 0.15 : 0.13,
      }))
    ),

  /** the world's little hello-motif, played when the child arrives in it */
  worldJingle: () =>
    play(
      currentProfile.motif.map((freq, i) => ({
        freq,
        duration: 0.16,
        delay: i * 0.14,
        type: currentProfile.type,
        volume: 0.1,
      }))
    ),

  /** coin/star pickup */
  star: () =>
    play([
      { freq: 988, duration: 0.07, type: 'square', volume: 0.09 },
      { freq: 1319, duration: 0.16, delay: 0.06, type: 'square', volume: 0.09 },
    ]),

  /** bubbly pop for bursting, catching, whacking */
  pop: () => play([{ freq: 420, duration: 0.09, type: 'sine', volume: 0.16, glideTo: 900 }]),

  /** whoosh for movement — rolling dice, casting a line, a snake turn */
  whoosh: () => play([{ freq: 200, duration: 0.18, type: 'sawtooth', volume: 0.06, glideTo: 620 }]),

  /** big thud for a block landing or a dragon stomp */
  thud: () => play([{ freq: 160, duration: 0.18, type: 'sine', volume: 0.2, glideTo: 70 }]),

  /**
   * A room full of people clapping.
   *
   * Noise, not notes: short bursts of detuned high tones at uneven spacing.
   * Evenly spaced claps sound like a machine, which is the opposite of a crowd.
   */
  applause: () =>
    play(
      Array.from({ length: 22 }, (_, i) => ({
        freq: 1400 + Math.random() * 2600,
        duration: 0.035,
        delay: i * 0.045 + Math.random() * 0.035,
        type: 'square' as OscillatorType,
        volume: 0.035 + Math.random() * 0.03,
      }))
    ),

  /** a new personal best deserves its own fanfare */
  fanfare: () =>
    play([
      { freq: 784, duration: 0.12, type: 'square', volume: 0.12 },
      { freq: 784, duration: 0.12, delay: 0.14, type: 'square', volume: 0.12 },
      { freq: 1047, duration: 0.36, delay: 0.28, type: 'square', volume: 0.14 },
    ]),
}

export default sfx

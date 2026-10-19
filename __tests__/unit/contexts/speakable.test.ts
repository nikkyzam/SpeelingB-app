import { describe, it, expect } from 'vitest'
import { speakable } from '@/contexts/AudioContext'

describe('what the voice reads aloud', () => {
  it('leaves the emoji for the eyes', () => {
    expect(speakable('Nailed it! 🎉')).toBe('Nailed it!')
    expect(speakable('Three in a row! 🔥🔥 Go!')).toBe('Three in a row! Go!')
    expect(speakable('📍 Here ❤️ we go 👨‍👩‍👧')).toBe('Here we go')
  })

  it('keeps ordinary words and punctuation as they are', () => {
    expect(speakable('cat. The cat sat. cat.')).toBe('cat. The cat sat. cat.')
    expect(speakable('c, a, t')).toBe('c, a, t')
    expect(speakable('Ten in a row — you’re on fire!')).toBe('Ten in a row — you’re on fire!')
  })
})

import { expect, it } from 'vitest'
import { WORLD_LIST } from '@/theme/worlds'
import { contrastRatio, readableColor } from '@/theme/contrast'

for (const world of WORLD_LIST) {
  it(`${world.name} has readable action endpoints and body text`, () => {
    const t = world.tokens
    for (const fill of [t.primary, t.primary2, t.secondary, t.secondary2, t.accent, t.success, t.error]) {
      expect(contrastRatio(fill, t.onPrimary)).toBeGreaterThanOrEqual(4.5)
    }
    for (const surface of [t.card, t.cardSoft]) {
      expect(contrastRatio(t.text, surface)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(t.textSoft, surface)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(readableColor(t.primary, surface), surface)).toBeGreaterThanOrEqual(4.5)
    }
  })
}

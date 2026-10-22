import { describe, it, expect } from 'vitest'
import { pickRounds, matchPairs, answerLabel, plain } from '@/services/subjects/gamePool'
import { TESTS, QUEST_GRADES, loadQuestTopic } from '@/services/subjects/catalogue'
import type { Question } from '@/services/subjects/types'

const base = { prompt: 'p', category: 'c', explanation: 'e' }

describe('turning questions into games', () => {
  it('reads stacked fractions back as a/b', () => {
    expect(plain('<span class="frac"><span class="num">2</span><span class="den">5</span></span>')).toBe('2/5')
  })

  it('labels each kind of answer', () => {
    expect(answerLabel({ ...base, id: 'a', kind: 'fraction', answer: [4, 3] })).toBe('4/3')
    expect(answerLabel({ ...base, id: 'b', kind: 'number', answer: 12 })).toBe('12')
    expect(answerLabel({ ...base, id: 'c', kind: 'multi', choices: ['x'], answers: [0] })).toBeNull()
  })

  it('gives every pick round its right answer exactly once, among distinct options', () => {
    const qs: Question[] = [
      { ...base, id: '1', kind: 'number', answer: 6 },
      { ...base, id: '2', kind: 'number', answer: 9 },
      { ...base, id: '3', kind: 'fraction', answer: [2, 5] },
      { ...base, id: '4', kind: 'choice', choices: ['A', 'B', 'C'], answer: 1 },
      { ...base, id: '5', kind: 'truefalse', answer: false },
    ]
    for (const r of pickRounds(qs, 10)) {
      expect(new Set(r.options).size).toBe(r.options.length)
      expect(r.answer).toBeGreaterThanOrEqual(0)
      expect(r.options[r.answer]).toBe(answerLabel(qs.find((q) => q.id === r.id)!))
    }
  })

  it('never puts two pairs with the same answer on one match board', () => {
    const qs: Question[] = [1, 2, 3, 4].map((i) => ({ ...base, id: `q${i}`, kind: 'number' as const, answer: i % 2 }))
    const pairs = matchPairs(qs, 4)
    expect(new Set(pairs.map((p) => p.answer)).size).toBe(pairs.length)
  })
})

/** The sweep: every topic and test in the app must be playable as games. */
describe('every topic has games', () => {
  const topics = QUEST_GRADES.flatMap((g) => g.units.flatMap((u) => u.topics.map((t) => t.id)))

  it.each(topics)('Math Quest %s has enough for pick and match games', async (topicId) => {
    const qs = await loadQuestTopic(topicId)
    expect(pickRounds(qs, 8).length, 'pick rounds').toBeGreaterThanOrEqual(4)
    expect(matchPairs(qs, 6).length, 'match pairs').toBeGreaterThanOrEqual(3)
  })

  it.each(TESTS.map((t) => [t.id, t] as const))('practice test %s has enough for pick and match games', async (_id, test) => {
    const qs = Object.values(await test.load()).flat()
    expect(pickRounds(qs, 8).length).toBeGreaterThanOrEqual(4)
    expect(matchPairs(qs, 6).length).toBeGreaterThanOrEqual(3)
  })
})

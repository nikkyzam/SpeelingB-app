import { describe, it, expect } from 'vitest'
import { dealRound } from '@/pages/Subjects/QuestTopic'
import { loadQuestTopic } from '@/services/subjects/catalogue'
import type { Question } from '@/services/subjects/types'

const q = (id: string, group?: string): Question => ({
  id,
  prompt: id,
  category: 'c',
  explanation: 'e',
  kind: 'number',
  answer: 1,
  ...(group ? { group } : {}),
})

describe('dealing a Math Quest round', () => {
  it('keeps a question and its follow-up together, first one first', () => {
    const bank = [q('a1', 'a'), q('a2', 'a'), q('b'), q('c1', 'c'), q('c2', 'c'), q('d')]
    for (let i = 0; i < 50; i++) {
      const ids = dealRound(bank, 10).map((x) => x.id)
      expect(ids.indexOf('a2') - ids.indexOf('a1')).toBe(1)
      expect(ids.indexOf('c2') - ids.indexOf('c1')).toBe(1)
    }
  })

  it('never cuts a pair in half to fit the round size', () => {
    const bank = [q('a1', 'a'), q('a2', 'a'), q('b1', 'b'), q('b2', 'b'), q('c1', 'c'), q('c2', 'c')]
    for (let i = 0; i < 50; i++) {
      const ids = dealRound(bank, 3).map((x) => x.id)
      expect(ids.length % 2).toBe(0)
    }
  })
})

describe('Grade 5 fractions asked both ways', () => {
  it.each(['g5-fracasdiv', 'g5-fracmult', 'g5-unlike'])('%s pairs sit back to back at the same level', async (topic) => {
    const qs = await loadQuestTopic(topic)
    const groups = new Map<string, number[]>()
    qs.forEach((x, i) => x.group && groups.set(x.group, [...(groups.get(x.group) ?? []), i]))
    expect(groups.size).toBeGreaterThan(0)
    for (const [g, idx] of groups) {
      expect(idx, g).toHaveLength(2)
      expect(idx[1] - idx[0], g).toBe(1)
      expect(qs[idx[0]].level ?? 1, g).toBe(qs[idx[1]].level ?? 1)
    }
  })

  it('the pizza question from class has the three right answers each way', async () => {
    const [share, perPizza] = (await loadQuestTopic('g5-fracasdiv')).slice(0, 2)
    const plain = (s: string) => s.replace(/<span class="den">/g, '/').replace(/<[^>]+>/g, '')
    expect(share.kind === 'multi' && share.answers.map((i) => plain(share.choices[i]))).toEqual(['2/5', '6/15', '6 ÷ 15'])
    expect(perPizza.kind === 'multi' && perPizza.answers.map((i) => plain(perPizza.choices[i]))).toEqual(['5/2', '15/6', '15 ÷ 6'])
  })
})

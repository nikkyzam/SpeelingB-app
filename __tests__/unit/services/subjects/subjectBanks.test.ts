import { describe, it, expect } from 'vitest'
import { TESTS, QUEST_GRADES, loadQuestTopic, gradeOfTopic } from '@/services/subjects/catalogue'
import type { Question } from '@/services/subjects/types'
import { isCorrect } from '@/services/subjects/grading'

/** Every rule a question must meet to be shown and graded fairly. */
const problems = (q: Question): string[] => {
  const out: string[] = []
  if (!q.id) out.push('no id')
  if (!q.prompt?.trim()) out.push('no prompt')
  if (!q.category?.trim()) out.push('no category')
  if (!q.explanation?.trim()) out.push('no explanation')
  const idx = (i: number, n: number) => Number.isInteger(i) && i >= 0 && i < n
  switch (q.kind) {
    case 'choice':
      if (q.choices.length < 2) out.push('fewer than 2 choices')
      if (!idx(q.answer, q.choices.length)) out.push('answer out of range')
      break
    case 'multi':
      if (!q.answers.length || !q.answers.every((a) => idx(a, q.choices.length))) out.push('bad answers')
      break
    case 'truefalse':
      if (typeof q.answer !== 'boolean') out.push('answer not boolean')
      break
    case 'match':
      if (q.pairs.length < 2) out.push('fewer than 2 pairs')
      if (new Set(q.pairs.map((p) => p[1])).size !== q.pairs.length) out.push('two pairs share a right side')
      break
    case 'order':
      if (q.items.length < 2) out.push('fewer than 2 items')
      if (new Set(q.items).size !== q.items.length) out.push('duplicate items')
      break
    case 'number':
      if (!Number.isFinite(q.answer)) out.push('answer not a number')
      break
    case 'text':
      if (!q.accept.length || !q.display) out.push('nothing accepted')
      break
    case 'expression':
      if (!q.accept.length || !q.display) out.push('nothing accepted')
      // The answer shown on the review screen must itself be marked right.
      else if (!isCorrect(q, q.display)) out.push('its own answer is not accepted')
      break
    case 'pair':
      if (q.answer.length !== 2) out.push('pair is not two numbers')
      break
    case 'fraction': {
      const [n, d] = q.answer
      if (!Number.isInteger(n) || !Number.isInteger(d) || d <= 0) out.push('fraction is not n/d')
      else if (!isCorrect(q, `${n}/${d}`)) out.push('its own answer is not accepted')
      break
    }
    case 'plot':
      if (!q.answer?.length && !q.rule) out.push('no points and no rule')
      break
    default:
      out.push(`unknown kind ${(q as { kind: string }).kind}`)
  }
  return out
}

describe('practice test banks', () => {
  it.each(TESTS.map((t) => [t.id, t] as const))('%s loads with well-formed questions', async (_id, test) => {
    const bank = await test.load()
    const forms = test.forms?.map((f) => f.id) ?? ['main']
    for (const form of forms) expect(bank[form]?.length, `form ${form}`).toBeGreaterThan(0)
    if (test.addOn) expect(bank[test.addOn.form]?.length).toBeGreaterThan(0)
    const ids = new Set<string>()
    for (const [form, qs] of Object.entries(bank)) {
      for (const q of qs) {
        expect(problems(q), `${form} ${q.id}`).toEqual([])
        expect(ids.has(q.id), `duplicate id ${q.id}`).toBe(false)
        ids.add(q.id)
      }
    }
  })
})

describe('study notes', () => {
  it.each(TESTS.filter((t) => t.notes).map((t) => [t.id, t] as const))('%s has notes with every section filled in', async (_id, test) => {
    const notes = await test.notes!()
    expect(notes.length).toBeGreaterThan(0)
    for (const n of notes) {
      expect(n.title && n.icon && n.intro, n.title).toBeTruthy()
      for (const row of n.ladder?.rows ?? []) expect(row.length, `${n.title} ladder row`).toBe(n.ladder!.rows[0].length)
    }
  })
})

describe('Math Quest', () => {
  const topics = QUEST_GRADES.flatMap((g) => g.units.flatMap((u) => u.topics.map((t) => [t.id, g.grade] as const)))

  it('lists only topics that have questions, from K to Grade 8', () => {
    expect(QUEST_GRADES.map((g) => g.grade)).toEqual(['k', '1', '2', '3', '4', '5', '6', '7', '8'])
    expect(topics.length).toBeGreaterThan(100)
  })

  it.each(topics)('%s is in its grade and well-formed', async (topicId, grade) => {
    expect(gradeOfTopic(topicId)).toBe(grade)
    const qs = await loadQuestTopic(topicId)
    expect(qs.length).toBeGreaterThan(0)
    for (const q of qs) expect(problems(q), q.id).toEqual([])
  })
})

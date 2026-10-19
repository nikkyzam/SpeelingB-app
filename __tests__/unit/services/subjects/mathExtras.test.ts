import { describe, it, expect } from 'vitest'
import {
  checkProof,
  checkPuzzle,
  isMissingStep,
  lessonForTopic,
  loadLessons,
  loadProofs,
  loadPuzzles,
  proofAnswer,
  shuffledSteps,
  trophyFor,
  type Proof,
  type Puzzle,
} from '@/services/subjects/mathExtras'
import { correctAnswerText, isCorrect } from '@/services/subjects/grading'

const orderProof: Proof = {
  id: 'o',
  grade: 3,
  topic: 't',
  kind: 'order',
  claim: 'c',
  steps: [{ text: 'a' }, { text: 'b' }, { text: 'c' }],
  hints: [],
}
const reasonsProof: Proof = {
  id: 'r',
  grade: 5,
  topic: 't',
  kind: 'reasons',
  claim: 'c',
  steps: [
    { text: 'a', reason: 'Given' },
    { text: 'b', reason: 'Rule' },
  ],
  reasons: ['Given', 'Rule', 'Guessing'],
  hints: [],
}
const blanksProof: Proof = {
  id: 'b',
  grade: 8,
  topic: 't',
  kind: 'blanks',
  claim: 'c',
  steps: [{ text: 'a' }, { missing: true, choices: ['x', 'y'], answer: 1 }, { text: 'c' }],
  hints: [],
}

describe('checking a proof', () => {
  it('accepts steps in the right order and points at the first misplaced one', () => {
    expect(checkProof(orderProof, { order: [0, 1, 2] })).toEqual({ correct: true, firstWrong: null, wrongSteps: [] })
    const r = checkProof(orderProof, { order: [0, 2, 1] })
    expect(r.correct).toBe(false)
    expect(r.firstWrong).toBe(1)
    expect(r.wrongSteps).toEqual([1, 2])
  })

  it('treats a half-built order as not right yet', () => {
    expect(checkProof(orderProof, { order: [0] }).correct).toBe(false)
  })

  it('names only the steps whose reason is wrong', () => {
    expect(checkProof(reasonsProof, { reasons: { 0: 'Given', 1: 'Rule' } }).correct).toBe(true)
    expect(checkProof(reasonsProof, { reasons: { 0: 'Given', 1: 'Guessing' } }).wrongSteps).toEqual([1])
    expect(checkProof(reasonsProof, {}).wrongSteps).toEqual([0, 1])
  })

  it('grades the missing step by the option chosen', () => {
    expect(checkProof(blanksProof, { blanks: { 1: 1 } }).correct).toBe(true)
    expect(checkProof(blanksProof, { blanks: { 1: 0 } }).wrongSteps).toEqual([1])
  })

  it('the revealed answer always checks as right', async () => {
    for (const p of [orderProof, reasonsProof, blanksProof, ...(await loadProofs())]) {
      expect(checkProof(p, proofAnswer(p)).correct, p.id).toBe(true)
    }
  })

  it('never deals the steps out already in order', () => {
    for (let k = 0; k < 50; k++) {
      const s = shuffledSteps(4)
      expect([...s].sort()).toEqual([0, 1, 2, 3])
      expect(s).not.toEqual([0, 1, 2, 3])
    }
  })
})

describe('the proofs that ship', () => {
  it('are each well-formed for their kind', async () => {
    const proofs = await loadProofs()
    expect(proofs.length).toBeGreaterThan(0)
    expect(new Set(proofs.map((p) => p.id)).size).toBe(proofs.length)
    for (const p of proofs) {
      expect(p.claim, p.id).toBeTruthy()
      expect(p.hints.length, p.id).toBeGreaterThan(0)
      if (p.kind === 'reasons') {
        for (const s of p.steps) {
          expect(isMissingStep(s)).toBe(false)
          if (!isMissingStep(s)) expect(p.reasons, p.id).toContain(s.reason)
        }
      }
      if (p.kind === 'blanks') {
        const missing = p.steps.filter(isMissingStep)
        expect(missing.length, p.id).toBeGreaterThan(0)
        for (const s of missing) expect(s.choices[s.answer], p.id).toBeTruthy()
      }
    }
  })
})

const puzzle: Puzzle = {
  id: 'p',
  title: 't',
  difficulty: 1,
  topic: 't',
  prompt: 'q',
  accept: [16, 'sixteen'],
  answer: '16',
  hints: ['a', 'b', 'c'],
  solution: 's',
}

describe('checking a puzzle', () => {
  it('accepts any of its answers, leniently typed', () => {
    expect(checkPuzzle(puzzle, '16')).toBe(true)
    expect(checkPuzzle(puzzle, ' 16 triangles ')).toBe(true)
    expect(checkPuzzle(puzzle, '16.0')).toBe(true)
    expect(checkPuzzle(puzzle, 'Sixteen.')).toBe(true)
  })

  it('turns away wrong or empty answers', () => {
    expect(checkPuzzle(puzzle, '8')).toBe(false)
    expect(checkPuzzle(puzzle, '')).toBe(false)
    expect(checkPuzzle(puzzle, 'lots')).toBe(false)
  })

  it('gives a better trophy for fewer hints', () => {
    expect(trophyFor(0)).toBe('gold')
    expect(trophyFor(1)).toBe('silver')
    expect(trophyFor(3)).toBe('bronze')
  })

  it('every shipped puzzle accepts its own shown answer and has a three-step hint ladder', async () => {
    const puzzles = await loadPuzzles()
    expect(puzzles.length).toBe(8)
    for (const p of puzzles) {
      expect(checkPuzzle(p, p.answer), p.id).toBe(true)
      expect(p.hints, p.id).toHaveLength(3)
      expect(p.solution, p.id).toBeTruthy()
    }
  })
})

describe('comic lessons', () => {
  it('finds the lesson for a topic and nothing for a topic without one', async () => {
    expect((await lessonForTopic('g2-arrays'))?.title).toBe('Rows and Columns')
    expect((await lessonForTopic('g3-fracnum'))?.id).toBe('les-fracnum')
    expect(await lessonForTopic('no-such-topic')).toBeNull()
  })

  it('every check question is well-formed and gradable', async () => {
    const lessons = await loadLessons()
    const ids = new Set<string>()
    let checks = 0
    for (const l of lessons) {
      expect(l.panels.length, l.id).toBeGreaterThan(0)
      for (const panel of l.panels) {
        if (panel.type === 'talk') {
          expect(['pip', 'nim', 'vex']).toContain(panel.speaker)
          expect(panel.text).toBeTruthy()
          continue
        }
        checks++
        const q = panel.question
        expect(ids.has(q.id), q.id).toBe(false)
        ids.add(q.id)
        expect(q.prompt, q.id).toBeTruthy()
        expect(q.category, q.id).toBe(l.topicId)
        expect(q.explanation, q.id).toBeTruthy()
        expect(['choice', 'number'], q.id).toContain(q.kind)
        if (q.kind === 'choice') {
          expect(q.answer).toBeGreaterThanOrEqual(0)
          expect(q.answer).toBeLessThan(q.choices.length)
          expect(isCorrect(q, q.answer)).toBe(true)
        }
        if (q.kind === 'number') {
          expect(Number.isFinite(q.answer)).toBe(true)
          expect(isCorrect(q, correctAnswerText(q))).toBe(true)
        }
      }
    }
    expect(checks).toBe(4)
  })
})

import { describe, it, expect } from 'vitest'
import { isAnswered, isCorrect, parseNumber, parsePair, normText, correctAnswerText, letterGrade } from '@/services/subjects/grading'
import type { Question } from '@/services/subjects/types'

const base = { id: 't', prompt: 'p', category: 'c', explanation: 'e' }

describe('reading what a child typed', () => {
  it('takes the first signed number, whatever surrounds it', () => {
    expect(parseNumber('$8')).toBe(8)
    expect(parseNumber('−37°C')).toBe(-37)
    expect(parseNumber('120 feet')).toBe(120)
    expect(parseNumber('1,250')).toBe(1250)
    expect(parseNumber('.5')).toBe(0.5)
    expect(parseNumber('none')).toBeNull()
  })

  it('reads an ordered pair however it is written', () => {
    expect(parsePair('(3, −2)')).toEqual([3, -2])
    expect(parsePair('3,-2')).toEqual([3, -2])
    expect(parsePair('3')).toBeNull()
  })

  it('ignores case, punctuation and spacing in words', () => {
    expect(normText('  Scarcity. ')).toBe('scarcity')
    expect(normText("Point  of view!")).toBe('point of view')
  })
})

describe('marking each kind of question', () => {
  it('number answers accept units and the long minus sign', () => {
    const q: Question = { ...base, kind: 'number', answer: -4.3 }
    expect(isCorrect(q, '−4.3')).toBe(true)
    expect(isCorrect(q, '-4.30 degrees')).toBe(true)
    expect(isCorrect(q, '4.3')).toBe(false)
    expect(isAnswered(q, 'abc')).toBe(false)
  })

  it('true/false and single choice', () => {
    expect(isCorrect({ ...base, kind: 'truefalse', answer: false }, false)).toBe(true)
    expect(isCorrect({ ...base, kind: 'choice', choices: ['a', 'b'], answer: 1 }, 0)).toBe(false)
  })

  it('select-all needs exactly the right set, in any order', () => {
    const q: Question = { ...base, kind: 'multi', choices: ['a', 'b', 'c', 'd'], answers: [0, 2] }
    expect(isCorrect(q, [2, 0])).toBe(true)
    expect(isCorrect(q, [0, 2, 3])).toBe(false)
    expect(isCorrect(q, [0])).toBe(false)
  })

  it('ordering is right only when every item is in place', () => {
    const q: Question = { ...base, kind: 'order', items: ['1', '2', '3'] }
    expect(isCorrect(q, [0, 1, 2])).toBe(true)
    expect(isCorrect(q, [1, 0, 2])).toBe(false)
    expect(isAnswered(q, [0, 1])).toBe(false)
  })

  it('matching is right only when every row picks its own partner', () => {
    const q: Question = { ...base, kind: 'match', pairs: [['a', '1'], ['b', '2']] }
    expect(isCorrect(q, [0, 1])).toBe(true)
    expect(isCorrect(q, [1, 0])).toBe(false)
    expect(isAnswered(q, [0, -1])).toBe(false)
  })

  it('free text matches any accepted spelling', () => {
    const q: Question = { ...base, kind: 'text', accept: ['scarcity'], display: 'Scarcity' }
    expect(isCorrect(q, 'Scarcity.')).toBe(true)
    expect(correctAnswerText(q)).toBe('Scarcity')
  })

  it('plotted points ignore the order they were placed in', () => {
    const q: Question = { ...base, kind: 'plot', grid: { xMin: -5, xMax: 5, yMin: -5, yMax: 5 }, answer: [[1, 2], [3, -1]] }
    expect(isCorrect(q, [[3, -1], [1, 2]])).toBe(true)
    expect(isCorrect(q, [[1, 2]])).toBe(false)
  })

  it('a plotting rule accepts any distinct points on the line', () => {
    const q: Question = { ...base, kind: 'plot', grid: { xMin: -6, xMax: 6, yMin: -6, yMax: 6 }, rule: { m: 2, c: 1, need: 2 } }
    expect(isCorrect(q, [[0, 1], [1, 3]])).toBe(true)
    expect(isCorrect(q, [[0, 1], [0, 1]])).toBe(false)
    expect(isCorrect(q, [[0, 1], [1, 4]])).toBe(false)
  })

  it('ordered pairs compare both coordinates', () => {
    const q: Question = { ...base, kind: 'pair', answer: [4, 2] }
    expect(isCorrect(q, '(4, 2)')).toBe(true)
    expect(isCorrect(q, '(2, 4)')).toBe(false)
  })
})

describe('letter grades', () => {
  it('follow the usual cut-offs', () => {
    expect([95, 85, 75, 65, 30].map(letterGrade)).toEqual(['A', 'B', 'C', 'D', '—'])
  })
})

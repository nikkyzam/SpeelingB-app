import { describe, it, expect } from 'vitest'
import { explain } from '../../../../src/services/words/explain'

const rule = (w: string, a?: string) => explain(w, a).rule
const tip = (w: string, a?: string) => explain(w, a).tip

describe('naming the mistake the child actually made', () => {
  it('spots a missing magic e', () => {
    expect(rule('hope', 'hop')).toBe('magic-e')
    expect(tip('hope', 'hop')).toMatch(/magic e/)
  })

  it('spots an e that should not be there', () => {
    expect(rule('hop', 'hope')).toBe('extra-e')
  })

  it('spots a missed double letter', () => {
    expect(rule('kitten', 'kiten')).toBe('double-letter')
    expect(tip('kitten', 'kiten')).toMatch(/double tt/)
  })

  it('spots a double letter that should be single', () => {
    expect(rule('until', 'unttil')).toBe('no-double')
  })

  it('spots ie and ei the wrong way round', () => {
    expect(rule('friend', 'freind')).toBe('ie-ei')
    expect(rule('receive', 'recieve')).toBe('ei-after-c')
    expect(tip('receive', 'recieve')).toMatch(/except after c/)
  })

  it('recognises the right letters in the wrong order', () => {
    expect(rule('form', 'from')).toBe('letter-order')
    expect(tip('form', 'from')).toMatch(/right letters/)
  })

  it('names a missed ending', () => {
    expect(rule('action', 'actshun')).toBe('tion-ending')
    expect(rule('possible', 'possable')).toBe('ible-ending')
  })
})

describe('when there is no attempt, it says what is interesting about the word', () => {
  it('q brings its u', () => {
    expect(rule('queen')).toBe('qu')
  })

  it('silent letters at the front and back', () => {
    expect(rule('knee')).toBe('silent-kn')
    expect(rule('write')).toBe('silent-wr')
    expect(rule('thumb')).toBe('silent-b')
  })

  it('double letters and digraphs', () => {
    expect(rule('butter')).toBe('double-letter')
    expect(rule('chair')).toBe('digraph-ch')
    expect(rule('phone')).toBe('digraph-ph')
  })

  it('magic e and y-as-a-vowel', () => {
    expect(rule('cake')).toBe('magic-e')
    // "happy" has a double p, and that is the more useful thing to say about
    // it — the y tip is for words whose y is the only oddity.
    expect(rule('happy')).toBe('double-letter')
    expect(rule('windy')).toBe('y-vowel')
  })

  it('falls back to syllables rather than inventing a rule', () => {
    expect(rule('caterpillar')).toBe('double-letter') // it does have one
    expect(['chunks', 'sound-out']).toContain(rule('animal'))
    expect(tip('animal')).toMatch(/an|Sound/)
  })
})

describe('it is always safe to show', () => {
  it('never returns an empty tip for a real word', () => {
    for (const w of ['cat', 'elephant', 'rhythm', 'through', 'a', 'science', 'queue']) {
      const e = explain(w)
      if (w.length > 1) {
        expect(e.tip.length, `no tip for "${w}"`).toBeGreaterThan(0)
        expect(e.rule).not.toBe('none')
      }
    }
  })

  it('copes with punctuation, capitals and empty input', () => {
    expect(explain('  CAKE  ').rule).toBe('magic-e')
    expect(explain("yoo-hoo").tip.length).toBeGreaterThan(0)
    expect(explain('').tip).toBe('')
    expect(explain('', 'x').rule).toBe('none')
  })

  it('a correct attempt is treated as no attempt', () => {
    expect(rule('cake', 'cake')).toBe(rule('cake'))
  })

  it('never claims a rule the word does not follow', () => {
    // "hop" has no magic e, no double, no digraph — it must not be told it has.
    const e = explain('hop')
    expect(['chunks', 'sound-out']).toContain(e.rule)
  })
})

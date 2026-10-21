import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const h = vi.hoisted(() => ({ speak: vi.fn() }))
vi.mock('@/contexts/AudioContext', () => ({
  useAudio: () => ({ speak: h.speak }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
}))

import ComicLesson from '@/components/subjects/ComicLesson'
import type { Lesson } from '@/services/subjects/mathExtras'

const lesson: Lesson = {
  id: 'les-test',
  topicId: 'g2-arrays',
  title: 'Rows and Columns',
  blurb: 'b',
  panels: [
    { type: 'talk', speaker: 'pip', text: 'There are 3 rows of 4.', art: { kind: 'array', rows: 3, cols: 4 } },
    {
      type: 'check',
      question: {
        id: 'q1',
        kind: 'number',
        prompt: '2 rows of 5 is how many?',
        category: 'g2-arrays',
        explanation: '5 + 5 = 10.',
        answer: 10,
      },
    },
    {
      type: 'check',
      question: {
        id: 'q2',
        kind: 'choice',
        prompt: 'Which is shaded?',
        category: 'g2-arrays',
        explanation: '3 out of 8.',
        choices: ['3/8', '8/3'],
        answer: 0,
      },
    },
  ],
}

describe('a comic lesson', () => {
  beforeEach(() => h.speak.mockClear())

  it('shows the speaker and the drawing, and reads the line aloud on request', () => {
    render(<ComicLesson lesson={lesson} onDone={() => {}} />)
    expect(screen.getByText('There are 3 rows of 4.')).toBeInTheDocument()
    expect(screen.getByText('Pip')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '3 rows of 4' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Read it to me' }))
    expect(h.speak).toHaveBeenCalledWith('There are 3 rows of 4.')
  })

  it('a wrong answer still shows the right one and why, and lets the child carry on', () => {
    const onDone = vi.fn()
    render(<ComicLesson lesson={lesson} onDone={onDone} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    fireEvent.change(screen.getByLabelText('Your answer'), { target: { value: '9' } })
    fireEvent.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByText('Good try! The answer is 10.')).toBeInTheDocument()
    expect(screen.getByText('5 + 5 = 10.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    fireEvent.click(screen.getByRole('button', { name: '3/8' }))
    expect(screen.getByText('Exactly right!')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }))
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})

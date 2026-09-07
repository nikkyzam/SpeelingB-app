import React, { useState } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import SpellingInput from '@/components/common/SpellingInput'

vi.mock('@/components/games/shared/sfx', () => ({ default: { tap: vi.fn() } }))

/** A page the way the games write them: controlled value, Enter submits. */
const Page: React.FC<{ onSubmit: (v: string) => void; keyEvent?: 'press' | 'down'; disabled?: boolean }> = ({
  onSubmit, keyEvent = 'press', disabled,
}) => {
  const [value, setValue] = useState('')
  const enter = (e: React.KeyboardEvent) => e.key === 'Enter' && onSubmit(value)
  return (
    <SpellingInput
      aria-label="Spell the word"
      value={value}
      disabled={disabled}
      onChange={(e) => setValue(e.target.value)}
      onKeyPress={keyEvent === 'press' ? enter : undefined}
      onKeyDown={keyEvent === 'down' ? enter : undefined}
    />
  )
}

const asTablet = () => Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, configurable: true })
const asLaptop = () => Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true })
const key = (name: string) => screen.getByRole('button', { name })

describe('the spelling box on a tablet', () => {
  beforeEach(asTablet)
  afterEach(() => { cleanup(); asLaptop() })

  it('never opens the system keyboard, so the predictive bar cannot appear', () => {
    render(<Page onSubmit={() => {}} />)
    const box = screen.getByLabelText('Spell the word')
    expect(box).toHaveAttribute('inputmode', 'none')
    expect(box).toHaveAttribute('autocorrect', 'off')
    expect(box).toHaveAttribute('spellcheck', 'false')
  })

  it('offers every letter, a backspace and a check — and nothing that spells', () => {
    render(<Page onSubmit={() => {}} />)
    for (const ch of 'abcdefghijklmnopqrstuvwxyz') expect(key(ch)).toBeInTheDocument()
    expect(key('Delete a letter')).toBeInTheDocument()
    expect(key('Check my spelling')).toBeInTheDocument()
    // 26 letters + 2 controls. No word suggestions, no hints.
    expect(screen.getAllByRole('button')).toHaveLength(28)
  })

  it('types through the page’s own onChange, so nothing else has to change', () => {
    render(<Page onSubmit={() => {}} />)
    fireEvent.click(key('c'))
    fireEvent.click(key('a'))
    fireEvent.click(key('r'))
    fireEvent.click(key('t'))
    fireEvent.click(key('Delete a letter'))
    expect(screen.getByLabelText('Spell the word')).toHaveValue('car')
  })

  it('submits through onKeyPress, which is what most games listen for', () => {
    const onSubmit = vi.fn()
    render(<Page onSubmit={onSubmit} keyEvent="press" />)
    fireEvent.click(key('d'))
    fireEvent.click(key('o'))
    fireEvent.click(key('g'))
    fireEvent.click(key('Check my spelling'))
    expect(onSubmit).toHaveBeenCalledWith('dog')
  })

  it('submits through onKeyDown too, for the newer pages', () => {
    const onSubmit = vi.fn()
    render(<Page onSubmit={onSubmit} keyEvent="down" />)
    fireEvent.click(key('o'))
    fireEvent.click(key('x'))
    fireEvent.click(key('Check my spelling'))
    expect(onSubmit).toHaveBeenCalledWith('ox')
  })

  it('does not submit an empty box', () => {
    const onSubmit = vi.fn()
    render(<Page onSubmit={onSubmit} />)
    fireEvent.click(key('Check my spelling'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('puts the keypad away while the answer is being judged', () => {
    const { rerender } = render(<Page onSubmit={() => {}} />)
    expect(screen.queryByRole('group', { name: 'Letter keys' })).toBeInTheDocument()
    rerender(<Page onSubmit={() => {}} disabled />)
    expect(screen.queryByRole('group', { name: 'Letter keys' })).not.toBeInTheDocument()
  })

  it('shows one keypad for a verse with many boxes, following the child’s tap', () => {
    render(
      <>
        <SpellingInput aria-label="first" defaultValue="" />
        <SpellingInput aria-label="second" defaultValue="" />
      </>
    )
    expect(screen.getAllByRole('group', { name: 'Letter keys' })).toHaveLength(1)

    fireEvent.focus(screen.getByLabelText('first'))
    fireEvent.click(key('a'))
    expect(screen.getByLabelText('first')).toHaveValue('a')
    expect(screen.getByLabelText('second')).toHaveValue('')

    fireEvent.focus(screen.getByLabelText('second'))
    fireEvent.click(key('b'))
    expect(screen.getByLabelText('second')).toHaveValue('b')
    expect(screen.getAllByRole('group', { name: 'Letter keys' })).toHaveLength(1)
  })
})

describe('the spelling box on a laptop', () => {
  beforeEach(asLaptop)
  afterEach(cleanup)

  it('keeps the real keyboard and shows no keypad', () => {
    render(<Page onSubmit={() => {}} />)
    expect(screen.getByLabelText('Spell the word')).not.toHaveAttribute('inputmode')
    expect(screen.queryByRole('group', { name: 'Letter keys' })).not.toBeInTheDocument()
  })
})

import React, { useState } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import Dialog from '@/components/common/Dialog'
import GrownUpGate from '@/components/common/GrownUpGate'
import { AudioProvider } from '@/contexts/AudioContext'
import ComfortControls from '@/components/common/ComfortControls'
import { getPreferences, setPreferences } from '@/services/preferences'
import { webcrypto } from 'node:crypto'
import { MemoryRouter } from 'react-router-dom'
import BookReader from '@/components/reading/BookReader'

beforeEach(() => { localStorage.clear(); vi.stubGlobal('crypto', webcrypto) })
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

it('keeps focus inside a dialog, handles Escape, and restores the opener', () => {
  function Example() {
    const [open, setOpen] = useState(false)
    return <><button onClick={() => setOpen(true)}>Open</button>{open && <Dialog title="Example" onClose={() => setOpen(false)}><button>Last</button></Dialog>}</>
  }
  render(<Example />)
  const opener = screen.getByRole('button', { name: 'Open' })
  opener.focus(); fireEvent.click(opener)
  const last = screen.getByRole('button', { name: 'Last' })
  last.focus(); fireEvent.keyDown(last, { key: 'Tab' })
  expect(screen.getByRole('button', { name: 'Close Example' })).toHaveFocus()
  fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(opener).toHaveFocus()
})

it('restores the background after nested dialogs unmount together', () => {
  const root = document.createElement('div'); root.id = 'root'; document.body.append(root)
  const view = render(<Dialog title="Outer"><Dialog title="Inner"><button>Inside</button></Dialog></Dialog>, { container: root })
  expect(root.inert).toBe(true)
  view.unmount()
  expect(root.inert).toBe(false)
  root.remove()
})

it('protects grown-up controls, stores no plain PIN, and rejects a wrong PIN after locking', async () => {
  render(<GrownUpGate><p>Approve family prizes</p></GrownUpGate>)
  expect(screen.queryByText('Approve family prizes')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Open grown-up settings' }))
  fireEvent.change(screen.getByLabelText('Grown-ups: what is 7 × 8?'), { target: { value: '56' } })
  fireEvent.change(screen.getByLabelText('Family PIN'), { target: { value: '4826' } })
  fireEvent.change(screen.getByLabelText('Enter the PIN again'), { target: { value: '4826' } })
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Save PIN and open' })); await new Promise(resolve => setTimeout(resolve, 20)) })
  expect(screen.getByText('Approve family prizes')).toBeInTheDocument()
  expect(localStorage.getItem('family_pin_hash')).not.toBe('4826')
  fireEvent.click(screen.getByRole('button', { name: 'Lock grown-up settings' }))
  fireEvent.click(screen.getByRole('button', { name: 'Open grown-up settings' }))
  fireEvent.change(screen.getByLabelText('Family PIN'), { target: { value: '1111' } })
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Open' })); await new Promise(resolve => setTimeout(resolve, 20)) })
  expect(screen.queryByText('Approve family prizes')).not.toBeInTheDocument()
  expect(screen.getByRole('alert')).toHaveTextContent('did not match')
})

it('separates pronunciation from game effects and exposes a stop control', () => {
  render(<AudioProvider><ComfortControls /></AudioProvider>)
  fireEvent.click(screen.getByRole('button', { name: '🎵 Sounds on' }))
  expect(getPreferences().effectsEnabled).toBe(false)
  expect(screen.getByRole('button', { name: '🔊 Voice on' })).toHaveAttribute('aria-pressed', 'true')
  fireEvent.click(screen.getByRole('button', { name: '■ Stop voice' }))
  expect(window.speechSynthesis.cancel).toHaveBeenCalled()
  act(() => setPreferences({ calm: true }))
  expect(screen.getByRole('checkbox', { name: 'Calm celebrations' })).toBeChecked()
})

it('shows a stop button immediately while story narration starts, then stops on a page change', async () => {
  render(<MemoryRouter><AudioProvider><BookReader bookId="cbook-001" /></AudioProvider></MemoryRouter>)
  fireEvent.click(await screen.findByRole('button', { name: '🔊 Listen' }))
  expect(screen.getByRole('button', { name: '■ Stop reading' })).toBeEnabled()
  fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
  expect(screen.getByRole('button', { name: '🔊 Listen' })).toBeInTheDocument()
  expect(window.speechSynthesis.cancel).toHaveBeenCalled()
})

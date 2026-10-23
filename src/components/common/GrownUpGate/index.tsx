import React, { useState } from 'react'
import Dialog from '../Dialog'

const KEY = 'family_pin_hash'
const hash = async (pin: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin))))
  .map(n => n.toString(16).padStart(2, '0')).join('')

/** A local family PIN prevents accidental entry; it is not account authentication. */
export default function GrownUpGate({ children, label = 'Open grown-up settings' }: { children: React.ReactNode; label?: string }) {
  const [open, setOpen] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  // A forgotten PIN must not lock a family out of their own settings. The
  // gate only stops accidental taps, so a fresh grown-up question each time
  // is enough to clear it — no site data (and no guest progress) is lost.
  const [resetting, setResetting] = useState(false)
  const [resetQ, setResetQ] = useState<[number, number]>([12, 7])
  const configured = !!localStorage.getItem(KEY)
  const startReset = () => {
    setResetQ([11 + Math.floor(Math.random() * 9), 6 + Math.floor(Math.random() * 4)])
    setResetting(true); setAnswer(''); setError('')
  }
  const submitReset = (event: React.FormEvent) => {
    event.preventDefault()
    if (Number(answer.trim()) !== resetQ[0] * resetQ[1]) { setError('That answer is not right. Ask a grown-up to try.'); return }
    try { localStorage.removeItem(KEY) } catch { /* nothing stored */ }
    setResetting(false); setAnswer(''); setPin(''); setConfirm('')
    setError('PIN cleared. Choose a new family PIN.')
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!/^\d{4,8}$/.test(pin)) { setError('Use a PIN with 4 to 8 numbers.'); return }
    if (!configured && (answer.trim() !== '56' || pin !== confirm)) {
      setError('Check the grown-up question and enter the same PIN twice.'); return
    }
    setBusy(true)
    try {
      const digest = await hash(pin)
      if (configured && digest !== localStorage.getItem(KEY)) { setError('That PIN did not match. Ask your grown-up.'); return }
      if (!configured) localStorage.setItem(KEY, digest)
      setUnlocked(true); setOpen(false); setPin(''); setConfirm(''); setAnswer('')
    } catch { setError('This device could not open the grown-up area. Please try again.'); }
    finally { setBusy(false) }
  }
  if (unlocked) return <div className="grown-up-area">
    <button className="btn btn-secondary" onClick={() => setUnlocked(false)}>Lock grown-up settings</button>
    {children}
  </div>
  return <>
    <button className="btn btn-secondary" onClick={() => { setOpen(true); setError('') }}>{label}</button>
    {open && <Dialog title="Grown-up check" onClose={() => setOpen(false)}>
      <h2>Grown-up check</h2>
      {resetting ? <form onSubmit={submitReset}>
        <p>Grown-ups: answer this to clear the family PIN, then choose a new one.</p>
        <label>What is {resetQ[0]} × {resetQ[1]}?<input value={answer} onChange={e => setAnswer(e.target.value)} inputMode="numeric" required /></label>
        {error && <p role="alert">{error}</p>}
        <button className="btn">Clear the PIN</button>
        <button type="button" className="comfort-button" onClick={() => { setResetting(false); setError('') }}>Back</button>
      </form> : <>
      <p>{configured ? 'Ask your grown-up to enter the family PIN.' : 'Grown-ups: choose a family PIN for this device. Keep it to yourself.'}</p>
      <form onSubmit={submit}>
        {!configured && <label>Grown-ups: what is 7 × 8?<input value={answer} onChange={e => setAnswer(e.target.value)} inputMode="numeric" required /></label>}
        <label>Family PIN<input type="password" inputMode="numeric" autoComplete="off" maxLength={8} value={pin} onChange={e => setPin(e.target.value)} required /></label>
        {!configured && <label>Enter the PIN again<input type="password" inputMode="numeric" autoComplete="off" maxLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} required /></label>}
        {error && <p role="alert">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Checking…' : configured ? 'Open' : 'Save PIN and open'}</button>
        {configured && <button type="button" className="comfort-button" onClick={startReset}>Forgot the PIN?</button>}
      </form></>}
    </Dialog>}
  </>
}

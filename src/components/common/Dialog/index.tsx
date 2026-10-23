import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const modalStack: HTMLElement[] = []
let rootWasInert = false

interface Props {
  title: string
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

/** One modal implementation for focus, keyboard dismissal and background isolation. */
export default function Dialog({ title, children, onClose, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const root = document.getElementById('root')
    if (modalStack.length === 0) rootWasInert = root?.inert ?? false
    if (root) root.inert = true
    const sheet = ref.current!
    for (const other of modalStack) other.inert = true
    modalStack.push(sheet)
    const focusable = () => Array.from(sheet.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]'
    )).filter(el => !el.hidden && !el.closest('[hidden]'))
    ;(focusable()[0] ?? sheet).focus()
    const key = (event: KeyboardEvent) => {
      if (modalStack[modalStack.length - 1] !== sheet) return
      // A paused game's global keyboard shortcuts must not receive modal keys.
      event.stopPropagation()
      if (event.key === 'Escape' && close.current) { event.preventDefault(); close.current(); return }
      if (event.key !== 'Tab') return
      const items = focusable()
      if (!items.length) { event.preventDefault(); sheet.focus(); return }
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === sheet)) {
        event.preventDefault(); last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !sheet.contains(document.activeElement))) {
        event.preventDefault(); first.focus()
      }
    }
    sheet.addEventListener('keydown', key)
    return () => {
      sheet.removeEventListener('keydown', key)
      const index = modalStack.indexOf(sheet)
      if (index >= 0) modalStack.splice(index, 1)
      const top = modalStack[modalStack.length - 1]
      if (top) top.inert = false
      else if (root) root.inert = rootWasInert
      if (previous?.isConnected && !previous.closest('[inert]')) previous.focus()
    }
  }, [])
  return createPortal(
    <div className="accessible-dialog-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose?.() }}>
      <div className={`accessible-dialog ${className}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        {onClose && <button className="dialog-close" onClick={onClose} aria-label={`Close ${title}`}>✕</button>}
        {children}
      </div>
    </div>, document.body
  )
}

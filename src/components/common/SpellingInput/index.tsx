import React, { forwardRef, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import sfx from '../../games/shared/sfx'
import './SpellingInput.css'

/**
 * Attributes that stop a device from spelling the word for the child.
 *
 * On an iPad this is not a nicety: the keyboard's autocorrect will silently
 * fix a misspelling as the child types, and the predictive bar offers the
 * finished word above the keys. A spelling test where the device spells it is
 * not a spelling test.
 *
 * `autoCorrect` is the one that matters most and is Safari-specific — it is
 * missing from most tutorials, which is why it was missing here.
 */
export const NO_SPELLING_HELP = {
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: false,
  // Keeps password managers and browser autofill out of a child's answer box.
  'data-lpignore': 'true',
  'data-form-type': 'other',
} as const

/**
 * The attributes above stop autocorrect, but nothing a web page says can
 * reliably remove the iPad's predictive bar. So on a touch device the system
 * keyboard is never opened at all (`inputMode="none"`) and the child spells
 * on our own letter keypad instead — 26 letters, a backspace, and a check.
 */
const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia?.('(pointer: coarse)').matches) return true
  } catch {
    /* no matchMedia in this environment */
  }
  return (navigator.maxTouchPoints ?? 0) > 0
}

// --- which box the keypad belongs to ----------------------------------------
//
// Only one keypad is ever on screen. It belongs to the spelling box that was
// most recently focused, or — because iPad Safari ignores autoFocus — the one
// most recently put on screen. Bible Memorizer has a box per word; tapping a
// different word moves the keypad to it.

const mounted: string[] = []
let active: string | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())
const claim = (id: string) => {
  if (active === id) return
  active = id
  notify()
}
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const getActive = () => active

const ROWS = ['abcdefg', 'hijklmn', 'opqrstu', 'vwxyz'] as const

/** Write to a React-controlled input as though the child had typed. */
const typeInto = (el: HTMLInputElement, next: string) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  if (setter) setter.call(el, next)
  else el.value = next
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

/** Press Enter for the child: the pages listen for keydown or keypress. */
const pressEnter = (el: HTMLInputElement) => {
  for (const type of ['keydown', 'keypress'] as const) {
    const ev = new KeyboardEvent(type, { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true })
    // React decides a keypress is real by its charCode; jsdom and some
    // browsers leave the legacy fields at 0 for a constructed event.
    for (const legacy of ['charCode', 'keyCode', 'which']) {
      if ((ev as unknown as Record<string, number>)[legacy] === 0) {
        Object.defineProperty(ev, legacy, { value: 13 })
      }
    }
    el.dispatchEvent(ev)
  }
}

export type SpellingInputProps = React.InputHTMLAttributes<HTMLInputElement>

/**
 * The box a child spells a word into. Drop-in for `<input>`: same props, same
 * ref, same onChange/onKeyPress/onKeyDown — the keypad types through them.
 */
const SpellingInput = forwardRef<HTMLInputElement, SpellingInputProps>(function SpellingInput(
  { disabled, onFocus, ...props },
  forwardedRef
) {
  const id = useId()
  const inner = useRef<HTMLInputElement | null>(null)
  const [touch] = useState(isTouchDevice)
  const current = useSyncExternalStore(subscribe, getActive, getActive)

  const setRef = (el: HTMLInputElement | null) => {
    inner.current = el
    if (typeof forwardedRef === 'function') forwardedRef(el)
    else if (forwardedRef) forwardedRef.current = el
  }

  useEffect(() => {
    mounted.push(id)
    claim(id)
    return () => {
      const i = mounted.indexOf(id)
      if (i >= 0) mounted.splice(i, 1)
      if (active === id) {
        active = mounted[mounted.length - 1] ?? null
        notify()
      }
    }
  }, [id])

  const showKeypad = touch && !disabled && current === id
  useEffect(() => {
    if (!showKeypad) return
    document.body.classList.add('has-spelling-keypad')
    inner.current?.scrollIntoView?.({ block: 'center' })
    return () => document.body.classList.remove('has-spelling-keypad')
  }, [showKeypad])

  const press = (fn: (el: HTMLInputElement) => void) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = inner.current
    if (!el || el.disabled) return
    sfx.tap()
    fn(el)
  }
  // Keep the caret in the box: a tap on a key must not steal focus from it.
  const keepFocus = (e: React.SyntheticEvent) => e.preventDefault()

  const letter = (ch: string) =>
    press((el) => {
      if (props.maxLength && el.value.length >= props.maxLength) return
      typeInto(el, el.value + ch)
    })
  const backspace = press((el) => typeInto(el, el.value.slice(0, -1)))
  const enter = press((el) => {
    if (!el.value.trim()) return
    pressEnter(el)
  })

  return (
    <>
      <input
        {...NO_SPELLING_HELP}
        {...props}
        ref={setRef}
        disabled={disabled}
        inputMode={touch ? 'none' : props.inputMode}
        data-spelling-keypad={touch ? 'true' : undefined}
        onFocus={(e) => {
          claim(id)
          onFocus?.(e)
        }}
      />
      {showKeypad &&
        createPortal(
          <div className="spelling-keypad" role="group" aria-label="Letter keys">
            {ROWS.map((row) => (
              <div key={row} className="spelling-keypad-row">
                {row.split('').map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    className="spelling-key"
                    onPointerDown={keepFocus}
                    onMouseDown={keepFocus}
                    onClick={letter(ch)}
                    aria-label={ch}
                  >
                    {ch}
                  </button>
                ))}
                {row === 'vwxyz' && (
                  <>
                    <button
                      type="button"
                      className="spelling-key wide"
                      onPointerDown={keepFocus}
                      onMouseDown={keepFocus}
                      onClick={backspace}
                      aria-label="Delete a letter"
                    >
                      ⌫
                    </button>
                    <button
                      type="button"
                      className="spelling-key wide go"
                      onPointerDown={keepFocus}
                      onMouseDown={keepFocus}
                      onClick={enter}
                      aria-label="Check my spelling"
                    >
                      ✓
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  )
})

export default SpellingInput

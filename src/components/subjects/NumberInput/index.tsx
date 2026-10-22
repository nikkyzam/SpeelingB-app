import React from 'react'
import './NumberInput.css'

interface NumberInputProps {
  value: string
  onChange: (value: string) => void
  /** Adds the keys for an ordered pair: ( , ) */
  pair?: boolean
  /** Adds the keys for an expression: ( ) + */
  expression?: boolean
  /** Adds the keys for a fraction or mixed number: / and a space */
  fraction?: boolean
  disabled?: boolean
  onEnter?: () => void
  label?: string
}

const isTouch = () => {
  try {
    return !!window.matchMedia?.('(pointer: coarse)').matches
  } catch {
    return false
  }
}

const DIGITS = ['7', '8', '9', '4', '5', '6', '1', '2', '3']

/**
 * A box for a number answer. iPad's decimal keyboard has no minus sign, and
 * half of the integer questions are negative — so on touch screens the system
 * keyboard stays shut and the child taps this pad instead.
 */
const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, pair, expression, fraction, disabled, onEnter, label }) => {
  const touch = React.useMemo(isTouch, [])
  // Two quick taps can land before the parent re-renders; build on the last value sent, not the last prop.
  const latest = React.useRef(value)
  latest.current = value
  const press = (k: string) => {
    if (disabled) return
    const next = k === '⌫' ? latest.current.slice(0, -1) : latest.current + k
    latest.current = next
    onChange(next)
  }

  return (
    <div className="number-input">
      <input
        type="text"
        className="number-input-box"
        value={value}
        inputMode={touch ? 'none' : 'decimal'}
        autoComplete="off"
        aria-label={label ?? (pair ? 'Your ordered pair' : 'Your answer')}
        placeholder={pair ? '( x , y )' : expression ? 'e.g. 6(3 + 2)' : fraction ? 'e.g. 3/4 or 1 1/3' : 'Your answer'}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onEnter?.()
        }}
      />
      {!disabled && (
        <div className="number-pad" role="group" aria-label="Number keys">
          {[...DIGITS, '−', '0', '.', ...(pair ? ['(', ',', ')'] : expression ? ['(', '+', ')'] : fraction ? ['/', ' '] : [])].map((k) => (
            <button
              key={k}
              type="button"
              className={/\d/.test(k) ? undefined : 'number-pad-extra'}
              aria-label={k === ' ' ? 'Space (for a mixed number like 1 1/3)' : k === '/' ? 'Fraction bar' : undefined}
              onClick={() => press(k)}
            >
              {k === ' ' ? 'space' : k}
            </button>
          ))}
          <button type="button" className="number-pad-extra number-pad-wide" onClick={() => press('⌫')} aria-label="Delete">
            ⌫
          </button>
        </div>
      )}
    </div>
  )
}

export default NumberInput

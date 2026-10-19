import React from 'react'
import './RichText.css'

/**
 * Question text with the little markup the banks use — bold, italics,
 * superscripts and stacked fractions — rebuilt as React elements. Anything
 * else is shown as plain text, so a bank can never inject markup.
 */
const TAGS: Record<string, keyof JSX.IntrinsicElements> = {
  STRONG: 'strong',
  B: 'strong',
  EM: 'em',
  I: 'em',
  SUP: 'sup',
  SUB: 'sub',
  BR: 'br',
}
const FRACTION_PARTS = new Set(['frac', 'num', 'den'])

const toReact = (node: Node, key: number): React.ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent
  if (node.nodeType !== Node.ELEMENT_NODE) return null
  const el = node as Element
  const children = Array.from(el.childNodes).map(toReact)
  const tag = TAGS[el.tagName]
  if (tag === 'br') return <br key={key} />
  if (tag) return React.createElement(tag, { key }, ...children)
  const cls = el.getAttribute('class') ?? ''
  if (el.tagName === 'SPAN' && FRACTION_PARTS.has(cls)) {
    return (
      <span key={key} className={`rt-${cls}`}>
        {children}
      </span>
    )
  }
  return <React.Fragment key={key}>{children}</React.Fragment>
}

interface RichTextProps {
  text: string
  className?: string
}

const RichText: React.FC<RichTextProps> = ({ text, className }) => {
  const nodes = React.useMemo(() => {
    if (!/[<&]/.test(text)) return [text]
    const doc = new DOMParser().parseFromString(`<body>${text}</body>`, 'text/html')
    return Array.from(doc.body.childNodes).map(toReact)
  }, [text])
  return <span className={className}>{nodes}</span>
}

export default RichText

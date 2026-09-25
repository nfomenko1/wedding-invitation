import { Fragment } from 'react'
import './Split.css'

/**
 * Splits text into masked words (or chars inside masked words) so each
 * piece can rise through its mask. Screen readers get the plain text;
 * the split spans are aria-hidden.
 *
 * Animate `.split__word` (by="words") or `.split__char` (by="chars").
 */
export default function Split({ text, by = 'words', as: Tag = 'span', className = '' }) {
  const words = text.split(' ')

  return (
    <Tag className={`split ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      <span className="split__visual" aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="split__mask">
              {by === 'chars' ? (
                Array.from(word).map((char, j) => (
                  <span key={j} className="split__char">
                    {char}
                  </span>
                ))
              ) : (
                <span className="split__word">{word}</span>
              )}
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}

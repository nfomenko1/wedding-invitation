import { useId } from 'react'
import './Ornaments.css'

// Decorative line ornaments. Every stroke carries pathLength="1" and the
// .draw class so it can be drawn with draw() from lib/animations.js.
// All ornaments are decorative and hidden from assistive technology.

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export function Flourish({ className = '' }) {
  return (
    <svg className={`ornament ornament--flourish ${className}`} viewBox="0 0 240 24" strokeWidth="1" {...stroke}>
      <path className="draw" pathLength="1" d="M4 12H100" />
      <path className="draw" pathLength="1" d="M236 12H140" />
      <path className="draw" pathLength="1" d="M100 12C108 12 111 4 120 4C129 4 132 12 140 12" />
      <path className="draw" pathLength="1" d="M100 12C108 12 111 20 120 20C129 20 132 12 140 12" />
      <path className="draw" pathLength="1" d="M120 8.5L123.5 12L120 15.5L116.5 12Z" />
      <circle cx="92" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="148" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Corner({ className = '' }) {
  return (
    <svg className={`ornament ornament--corner ${className}`} viewBox="0 0 80 80" strokeWidth="1" {...stroke}>
      <path className="draw" pathLength="1" d="M3 77V22C3 11.5 11.5 3 22 3H77" />
      <path className="draw" pathLength="1" d="M10 70V30C10 19 19 10 30 10H70" />
      <path className="draw" pathLength="1" d="M18 42C18 28 28 18 42 18" />
      <path className="draw" pathLength="1" d="M22 22C30 22 34 28 30 32C27 35 22 32 25 28.5" />
      <circle cx="42" cy="18" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="42" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Monogram({ first = 'S', second = 'J', className = '' }) {
  return (
    <span className={`monogram ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 120 120" strokeWidth="0.8" {...stroke}>
        <circle className="draw" pathLength="1" cx="60" cy="60" r="57" />
        <circle className="draw" pathLength="1" cx="60" cy="60" r="51" />
        <path className="draw" pathLength="1" d="M60 1V9M60 111V119M1 60H9M111 60H119" />
      </svg>
      <span className="monogram__letters">
        {first}
        <i>&amp;</i>
        {second}
      </span>
    </span>
  )
}

export function Sprig({ className = '' }) {
  return (
    <svg className={`ornament ornament--sprig ${className}`} viewBox="0 0 60 170" strokeWidth="1" {...stroke}>
      <path className="draw" pathLength="1" d="M30 168C31 130 26 96 31 60C33 42 29 22 31 4" />
      <path className="draw" pathLength="1" d="M30 140C18 136 11 126 13 116C22 119 28 128 30 140Z" />
      <path className="draw" pathLength="1" d="M30 118C42 114 49 104 47 94C38 97 32 106 30 118Z" />
      <path className="draw" pathLength="1" d="M30 96C18 92 12 82 14 72C23 75 29 84 30 96Z" />
      <path className="draw" pathLength="1" d="M31 74C43 70 50 60 48 50C39 53 33 62 31 74Z" />
      <path className="draw" pathLength="1" d="M31 52C20 48 14 38 16 28C24 31 30 40 31 52Z" />
      <path className="draw" pathLength="1" d="M31 30C41 26 46 17 44 8C36 11 32 19 31 30Z" />
    </svg>
  )
}

export function Rings({ className = '' }) {
  return (
    <svg className={`ornament ornament--rings ${className}`} viewBox="0 0 140 90" strokeWidth="1.1" {...stroke}>
      <circle className="draw" pathLength="1" cx="52" cy="48" r="34" />
      <circle className="draw" pathLength="1" cx="88" cy="48" r="34" />
      <path className="draw" pathLength="1" d="M88 8L92 12L88 16L84 12Z" />
    </svg>
  )
}

export function RoundBadge({ text, className = '' }) {
  const id = `badge-${useId().replace(/[^\w-]/g, '')}`

  return (
    <div className={`round-badge ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <path id={id} d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1 -156 0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="486" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="round-badge__center">
        S<i>&amp;</i>J
      </span>
    </div>
  )
}

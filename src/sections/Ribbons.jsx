import { useMotion } from '../hooks/useMotion.js'
import { parallax } from '../lib/animations.js'
import { couple, wedding } from '../content/wedding.js'
import './Ribbons.css'

const PHRASE = `${couple.first} & ${couple.second} ✦ ${wedding.short} ✦ ${wedding.region} ✦ `
const REPEAT = Array.from({ length: 6 })

// Two crossing satin ribbons bridging the dark gallery and the light details.
// Purely decorative: they drift in opposite directions with scroll.
export default function Ribbons() {
  const scope = useMotion(({ el, q, reduce }) => {
    if (reduce) return
    parallax(q('.ribbon--a .ribbon__track'), { xPercent: -4 }, { xPercent: -30 }, el)
    parallax(q('.ribbon--b .ribbon__track'), { xPercent: -30 }, { xPercent: -4 }, el)
  })

  return (
    <div className="ribbons" ref={scope} aria-hidden="true">
      {['b', 'a'].map((key) => (
        <div key={key} className={`ribbon ribbon--${key}`}>
          <div className="ribbon__track">
            {REPEAT.map((_, i) => (
              <span key={i}>{PHRASE}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

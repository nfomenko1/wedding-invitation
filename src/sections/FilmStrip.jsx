import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { useMotion } from '../hooks/useMotion.js'
import { filmStrip } from '../content/wedding.js'
import { FILM_VIEW_LENGTH, FILM_HANDOVER_LENGTH } from './sceneTiming.js'
import './FilmStrip.css'

// Each row is its 7 frames laid out COPIES times end to end; the offset
// wraps by one set, so the strip never runs out in either direction.
const COPIES = 3

// Per row: direction (-1 left, 1 right), travel over a plain pass of the
// section through the viewport (viewport + section height of scroll, in
// widths of one set) and a start offset (same unit). Slightly different
// travel gives the rows a little depth.
const ROWS = [
  { dir: -1, travel: 0.5, start: 0 },
  { dir: 1, travel: 0.4, start: 0.35 },
  { dir: -1, travel: 0.6, start: 0.7 },
]

// Scroll while 03 is pinned to view the strip, then while it hands over to
// 04 (in viewport heights; shared with the 04 scene).
const PIN_LENGTH = FILM_VIEW_LENGTH
const HANDOVER_LENGTH = FILM_HANDOVER_LENGTH

// The rows travel as far as they did when 03 was pinned for 3.6 viewports;
// the pin is shorter now, the travel over the section's progress is not.
const TRAVEL_PIN_LENGTH = 3.6

// Small fixed tilts, repeated along each row.
const TILTS = [-1.5, 1, -0.5, 1.5, -1, 0.5, -1.25]

/**
 * 03: a dark scene with three rows of frames. Vertical scroll moves the
 * rows sideways (1 and 3 left, 2 right), scrubbed, so scrolling back
 * reverses it exactly; nothing moves on its own. Once the scene fills the
 * screen it is pinned for PIN_LENGTH viewports of scroll, so the whole strip
 * can be seen before 04; the rows keep the same speed per scrolled pixel.
 * Then, still pinned, the hand-over to 04 (HANDOVER_LENGTH): 04 is already
 * in place under 03 (see RouteTransition); the frames keep moving while they
 * fade, soften and lose contrast, and the dark background fades away, so 04
 * shows through on the same screen.
 * Reduced motion: no pin, the rows stay still.
 */
export default function FilmStrip() {
  const scope = useMotion(({ el, q, reduce }) => {
    const tracks = q('.film-strip__track')
    const setX = tracks.map((track) => gsap.quickSetter(track, 'x', 'px'))
    // Width of one set of frames, gap included: from the first frame of one
    // copy to the first of the next (layout offsets, so tilts don't count).
    let setWidths = []
    const measure = () => {
      setWidths = tracks.map((track, i) => {
        const frames = track.children
        const perSet = filmStrip.rows[i].length
        return frames[perSet].offsetLeft - frames[0].offsetLeft
      })
    }

    // Scroll lengths: a plain pass through the viewport, the viewing part of
    // the pin, and the whole pin (viewing + hand-over).
    const pass = () => window.innerHeight + el.offsetHeight
    const viewDistance = () => window.innerHeight * PIN_LENGTH
    const pinDistance = () => window.innerHeight * (PIN_LENGTH + HANDOVER_LENGTH)
    // Scales the per-row travel to the reference pin length (see above).
    let stretch = 1

    const render = (progress) => {
      ROWS.forEach(({ dir, travel, start }, i) => {
        const set = setWidths[i]
        setX[i](gsap.utils.wrap(-set, 0, (dir * travel * stretch * progress - start) * set))
      })
    }

    measure()
    render(0)
    if (reduce) return

    const pin = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: () => `+=${pinDistance()}`,
      pin: true,
      invalidateOnRefresh: true,
    })

    // From the section's top entering the viewport to its bottom leaving it,
    // pin included.
    const state = { progress: 0 }
    gsap.to(state, {
      progress: 1,
      ease: 'none',
      onUpdate: () => render(state.progress),
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: () => `+=${pass() + pinDistance()}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure()
          stretch = (pass() + window.innerHeight * TRAVEL_PIN_LENGTH) / pass()
          render(state.progress)
        },
      },
    })

    // Hand-over to 04, over the last part of the pin, slow and soft: the
    // frames fade and blur (gently at first), and the background colour
    // itself moves from 03's dark to 04's light tone (no see-through layer).
    // Once it matches 04 exactly, 03 turns transparent, which doesn't show,
    // and 04 assembles (RouteTransition).
    const light = getComputedStyle(document.documentElement).getPropertyValue('--tone-warm').trim() || '#f8f5f0'
    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: () => pin.start + viewDistance(),
          end: () => pin.end,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(tracks, { opacity: 1 }, { opacity: 0, duration: 0.66, ease: 'sine.inOut' }, 0)
      .fromTo(tracks, { filter: 'blur(0px)' }, { filter: 'blur(9px)', duration: 0.7, ease: 'power2.in' }, 0.04)
      .to(el, { backgroundColor: light, duration: 0.64, ease: 'sine.inOut' }, 0.12)
      // 04 starts to assemble from here (RouteTransition, at 0.8).
      .set(el, { backgroundColor: 'transparent' }, 0.78)
      .set({}, {}, 1)
  })

  return (
    <section ref={scope} id="film-strip" className="film-strip" aria-label={filmStrip.label}>
      {filmStrip.rows.map((frames, row) => (
        <div key={row} className="film-strip__row">
          <div className="film-strip__track">
            {Array.from({ length: COPIES }, (_, copy) =>
              frames.map((frame, i) => (
                <div
                  key={`${copy}-${frame.number}`}
                  className="film-strip__frame"
                  style={{ '--tilt': `${TILTS[(i + row * 2) % TILTS.length]}deg` }}
                  aria-hidden={copy > 0 || undefined}
                >
                  <span className="film-strip__number">{frame.number}</span>
                </div>
              )),
            )}
          </div>
        </div>
      ))}
    </section>
  )
}

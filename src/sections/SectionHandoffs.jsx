import { Children, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { useMotion } from '../hooks/useMotion.js'
import { useLenis } from '../hooks/useLenis.js'
import { scrollStep, releaseHeld } from '../lib/scrollStep.js'
import './SectionHandoffs.css'

// 07 is held on screen this long (viewport heights of scroll) before
// scrolling on can set off 07 → 08, so its entries can be read.
const DETAILS_HOLD = 0.08


/**
 * 06 → 07 → 08. Wraps 06, 07 and 08, each in a pane.
 *
 * Each pane after the first is laid exactly under the previous one's last
 * screen, so a hand-over happens in place, on one screen; it is set off by
 * scrolling on once the previous section has been scrolled through, plays
 * by itself with scroll held, and plays back on the way up
 * (lib/scrollStep.js).
 *
 * 06 → 07: 06 slides out to the left while 07 slides in from the right;
 * then 07's heading and its four entries come in one after another.
 * 07 → 08: once 07 has been held a moment (pinned, DETAILS_HOLD), 07 softens
 * and fades while 08 comes up out of the same blur.
 *
 * Reduced motion: none of this; the sections follow each other as usual.
 */
export default function SectionHandoffs({ children }) {
  const sections = Children.toArray(children)
  const lenisRef = useRef(null)
  lenisRef.current = useLenis()

  const scope = useMotion(({ el, reduce }) => {
    if (reduce) return

    el.classList.add('is-active')

    const vh = () => window.innerHeight
    const getLenis = () => lenisRef.current
    const [dress, details, rsvp] = gsap.utils.toArray(el.querySelectorAll('.section-handoffs__pane'))
    // What moves is the section inside each pane; the pane itself is only
    // laid out (and 07's pane pinned), so the two never mix.
    const [dressSection, detailsSection] = [dress, details].map((pane) => pane.firstElementChild)

    // Lay each pane under the previous pane's last screen.
    const place = () => {
      details.style.marginTop = `${-Math.min(dress.offsetHeight, vh())}px`
      rsvp.style.marginTop = `${-Math.min(details.offsetHeight, vh())}px`
    }
    place()
    ScrollTrigger.addEventListener('refreshInit', place)

    // ---------- 06 → 07: slide, then 07 fills in ----------

    const entries = [detailsSection.querySelector('.section-heading'), ...detailsSection.querySelectorAll('.detail')]
    // 06 scrolled through (its bottom at the screen's bottom), and not
    // before it has properly arrived.
    const dressDone = () => {
      const bottom = dress.getBoundingClientRect().bottom + window.scrollY - vh()
      const arrived = ScrollTrigger.getById('dress-code')
      return arrived ? Math.max(bottom, arrived.start + 4) : bottom
    }

    const toDetails = scrollStep({
      id: 'details',
      trigger: dress,
      start: dressDone,
      // Scroll input waits only for the slide; 07's entries then come in on
      // their own.
      holdUntil: 1.15,
      getLenis,
      build: (tl) =>
        tl
          .fromTo(dressSection, { xPercent: 0 }, { xPercent: -100, duration: 1.15, ease: 'power2.inOut' }, 0)
          .fromTo(detailsSection, { xPercent: 100 }, { xPercent: 0, duration: 1.15, ease: 'power2.inOut' }, 0)
          .fromTo(entries, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.18, ease: 'sine.out' }, 1.25),
    })

    // ---------- 07 → 08: blur dissolve ----------

    const hold = ScrollTrigger.create({
      trigger: details,
      start: 'bottom bottom',
      end: () => `+=${DETAILS_HOLD * vh()}`,
      pin: true,
      invalidateOnRefresh: true,
    })

    scrollStep({
      id: 'rsvp',
      trigger: details,
      // After 07's hold, and never before 07 has itself arrived.
      start: () => Math.max(hold.end, toDetails.trigger.start + DETAILS_HOLD * vh()),
      getLenis,
      build: (tl) =>
        tl
          .fromTo(detailsSection, { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(6px)', duration: 1, ease: 'sine.inOut' }, 0)
          .fromTo(rsvp, { autoAlpha: 0, filter: 'blur(6px)' }, { autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: 'sine.inOut' }, 0),
    })

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', place)
      releaseHeld()
      el.classList.remove('is-active')
      details.style.marginTop = ''
      rsvp.style.marginTop = ''
    }
  })

  return (
    <div ref={scope} className="section-handoffs">
      {sections.map((section, i) => (
        <div key={i} className={`section-handoffs__pane section-handoffs__pane--${i + 1}`}>
          {section}
        </div>
      ))}
    </div>
  )
}

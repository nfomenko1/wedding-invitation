import Section from '../components/Section.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ImageFrame from '../components/ImageFrame.jsx'
import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { useMotion } from '../hooks/useMotion.js'
import { dressCode } from '../content/wedding.js'
import './DressCode.css'

// Seconds for the ribbon to move by one full set of looks; about 14 s for a
// look to cross the visible width at each size.
const LOOP_SECONDS = { mobile: 42, tablet: 31, desktop: 25 }

/**
 * The looks run as an endless ribbon, right to left, on their own (not
 * scroll-driven): the set is laid out twice and the ribbon moves by exactly
 * one set per loop, so the wrap never shows. It only runs while 06 is on
 * screen. Reduced motion: still, the first looks in view.
 */
export default function DressCode() {
  const scope = useMotion(({ el, q, mobile, tablet, reduce }) => {
    if (reduce) return

    const ribbon = gsap.to(q('.looks')[0], {
      xPercent: -50,
      duration: mobile ? LOOP_SECONDS.mobile : tablet ? LOOP_SECONDS.tablet : LOOP_SECONDS.desktop,
      ease: 'none',
      repeat: -1,
      paused: true,
    })

    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? ribbon.play() : ribbon.pause()),
    })
  })

  return (
    <Section id="dress-code" tone="warm" marker={dressCode.marker} labelledBy="dress-code-title">
      <div ref={scope} className="dress">
        <div className="dress__header layout-grid">
          <div className="dress__intro">
            <SectionHeading id="dress-code-title" title={dressCode.title} />
            <p className="dress__description t-body">{dressCode.description}</p>
          </div>

          <div className="dress__palette">
            <p className="dress__palette-label t-label">{dressCode.paletteLabel}</p>
            <ul className="palette">
              {dressCode.palette.map((tone) => (
                <li key={tone.value} className="palette__item">
                  <span className="palette__swatch" style={{ '--swatch': tone.value }} aria-hidden="true" />
                  <span className="t-meta">{tone.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dress__looks">
          <ul className="looks">
            {/* The set twice, end to end; the second copy is decorative. */}
            {[0, 1].map((copy) =>
              dressCode.looks.map((look) => (
                <li key={`${copy}-${look.alt}`} className="looks__item" aria-hidden={copy > 0 || undefined}>
                  <ImageFrame ratio="3 / 4" {...look} />
                </li>
              )),
            )}
          </ul>
        </div>
      </div>
    </Section>
  )
}

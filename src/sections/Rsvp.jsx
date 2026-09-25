import { useRef } from 'react'
import Eyebrow from '../components/Eyebrow.jsx'
import Split from '../components/Split.jsx'
import RsvpDialog from '../components/RsvpDialog.jsx'
import { Flourish, Monogram } from '../components/Ornaments.jsx'
import { useMotion } from '../hooks/useMotion.js'
import { gsap } from '../lib/gsap.js'
import { draw, eyebrowIn, riseIn } from '../lib/animations.js'
import { couple, rsvp } from '../content/wedding.js'
import './Rsvp.css'

export default function Rsvp() {
  const dialogRef = useRef(null)

  const scope = useMotion(({ q, mobile, reduce }) => {
    if (reduce) return

    const pin = q('.rsvp__pin')[0]
    const flap = q('.envelope__flap')[0]
    const letter = q('.envelope__letter')[0]

    eyebrowIn(q('.eyebrow'), 'top 80%')

    // Start state: sealed envelope, letter tucked inside.
    gsap.set(flap, { zIndex: 4 })
    gsap.set(letter, { zIndex: 2, yPercent: 14 })

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: mobile
        ? { trigger: q('.envelope')[0], start: 'top 85%', end: 'bottom 35%', scrub: 1 }
        : { trigger: pin, start: 'top top', end: '+=160%', pin: true, scrub: 1 },
    })

    const chars = q('.rsvp__title .split__char')
    const copy = q('.rsvp__text, .rsvp__cta')

    if (mobile) {
      // Copy sits above the envelope on mobile, so it gets its own entrance.
      const enter = { trigger: q('.rsvp__title')[0], start: 'top 85%' }
      riseIn(chars, { stagger: 0.03, duration: 1.4, scrollTrigger: enter })
      gsap.from(copy, { autoAlpha: 0, y: 30, stagger: 0.1, duration: 1.2, delay: 0.4, ease: 'power3.out', scrollTrigger: enter })
    } else {
      tl.from(chars, { yPercent: 115, rotate: 6, stagger: 0.02, duration: 0.3, ease: 'power3.out' }, 0)
      tl.from(copy, { autoAlpha: 0, y: 30, stagger: 0.08, duration: 0.2, ease: 'power2.out' }, 0.15)
    }

    tl.to(q('.envelope__seal'), { scale: 0, autoAlpha: 0, rotate: -40, duration: 0.12, ease: 'power2.in' }, 0.25)
      .fromTo(flap, { rotationX: 0 }, { rotationX: 180, duration: 0.3, ease: 'power2.inOut' }, 0.3)
      .set(flap, { zIndex: 1 }, 0.45)
      .to(letter, { yPercent: -72, duration: 0.3, ease: 'power2.out' }, 0.55)
      .set(letter, { zIndex: 6 }, 0.85)
      .to(letter, { yPercent: 0, duration: 0.25, ease: 'power2.inOut' }, 0.86)
      .add(draw(q('.envelope__letter .draw'), { duration: 0.3, ease: 'none' }), 0.7)

    // Magnetic CTA on pointer devices.
    if (!mobile && window.matchMedia('(hover: hover)').matches) {
      const button = q('.cta')[0]
      const moveX = gsap.quickTo(button, 'x', { duration: 0.6, ease: 'power3.out' })
      const moveY = gsap.quickTo(button, 'y', { duration: 0.6, ease: 'power3.out' })
      const onMove = (e) => {
        const rect = button.getBoundingClientRect()
        moveX((e.clientX - (rect.left + rect.width / 2)) * 0.25)
        moveY((e.clientY - (rect.top + rect.height / 2)) * 0.35)
      }
      const onLeave = () => {
        moveX(0)
        moveY(0)
      }
      const zone = q('.rsvp__cta')[0]
      zone.addEventListener('pointermove', onMove)
      zone.addEventListener('pointerleave', onLeave)
      return () => {
        zone.removeEventListener('pointermove', onMove)
        zone.removeEventListener('pointerleave', onLeave)
      }
    }
  })

  return (
    <section className="rsvp tone-dark" id="rsvp" ref={scope} data-tone="dark" tabIndex={-1} aria-labelledby="rsvp-title">
      <div className="rsvp__pin">
        <span className="rsvp__glow" aria-hidden="true" />

        <div className="rsvp__copy">
          <Eyebrow index="05">Kindly Reply</Eyebrow>
          <h2 className="rsvp__title" id="rsvp-title">
            <Split text={rsvp.title[0]} by="chars" />
            <em>
              <Split text={rsvp.title[1]} by="chars" />
            </em>
          </h2>
          <p className="rsvp__text">{rsvp.text}</p>
          <div className="rsvp__cta">
            <button type="button" className="cta" onClick={() => dialogRef.current?.open()}>
              <span className="cta__label">{rsvp.cta}</span>
              <span className="cta__arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>

        <div className="rsvp__stage" aria-hidden="true">
          <div className="envelope">
            <span className="envelope__back" />
            <div className="envelope__letter">
              <p className="envelope__names script">
                {couple.first} &amp; {couple.second}
              </p>
              <p className="envelope__line">{rsvp.letter.line}</p>
              <Flourish className="envelope__flourish" />
              <p className="envelope__note">{rsvp.letter.note}</p>
            </div>
            <span className="envelope__front" />
            <span className="envelope__flap" />
            <span className="envelope__seal">
              <Monogram first={couple.first[0]} second={couple.second[0]} />
            </span>
          </div>
        </div>
      </div>

      <RsvpDialog ref={dialogRef} />
    </section>
  )
}

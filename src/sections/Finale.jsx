import Split from '../components/Split.jsx'
import { Rings } from '../components/Ornaments.jsx'
import { useMotion } from '../hooks/useMotion.js'
import { useScrollTo } from '../hooks/useScrollTo.js'
import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { draw } from '../lib/animations.js'
import { couple, finale, wedding } from '../content/wedding.js'
import './Finale.css'

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  scale: String(0.6 + ((i * 7) % 5) * 0.15),
}))

export default function Finale() {
  const scrollTo = useScrollTo()

  const scope = useMotion(({ el, q, mobile, reduce }) => {
    if (reduce) return

    const pin = q('.finale__pin')[0]

    // Names travel in from opposite sides and meet around the rings.
    gsap
      .timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: mobile
          ? { trigger: pin, start: 'top 75%', end: 'center 55%', scrub: 1 }
          : { trigger: pin, start: 'top top', end: '+=130%', pin: true, scrub: 1 },
      })
      .from(q('.finale__glow'), { scale: 0.3, autoAlpha: 0, duration: 1 }, 0)
      .add(draw(q('.finale__rings .draw'), { duration: 0.8, ease: 'none', stagger: 0.1 }), 0)
      .from(q('.finale__first'), { xPercent: mobile ? -40 : -70, autoAlpha: 0, duration: 0.9 }, 0.1)
      .from(q('.finale__second'), { xPercent: mobile ? 40 : 70, autoAlpha: 0, duration: 0.9 }, 0.1)
      .from(q('.finale__amp'), { scale: 0, rotate: -120, duration: 0.7, ease: 'back.out(1.7)' }, 0.5)
      .from(q('.finale__eyebrow'), { autoAlpha: 0, y: 20, duration: 0.5 }, 0.6)
      .from(q('.finale__date .split__char'), { yPercent: 115, stagger: 0.025, duration: 0.5 }, 0.7)
      .from(q('.finale__place'), { autoAlpha: 0, y: 16, duration: 0.5 }, 0.9)

    // Petals drift continuously, but only while the finale is on screen.
    const box = q('.finale__petals')[0]
    const petals = gsap.timeline({ paused: true })
    q('.petal').forEach((petal) => {
      const duration = gsap.utils.random(9, 15)
      petals.fromTo(
        petal,
        { y: 0, x: 0, rotation: gsap.utils.random(-90, 90) },
        {
          y: () => box.offsetHeight + 80,
          x: gsap.utils.random(-140, 140),
          rotation: `+=${gsap.utils.random(180, 540)}`,
          duration,
          ease: 'none',
          repeat: -1,
        },
        gsap.utils.random(0, duration),
      )
    })
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? petals.play() : petals.pause()),
    })

    return () => petals.kill()
  })

  return (
    <section className="finale tone-dark" id="finale" ref={scope} data-tone="dark" tabIndex={-1} aria-labelledby="finale-title">
      <div className="finale__pin">
        <span className="finale__glow" aria-hidden="true" />
        <div className="finale__petals" aria-hidden="true">
          {PETALS.map((petal, i) => (
            <span key={i} className="petal" style={{ left: petal.left, scale: petal.scale }} />
          ))}
        </div>

        <Rings className="finale__rings" />
        <p className="finale__eyebrow eyebrow">{finale.eyebrow}</p>
        <h2 className="finale__names" id="finale-title">
          <span className="finale__first">{couple.first}</span>
          <span className="finale__amp">&amp;</span>
          <span className="finale__second">{couple.second}</span>
        </h2>
        <p className="finale__date">
          <time dateTime={wedding.iso}>
            <Split text={wedding.dotted} by="chars" />
          </time>
        </p>
        <p className="finale__place">
          {wedding.venue} · {wedding.region}
        </p>
      </div>

      <footer className="container finale__footer">
        <p>{finale.footer}</p>
        <button type="button" className="finale__top" onClick={() => scrollTo('#top')}>
          Back to top ↑
        </button>
      </footer>
    </section>
  )
}

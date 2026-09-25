import Photo from '../components/Photo.jsx'
import Split from '../components/Split.jsx'
import { Corner, Flourish, Monogram } from '../components/Ornaments.jsx'
import { useMotion } from '../hooks/useMotion.js'
import { gsap } from '../lib/gsap.js'
import { clipIn, draw } from '../lib/animations.js'
import { couple, hero, wedding } from '../content/wedding.js'
import './Hero.css'

const CORNERS = ['tl', 'tr', 'bl', 'br']

export default function Hero() {
  const scope = useMotion(({ el, q, mobile, reduce }) => {
    if (reduce) return

    // ---- Opening: wax seal, curtain parts, invitation assembles ----
    const axis = mobile ? 'yPercent' : 'xPercent'
    gsap.set(q('.curtain'), { autoAlpha: 1 })

    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from(q('.curtain__seal'), { autoAlpha: 0, scale: 0.75, duration: 1.2, ease: 'power3.out' })
      .add(draw(q('.curtain__seal .draw'), { duration: 1.4, stagger: 0.12 }), 0)
      .from(q('.curtain__seal .monogram__letters'), { autoAlpha: 0, y: 12, duration: 1.1 }, 0.4)
      .to(q('.curtain__seal'), { autoAlpha: 0, scale: 1.25, duration: 0.7, ease: 'power2.in' }, 1.5)
      .to(q('.curtain__panel--a'), { [axis]: -101, duration: 1.6, ease: 'expo.inOut' }, 1.7)
      .to(q('.curtain__panel--b'), { [axis]: 101, duration: 1.6, ease: 'expo.inOut' }, 1.7)
      .set(q('.curtain'), { autoAlpha: 0 })
      .addLabel('open', 2.2)
      .add(clipIn(q('.hero__arch'), 'bottom', { duration: 1.9 }), 'open')
      .from(q('.hero__arch [data-photo-inner]'), { scale: 1.45, duration: 2.8 }, 'open')
      .from(q('.hero__arch-ring'), { autoAlpha: 0, scale: 0.94, duration: 1.8 }, 'open+=0.8')
      .from(q('.hero__name .split__char'), { yPercent: 120, rotate: 7, duration: 1.6, stagger: 0.045 }, 'open+=0.45')
      .from(q('.hero__amp'), { autoAlpha: 0, scale: 0.4, rotate: -30, duration: 1.8 }, 'open+=1')
      .add(draw(q('.hero__corner .draw'), { duration: 2.2, stagger: 0.04 }), 'open+=0.3')
      .from(q('.hero__reveal'), { autoAlpha: 0, y: 22, duration: 1.4, stagger: 0.12 }, 'open+=1.1')
      .add(draw(q('.hero__flourish .draw'), { duration: 1.8 }), 'open+=1.3')
      .from(q('.hero__cue-inner'), { autoAlpha: 0, y: -12, duration: 1.2 }, 'open+=2')

    // ---- Scroll out: hero stays pinned while the next section slides over it ----
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          pin: q('.hero__pin')[0],
          pinSpacing: false,
        },
      })
      .to(q('.hero__stage'), { scale: mobile ? 0.9 : 0.84, yPercent: -4 }, 0)
      .to(q('.hero__name--first'), { xPercent: mobile ? -10 : -16 }, 0)
      .to(q('.hero__name--second'), { xPercent: mobile ? 10 : 16 }, 0)
      .to(q('.hero__cue'), { autoAlpha: 0, duration: 0.15 }, 0)
      .to(q('.hero__shade'), { opacity: 0.8 }, 0)
  })

  return (
    <section className="hero tone-dark" id="top" ref={scope} data-tone="dark" tabIndex={-1} aria-labelledby="hero-title">
      <div className="hero__pin">
        <div className="hero__frame" aria-hidden="true">
          {CORNERS.map((corner) => (
            <Corner key={corner} className={`hero__corner hero__corner--${corner}`} />
          ))}
        </div>

        <p className="hero__eyebrow eyebrow hero__reveal">{hero.eyebrow}</p>

        <div className="hero__stage">
          <span className="hero__arch-ring" aria-hidden="true" />
          <div className="hero__arch">
            <Photo {...hero.image} />
          </div>
          <h1 className="hero__names" id="hero-title">
            <Split className="hero__name hero__name--first" text={couple.first} by="chars" />
            <span className="hero__amp">&amp;</span>
            <Split className="hero__name hero__name--second" text={couple.second} by="chars" />
          </h1>
        </div>

        <div className="hero__meta">
          <Flourish className="hero__flourish" />
          <p className="hero__date hero__reveal">
            <time dateTime={wedding.iso}>{wedding.dotted}</time>
          </p>
          <p className="hero__place hero__reveal">
            {wedding.venue} — {wedding.region}
          </p>
        </div>

        <div className="hero__cue" aria-hidden="true">
          <div className="hero__cue-inner">
            <span>Scroll</span>
            <span className="hero__cue-line" />
          </div>
        </div>

        <div className="hero__shade" aria-hidden="true" />
      </div>

      <div className="curtain" aria-hidden="true">
        <div className="curtain__panel curtain__panel--a" />
        <div className="curtain__panel curtain__panel--b" />
        <div className="curtain__seal">
          <Monogram first={couple.first[0]} second={couple.second[0]} />
        </div>
      </div>
    </section>
  )
}

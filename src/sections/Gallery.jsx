import Eyebrow from '../components/Eyebrow.jsx'
import Photo from '../components/Photo.jsx'
import Split from '../components/Split.jsx'
import { useMotion } from '../hooks/useMotion.js'
import { gsap } from '../lib/gsap.js'
import { clipIn, eyebrowIn, parallax, riseIn } from '../lib/animations.js'
import { gallery } from '../content/wedding.js'
import './Gallery.css'

const pad = (n) => String(n).padStart(2, '0')

export default function Gallery() {
  const total = gallery.items.length

  const scope = useMotion(({ el, q, mobile, reduce }) => {
    if (reduce) return

    const pin = q('.gallery__pin')[0]
    const viewport = q('.gallery__viewport')[0]
    const track = q('.gallery__track')[0]
    const items = q('.gallery__item')

    eyebrowIn(q('.eyebrow'), 'top 80%')
    riseIn(q('.gallery__title .split__char'), {
      stagger: 0.035,
      duration: 1.5,
      scrollTrigger: { trigger: viewport, start: 'top 75%' },
    })

    if (mobile) {
      // Native swipe carousel; photos wipe in as the section arrives.
      items.slice(0, 3).forEach((item, i) => {
        clipIn(item.querySelector('.photo'), 'bottom', {
          duration: 1.5,
          delay: i * 0.12,
          scrollTrigger: { trigger: viewport, start: 'top 80%' },
        })
      })
      parallax(q('.gallery__bgword'), { xPercent: 5 }, { xPercent: -30 }, el)
      return
    }

    // ---- Desktop / tablet: vertical scroll drives a horizontal film strip ----
    gsap.set(viewport, { overflow: 'hidden' })
    gsap.set(q('.gallery__hud'), { autoAlpha: 1 })

    const counter = q('.gallery__count')[0]
    const setBar = gsap.quickSetter(q('.gallery__bar')[0], 'scaleX')
    const distance = () => track.scrollWidth - viewport.clientWidth
    let current = 1

    const strip = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setBar(self.progress)
          const index = Math.min(total, Math.floor(self.progress * total) + 1)
          if (index !== current) {
            current = index
            counter.textContent = pad(index)
          }
        },
      },
    })

    // Background word drifts slower than the strip.
    gsap.fromTo(
      q('.gallery__bgword'),
      { xPercent: 0 },
      {
        xPercent: -38,
        ease: 'none',
        scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${distance()}`, scrub: 1, invalidateOnRefresh: true },
      },
    )

    items.forEach((item) => {
      const photo = item.querySelector('.photo')
      const inner = photo.querySelector('[data-photo-inner]')
      const along = { containerAnimation: strip, trigger: item }

      // Frame opens and grows as it travels toward the centre.
      gsap.fromTo(
        photo,
        { scale: 0.8, clipPath: 'inset(14% 6% 14% 6%)' },
        {
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power1.out',
          scrollTrigger: { ...along, start: 'left 100%', end: 'center 55%', scrub: true },
        },
      )
      // Image slides inside its frame (sideways parallax).
      gsap.fromTo(
        inner,
        { xPercent: 9 },
        { xPercent: -9, ease: 'none', scrollTrigger: { ...along, start: 'left right', end: 'right left', scrub: true } },
      )
      gsap.from(item.querySelector('.gallery__caption'), {
        autoAlpha: 0,
        y: 24,
        ease: 'none',
        scrollTrigger: { ...along, start: 'left 72%', end: 'left 48%', scrub: true },
      })
    })

    gsap.from(q('.gallery__outro .split__word'), {
      yPercent: 115,
      stagger: 0.05,
      ease: 'none',
      scrollTrigger: { containerAnimation: strip, trigger: q('.gallery__outro')[0], start: 'left 85%', end: 'left 55%', scrub: true },
    })
  })

  return (
    <section className="gallery tone-dark" id="gallery" ref={scope} data-tone="dark" tabIndex={-1} aria-labelledby="gallery-title">
      <div className="gallery__pin">
        <span className="gallery__bgword" aria-hidden="true">
          Moments
        </span>

        <div className="gallery__viewport" tabIndex={0} role="region" aria-label="Photo gallery">
          <ul className="gallery__track">
            <li className="gallery__intro">
              <Eyebrow index="03">Gallery</Eyebrow>
              <h2 className="display gallery__title" id="gallery-title">
                <Split text={gallery.title} by="chars" />
              </h2>
              <p className="gallery__text">{gallery.text}</p>
            </li>

            {gallery.items.map((item, i) => (
              <li key={item.caption} className={`gallery__item gallery__item--${item.size}`}>
                <Photo tone={item.tone} motif={item.motif} alt={item.alt} pan />
                <p className="gallery__caption">
                  <span className="gallery__index">{pad(i + 1)}</span>
                  {item.caption}
                </p>
              </li>
            ))}

            <li className="gallery__outro">
              <Split as="p" text={gallery.outro} />
            </li>
          </ul>
        </div>

        <div className="gallery__hud" aria-hidden="true">
          <span className="gallery__counter">
            <span className="gallery__count">01</span> / {pad(total)}
          </span>
          <span className="gallery__progress">
            <span className="gallery__bar" />
          </span>
        </div>
      </div>
    </section>
  )
}

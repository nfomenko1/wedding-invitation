import { gsap } from '../lib/gsap.js'
import { useMotion } from '../hooks/useMotion.js'
import './IntroTransition.css'

// Box of `el` in `root`'s coordinates. Offsets ignore transforms, so the
// result is the resting layout even mid-animation.
function boxIn(el, root) {
  let x = 0
  let y = 0
  for (let n = el; n && n !== root; n = n.offsetParent) {
    x += n.offsetLeft
    y += n.offsetTop
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

/**
 * Scroll-driven transition from 01 Intro to 02 Invitation.
 *
 * Tablet / desktop: the two sections sit side by side on a track. The track
 * is pinned and vertical scroll moves it left; the Hero portrait grows
 * slightly and travels into the Invitation portrait's place. Its frame is
 * the one frame throughout: once it lands, only the photo inside changes
 * (Hero photo blurs out, Invitation photo focuses in). Scrubbed, so
 * scrolling up plays it back in reverse.
 * Mobile: sections stay stacked; the portraits drift horizontally.
 * Reduced motion: stacked and static.
 */
export default function IntroTransition({ children }) {
  const scope = useMotion(({ el, q, mobile, reduce }) => {
    if (reduce) return

    const hero = q('#intro')[0]
    const heroVisual = q('.hero__visual')[0]
    const invVisual = q('.invitation__visual')[0]

    if (mobile) {
      gsap.to(heroVisual, {
        xPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: heroVisual, start: 'center center', end: 'bottom top', scrub: true },
      })
      gsap.from(invVisual, {
        xPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: invVisual, start: 'top bottom', end: 'top 40%', scrub: true },
      })
      return
    }

    const track = q('.intro-transition__track')[0]

    // Hero portrait → Invitation portrait, centre to centre, matched by height.
    const handover = () => {
      const from = boxIn(heroVisual, track)
      const to = boxIn(invVisual, track)
      return {
        x: to.x + to.w / 2 - (from.x + from.w / 2),
        y: to.y + to.h / 2 - (from.y + from.h / 2),
        scale: to.h / from.h,
      }
    }

    // Photos inside the frames (the <img> or its placeholder).
    const heroPhoto = q('.hero__image > *')
    const invPhoto = q('.invitation__image > *')

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: el,
        // Pin once the whole Hero is in view (it can be taller than the screen).
        start: () => `top+=${Math.max(0, hero.offsetHeight - window.innerHeight)} top`,
        // Longer than the move itself so the photo swap has room after it.
        end: () => `+=${Math.round(window.innerHeight * 2)}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    })

    tl.to(q('.hero__glass'), { autoAlpha: 0, duration: 0.3 }, 0)
      .to(q('.hero__text'), { xPercent: -12, autoAlpha: 0, duration: 0.45, ease: 'power1.in' }, 0)
      .to(heroVisual, { scale: 1.05, duration: 0.25, ease: 'power1.out' }, 0)
      .to(track, { xPercent: -50, duration: 0.8, ease: 'power2.inOut' }, 0.2)
      .to(
        heroVisual,
        {
          x: () => handover().x,
          y: () => handover().y,
          scale: () => handover().scale,
          duration: 0.75,
          ease: 'power2.inOut',
        },
        0.25,
      )
      .from(
        q('.invitation__heading, .invitation__body'),
        { xPercent: 15, autoAlpha: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
        0.55,
      )
      // The frame stays; only the photo inside it changes. The Invitation
      // photo sits exactly on the landed frame and focuses in over the Hero one.
      .to(heroPhoto, { autoAlpha: 0, scale: 1.02, filter: 'blur(8px)', duration: 0.3, ease: 'power1.in' }, 0.9)
      .fromTo(
        invPhoto,
        { autoAlpha: 0, scale: 1.03, filter: 'blur(8px)' },
        { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' },
        1,
      )
  })

  return (
    <div ref={scope} className="intro-transition">
      <div className="intro-transition__track">{children}</div>
    </div>
  )
}

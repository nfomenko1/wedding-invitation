import { gsap } from './gsap.js'

// Shared animation building blocks. Each returns its tween so it can be
// nested in a timeline, or given its own scrollTrigger through `vars`.

const INSETS = {
  top: 'inset(0% 0% 100% 0%)',
  bottom: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  center: 'inset(18% 18% 18% 18%)',
}

export const CLIP_FULL = 'inset(0% 0% 0% 0%)'

/** Words or chars rising out of their <Split> masks. */
export function riseIn(targets, vars = {}) {
  return gsap.from(targets, {
    yPercent: 115,
    rotate: 5,
    duration: 1.3,
    ease: 'expo.out',
    stagger: 0.04,
    ...vars,
  })
}

/** Clip-path wipe. `from` is the edge the reveal grows from. */
export function clipIn(target, from = 'bottom', vars = {}) {
  return gsap.fromTo(
    target,
    { clipPath: INSETS[from] },
    { clipPath: CLIP_FULL, duration: 1.4, ease: 'expo.inOut', ...vars },
  )
}

/** Draws SVG strokes. Paths need pathLength="1" and the .draw class. */
export function draw(targets, vars = {}) {
  return gsap.fromTo(
    targets,
    { strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', ...vars },
  )
}

/** Scroll-linked movement across the trigger's whole pass through the viewport. */
export function parallax(target, from, to, trigger = target, scrollVars = {}) {
  return gsap.fromTo(target, from, {
    ...to,
    ease: 'none',
    scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true, ...scrollVars },
  })
}

/** <Eyebrow> entrance: the rule draws, the labels slide in. */
export function eyebrowIn(eyebrows, start = 'top 88%') {
  gsap.utils.toArray(eyebrows).forEach((eyebrow) => {
    gsap
      .timeline({ scrollTrigger: { trigger: eyebrow, start } })
      .from(eyebrow.querySelector('.eyebrow__line'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' })
      .from(
        eyebrow.querySelectorAll('.eyebrow__text'),
        { autoAlpha: 0, x: -14, duration: 1, stagger: 0.12, ease: 'power3.out' },
        0.25,
      )
  })
}

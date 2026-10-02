import { gsap, ScrollTrigger } from './gsap.js'

/**
 * Scroll steps: a timeline set off by crossing a scroll position, played
 * forward on the way down and in reverse on the way up. While its main
 * motion plays (up to `holdUntil`, or the whole step), scroll input is set
 * aside so the page can't run on mid-step; a wheel / swipe the other way
 * turns it round from where it is. Scrolling itself is never switched off
 * (no overflow change), so the scrollbar and the layout stay put.
 * When a step settles, the scroll position is put on the matching side of
 * its start, so scrolling carries on from there.
 *
 * Create steps inside a gsap.context() (useGsap / useMotion) so their
 * ScrollTrigger and timeline are reverted on unmount.
 */

let held = null
let navigating = false

const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'])

// Stop any scroll still in motion (Lenis easing out) where it is.
function halt(step) {
  const lenis = step.getLenis()
  if (lenis) lenis.scrollTo(lenis.scroll, { immediate: true, force: true })
}

function hold(step) {
  held = step
  halt(step)
}

function letGo(step) {
  if (held === step) held = null
}

function settle(step, forward) {
  letGo(step)
  const lenis = step.getLenis()
  if (!lenis) return
  const y = step.trigger.start + (forward ? 2 : -2)
  if (forward ? lenis.scroll < y : lenis.scroll > y) lenis.scrollTo(y, { immediate: true, force: true })
}

/**
 * @param {object} options
 * @param {Element} options.trigger  ScrollTrigger trigger element
 * @param {string|number|Function} options.start  ScrollTrigger start
 * @param {Function} options.getLenis  returns the Lenis instance (or null)
 * @param {Function} options.build  receives the paused timeline to fill
 * @param {number} [options.speed=1]  reverse speed
 * @param {number} [options.holdUntil]  time in the timeline after which,
 *   going forward, scroll input is accepted again (default: its end)
 * @param {string} [options.id]  ScrollTrigger id (e.g. for navigation)
 */
export function scrollStep({ trigger, start, getLenis, build, speed = 1, holdUntil, id }) {
  const step = { speed, getLenis }
  step.tl = gsap.timeline({
    paused: true,
    onComplete: () => settle(step, true),
    onReverseComplete: () => settle(step, false),
  })
  build(step.tl)
  if (holdUntil !== undefined) {
    step.tl.add(() => {
      if (!step.tl.reversed()) letGo(step)
    }, holdUntil)
  }
  step.trigger = ScrollTrigger.create({
    id,
    trigger,
    start,
    invalidateOnRefresh: true,
    onEnter: () => {
      if (step.tl.progress() === 1) return
      // Passed over by the navigation: just be in the end state.
      if (navigating) return void step.tl.pause().progress(1, true)
      if (step.tl.time() < (holdUntil ?? Infinity)) hold(step)
      step.tl.timeScale(1).play()
    },
    onLeaveBack: () => {
      if (step.tl.progress() === 0) return
      if (navigating) return void step.tl.pause().progress(0, true)
      hold(step)
      step.tl.timeScale(step.speed).reverse()
    },
  })
  return step
}

/**
 * While the navigation moves the page, steps it passes snap to their end
 * (or start) state instead of playing. A step that is playing is finished
 * first, in its current direction.
 */
export function setNavigating(on) {
  navigating = on
  if (!on || !held) return
  const step = held
  held = null
  step.tl.pause().progress(step.tl.reversed() ? 0 : 1, true)
}

export const isNavigating = () => navigating

/** Accepts scroll input again if a step is holding it (e.g. on unmount). */
export function releaseHeld() {
  held = null
}

// Turning round mid-step.
function steer(dir) {
  if (!held || !dir) return
  const { tl, speed } = held
  if (dir > 0 && tl.reversed()) tl.timeScale(1).play()
  else if (dir < 0 && !tl.reversed()) tl.timeScale(speed).reverse()
}

// While a step holds, scroll input goes to steering instead of scrolling.
// Capture on window runs before Lenis' own listeners.
if (typeof window !== 'undefined') {
  let touchY = null
  window.addEventListener(
    'wheel',
    (e) => {
      if (!held) return
      e.preventDefault()
      e.stopPropagation()
      steer(Math.sign(e.deltaY))
    },
    { capture: true, passive: false },
  )
  window.addEventListener(
    'touchstart',
    (e) => {
      touchY = e.touches[0].clientY
    },
    { capture: true, passive: true },
  )
  window.addEventListener(
    'touchmove',
    (e) => {
      if (!held || touchY === null) return
      e.preventDefault()
      e.stopPropagation()
      const dy = touchY - e.touches[0].clientY
      if (Math.abs(dy) > 12) {
        steer(Math.sign(dy))
        touchY = e.touches[0].clientY
      }
    },
    { capture: true, passive: false },
  )
  window.addEventListener(
    'keydown',
    (e) => {
      if (!held || !SCROLL_KEYS.has(e.key)) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      e.preventDefault()
      steer(e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Home' || (e.key === ' ' && e.shiftKey) ? -1 : 1)
    },
    { capture: true },
  )
}

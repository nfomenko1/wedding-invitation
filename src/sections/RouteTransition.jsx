import { Children, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { useMotion } from '../hooks/useMotion.js'
import { useLenis } from '../hooks/useLenis.js'
import { scrollStep, releaseHeld, isNavigating } from '../lib/scrollStep.js'
import { location } from '../content/wedding.js'
import { FILM_HANDOVER_LENGTH } from './sceneTiming.js'
import './RouteTransition.css'

// Pinned scroll of the 04 scene, in viewport heights: under 03 while 03
// dissolves, a pause once 04 has assembled, the point where scrolling sets
// off the route to 05, and the finished 05 screen before the page moves on.
const HANDOVER_LENGTH = FILM_HANDOVER_LENGTH
const DWELL_LENGTH = 0.25
const START_LENGTH = 0.05
const FINAL_HOLD = 0.06
// The scene stays pinned a little past the point where the 05 → 06
// crossfade sets off, so a scroll that overshoots it can't move the photo.
const EXIT_BUFFER = 0.5

// Reverse plays the same sequence back, a little quicker.
const REVERSE_SPEED = 1.3

/**
 * 03 → 04 → 05. Wraps 04 (first child) and 05 (second).
 *
 * 03 → 04: the 04 scene is laid under 03 so that it fills the screen, pinned,
 * when 03 starts to dissolve; 03 fades away over it (FilmStrip). Once 03 is
 * gone, 04 assembles by itself (not scrubbed): the label, the title, then
 * the timeline point by point, left to right, its line drawing in.
 *
 * 04 → 05 (TIME → ROUTE → LOCATION): scrolling on sets it off; from there it
 * plays by itself as one sequence: the timeline goes except its last point,
 * a route draws out of it to a destination point labelled "Место проведения
 * мероприятия", a pause, the point opens into 05 (the venue photo, full
 * screen; 05 sits in the scene, over the route, clipped to the point),
 * another pause, then the venue, city and map place come in. Scroll is held
 * while it plays, so the page can't run on mid-sequence; scrolling back past
 * the start plays the same sequence in reverse. A wheel / swipe the other
 * way mid-sequence turns it round from where it is.
 *
 * 05 → 06: 06 sits under 05's screen, placed so that it shows from just
 * above its label (no empty band). The next scroll sets off a short
 * crossfade, held in place the same way, with the scene still pinned: the
 * venue, city and map fade, the photo softens (slight blur and push-in) and
 * the whole scene fades away over 06. Scrolling back up plays it in reverse.
 *
 * Reduced motion: none of this; 04 and 05 follow each other as usual.
 */
export default function RouteTransition({ children }) {
  const [schedule, next] = Children.toArray(children)
  // Read through a ref, so the scene is set up once, in page order (the
  // Lenis instance arrives after the first render).
  const lenisRef = useRef(null)
  lenisRef.current = useLenis()

  const scope = useMotion(({ el, q, desktop, reduce }) => {
    if (reduce) return

    el.classList.add('is-active')

    const vh = () => window.innerHeight
    const scene = q('.route-transition__scene')[0]
    const nextWrap = q('.route-transition__next')[0]
    const overlay = q('.route-transition__overlay')[0]
    const section = scene.querySelector('#schedule')
    const film = document.querySelector('#film-strip')
    const items = gsap.utils.toArray(section.querySelectorAll('.timeline__item'))
    const last = items[items.length - 1]
    const lastDot = last.querySelector('.timeline__dot')
    const svg = q('.route-transition__route')[0]
    const path = q('.route-transition__path')[0]
    const dest = q('.route-transition__dest')[0]
    const label = q('.route-transition__label')[0]
    const venue = nextWrap.querySelector('#location')

    // Lay the scene under 03: its pin starts when its bottom meets the
    // screen's bottom, which must be when 03's hand-over starts, i.e. 03's
    // height plus the hand-over before the end of 03's pin spacing.
    const after = el.nextElementSibling
    const place = () => {
      const offset = film ? film.offsetHeight + HANDOVER_LENGTH * vh() : 0
      scene.style.marginTop = `${-(offset + Math.max(0, scene.offsetHeight - vh()))}px`
      // 06 under the scene's screen (05) at the crossfade point, below it in
      // the stack, shown with its content just clear of the top navigation
      // (the rest of its top padding is left above the screen).
      if (after) {
        const first = after.querySelector('.section__inner')
        const shift = first ? Math.max(0, first.offsetTop - Math.max(96, vh() * 0.11)) : 0
        after.style.marginTop = `${-(nextWrap.offsetHeight + EXIT_BUFFER * vh() + shift)}px`
        after.style.zIndex = '0'
      }
    }

    // Route geometry in the overlay's box (the screen while pinned).
    // Desktop: the timeline runs across and its last segment already runs
    // right from the last point, so the route carries on from that segment's
    // end, bends and comes back to a point under (or over) the centre.
    // Mobile / tablet: the timeline runs down, so the route bends from the
    // last point to the right.
    const geo = { length: 0, x: 0, y: 0, cover: 0 }
    const measure = () => {
      const box = overlay.getBoundingClientRect()
      const dot = lastDot.getBoundingClientRect()
      const w = box.width
      const h = box.height
      // The timeline's own line is a 1px box that starts at the point's
      // centre (desktop: running right; mobile: running down), so its centre
      // is half a pixel off the point's: follow the line, not the point.
      const axis = last.querySelector('.timeline__axis').getBoundingClientRect()
      // Desktop: the line is drawn on whole pixels, so its centre is the
      // rounded position plus half a pixel; the route starts exactly on it.
      const x0 = desktop ? dot.left + dot.width / 2 - box.left : axis.left + axis.width / 2 + 0.5 - box.left
      const y0 = desktop ? Math.round(axis.top + axis.height / 2) + 0.5 - Math.round(box.top) : dot.top + dot.height / 2 - box.top
      // Down if there is room under the last point, else up.
      const dir = h * 0.9 - y0 > h * 0.16 ? 1 : -1
      let d
      let x
      let y
      // The route starts where the timeline's own last segment ends, so no
      // stretch of line is drawn twice.
      if (desktop) {
        x = w * 0.5
        y = y0 + dir * h * 0.18
        // End of the last segment (the item's right edge), then a rounded turn.
        const xe = Math.round(last.getBoundingClientRect().right) - Math.round(box.left)
        const r = Math.max(12, Math.min(32, w - xe - 12, Math.abs(y - y0) / 2))
        d = `M${xe} ${y0} Q${xe + r} ${y0} ${xe + r} ${y0 + dir * r} V${y - dir * r} Q${xe + r} ${y} ${xe} ${y} H${x}`
      } else {
        x = w * 0.62
        y = y0 + dir * h * 0.16
        const r = Math.min(56, Math.abs(y - y0) * 0.6)
        // Going up, the last item's segment already runs from its top to the
        // point: start at its top.
        const ys = dir < 0 ? Math.max(y + r, axis.top - box.top) : y0
        d = `M${x0} ${ys} V${y - dir * r} Q${x0} ${y} ${x0 + r} ${y} H${x}`
      }
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      path.setAttribute('d', d)
      geo.length = path.getTotalLength()
      geo.x = x
      geo.y = y
      // Radius that covers the whole screen from the destination point.
      geo.cover = Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2
      gsap.set(path, { strokeDasharray: geo.length })
      gsap.set(dest, { left: x, top: y })
      // Label: desktop above the route (which runs right from the point),
      // mobile / tablet under the point, centred, kept on screen.
      const lw = label.offsetWidth
      const lh = label.offsetHeight
      const gap = 16
      gsap.set(
        label,
        desktop
          ? { left: x - 4, top: y - gap - lh }
          : { left: Math.min(Math.max(x - lw / 2, gap), w - lw - gap), top: y + gap },
      )
    }

    const onRefreshInit = () => {
      place()
      measure()
    }
    place()
    measure()
    ScrollTrigger.addEventListener('refreshInit', onRefreshInit)

    // ---------- 04 scene pin: hand-over + pause + route ----------

    const pin = ScrollTrigger.create({
      trigger: scene,
      start: 'bottom bottom',
      end: () => `+=${(HANDOVER_LENGTH + DWELL_LENGTH + START_LENGTH + FINAL_HOLD + EXIT_BUFFER) * vh()}`,
      pin: true,
      invalidateOnRefresh: true,
    })

    // ---------- 04 assembles by itself once 03 has gone ----------
    // Opacity / position / clip here; the route below uses filter, so the
    // two never fight over a property.

    const heading = section.querySelectorAll('.schedule__title, .schedule__lead')
    const veil = section.querySelector('.schedule__veil')
    // The axis (line + point) draws in along the timeline's direction.
    const hidden = desktop ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 100% 0%)'

    const enter = gsap.timeline({ paused: true, defaults: { ease: 'sine.out' } })
    enter
      .fromTo(heading, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.2 }, 0)
      .fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.3 }, 0.6)
    items.forEach((item, i) => {
      const at = 1 + i * 0.5
      enter
        .fromTo(item.querySelector('.timeline__time'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.9 }, at)
        .fromTo(item.querySelector('.timeline__axis'), { clipPath: hidden }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power1.inOut' }, at + 0.12)
        .fromTo(item.querySelector('.timeline__title'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.9 }, at + 0.25)
    })

    ScrollTrigger.create({
      id: 'schedule',
      trigger: scene,
      // 03 has turned transparent (FilmStrip, at 0.78 of the hand-over).
      start: () => pin.start + HANDOVER_LENGTH * vh() * 0.8,
      end: () => pin.end,
      invalidateOnRefresh: true,
      // Passed over by the navigation: just be assembled / not.
      onEnter: () => (isNavigating() ? enter.pause().progress(1) : enter.timeScale(1).play()),
      onLeaveBack: () => (isNavigating() ? enter.pause().progress(0) : enter.timeScale(2.5).reverse()),
    })

    // ---------- 04 → 05: one sequence, set off by scrolling ----------
    // Filter on 04 here, so it never fights 04's entrance (opacity / clip).

    const going = [section.querySelector('.schedule__header'), veil, ...items.slice(0, -1)]
    const lastTitle = last.querySelector('.timeline__title')
    const clip = (r) => `circle(${r}px at ${geo.x}px ${geo.y}px)`
    const venueParts = [venue.querySelector('.location__venue'), venue.querySelector('.location__city')]
    const map = venue.querySelector('.location__map')

    // Steps (scroll held while they play, reversible): lib/scrollStep.js.
    const getLenis = () => lenisRef.current

    scrollStep({
      id: 'location',
      trigger: scene,
      start: () => pin.start + (HANDOVER_LENGTH + DWELL_LENGTH + START_LENGTH) * vh(),
      speed: REVERSE_SPEED,
      // Scroll input waits until the photo is full; text and map then come
      // in on their own.
      holdUntil: 5.3,
      getLenis,
      build: (seq) =>
        seq
        // The timeline goes; its last point stays a while longer.
        .fromTo(going, { filter: 'opacity(1) blur(0px)' }, { filter: 'opacity(0) blur(4px)', duration: 0.9, stagger: 0.06, ease: 'sine.inOut' }, 0)
        .fromTo(lastTitle, { filter: 'opacity(1)' }, { filter: 'opacity(0)', duration: 0.6, ease: 'sine.inOut' }, 0.4)
        // The route draws out of it to the destination.
        .fromTo(path, { strokeDashoffset: () => geo.length }, { strokeDashoffset: 0, duration: 1.6, ease: 'sine.inOut' }, 0.5)
        .fromTo(dest, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'sine.out' }, 2.0)
        .fromTo(label, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'sine.out' }, 2.2)
        // ~1 s pause, then the point opens into 05.
        .to(label, { autoAlpha: 0, duration: 0.6, ease: 'sine.in' }, 3.7)
        .to(dest, { scale: 3, autoAlpha: 0, duration: 0.7, ease: 'sine.in' }, 3.7)
        .fromTo(nextWrap, { clipPath: () => clip(0) }, { clipPath: () => clip(geo.cover), duration: 1.6, ease: 'sine.inOut' }, 3.7)
        // ~1 s pause, then the venue, the city and the map place.
        .fromTo(venue.querySelector('.location__shade'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'sine.inOut' }, 6.3)
        .fromTo(venueParts, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 1.2, stagger: 0.4, ease: 'sine.out' }, 6.5)
        .fromTo(map, { autoAlpha: 0, x: 12 }, { autoAlpha: 1, x: 0, duration: 1.2, ease: 'sine.out' }, 7),
    })

    // ---------- 05 → 06: crossfade over 06, set off by the next scroll ----------
    // Filter on the venue parts, so it never fights the sequence's fades.

    const toDress = scrollStep({
      id: 'dress-code',
      trigger: scene,
      start: () => pin.end - EXIT_BUFFER * vh(),
      getLenis,
      build: (exit) =>
        exit
          // The scroll is put just past the start (where the step settles)
          // now, while the pinned scene still covers 06, not once 06 is in
          // view: no small jump at the end.
          .add(() => {
            const lenis = getLenis()
            const y = toDress.trigger.start + 2
            if (!exit.reversed() && lenis && lenis.scroll < y) lenis.scrollTo(y, { immediate: true, force: true })
          }, 0.05)
          .fromTo([...venueParts, map, venue.querySelector('.location__shade')], { filter: 'opacity(1)' }, { filter: 'opacity(0)', duration: 0.8, ease: 'sine.inOut' }, 0)
          .fromTo(venue.querySelector('.location__photo'), { scale: 1, filter: 'blur(0px)' }, { scale: 1.035, filter: 'blur(4px)', duration: 1.6, ease: 'sine.inOut' }, 0)
          .fromTo(scene, { opacity: 1 }, { opacity: 0, duration: 1.2, ease: 'sine.inOut' }, 0.4),
    })

    return () => {
      releaseHeld()
      ScrollTrigger.removeEventListener('refreshInit', onRefreshInit)
      el.classList.remove('is-active')
      scene.style.marginTop = ''
      if (after) {
        after.style.marginTop = ''
        after.style.zIndex = ''
      }
    }
  })

  return (
    <div ref={scope} className="route-transition">
      <div className="route-transition__scene">
        {schedule}
        <div className="route-transition__overlay" aria-hidden="true">
          <svg className="route-transition__route" preserveAspectRatio="none">
            <path className="route-transition__path" />
          </svg>
          <span className="route-transition__dest" />
          <p className="route-transition__label t-label">{location.routeLabel}</p>
        </div>
        <div className="route-transition__next">{next}</div>
      </div>
    </div>
  )
}

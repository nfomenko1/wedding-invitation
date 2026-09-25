import { gsap, MEDIA } from '../lib/gsap.js'
import { useGsap } from './useGsap.js'

/**
 * useGsap + gsap.matchMedia(): `setup` runs once per matching media state
 * and is re-run (after a full revert) when the breakpoint or the
 * reduced-motion preference changes.
 *
 * setup receives { el, q, mobile, tablet, desktop, reduce }
 *   el  – the scope element (the returned ref's node)
 *   q   – selector scoped to el, returns an array: q('.item')
 * setup may return a cleanup function (e.g. to remove event listeners).
 *
 *   const scope = useMotion(({ q, mobile, reduce }) => {
 *     if (reduce) return
 *     gsap.from(q('.title'), { yPercent: 100 })
 *   })
 *   return <section ref={scope}>...</section>
 */
export function useMotion(setup, deps = []) {
  const scope = useGsap(() => {
    const el = scope.current
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia(el)

    mm.add(
      {
        mobile: MEDIA.mobile,
        tablet: MEDIA.tablet,
        desktop: MEDIA.desktop,
        reduce: MEDIA.reducedMotion,
      },
      (ctx) => setup({ ...ctx.conditions, el, q }),
    )

    return () => mm.revert()
  }, deps)

  return scope
}

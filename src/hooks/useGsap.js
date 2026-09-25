import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'

/**
 * Runs GSAP code inside a gsap.context() scoped to the returned ref,
 * and reverts every tween / ScrollTrigger created in it on unmount.
 *
 * Selector strings inside `setup` are scoped to the ref element.
 * Use gsap.matchMedia() with MEDIA from lib/gsap.js inside `setup`
 * for breakpoint- or reduced-motion-specific animations.
 *
 *   const scope = useGsap(() => {
 *     gsap.from('.item', { opacity: 0 })
 *   }, [])
 *   return <section ref={scope}>...</section>
 */
export function useGsap(setup, deps = []) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(setup, scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}

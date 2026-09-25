import { useCallback } from 'react'
import { useLenis } from './useLenis.js'

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

// Smoothly scrolls to a selector or element (via Lenis when active, native
// otherwise) and moves keyboard focus to the target.
export function useScrollTo() {
  const lenis = useLenis()

  return useCallback(
    (target) => {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      if (!el) return

      if (lenis) lenis.scrollTo(el, { duration: 1.8, easing: easeOutQuart })
      else el.scrollIntoView()

      el.focus({ preventScroll: true })
    },
    [lenis],
  )
}

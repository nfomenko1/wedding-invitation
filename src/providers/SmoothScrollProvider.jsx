import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { LenisContext } from './LenisContext.js'

/**
 * Creates one global Lenis instance and drives it from GSAP's ticker,
 * so Lenis and ScrollTrigger share a single animation-frame loop.
 * When the user prefers reduced motion, Lenis is not created and the
 * page falls back to native scrolling.
 */
export default function SmoothScrollProvider({ children }) {
  const reducedMotion = usePrefersReducedMotion()
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if (reducedMotion) return

    const instance = new Lenis()
    instance.on('scroll', ScrollTrigger.update)

    const raf = (time) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    setLenis(instance)

    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      instance.destroy()
      setLenis(null)
    }
  }, [reducedMotion])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

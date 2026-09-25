// Single entry point for GSAP. Import gsap / ScrollTrigger from here
// (not from 'gsap' directly) so plugins are registered exactly once.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// Conditions for gsap.matchMedia(). Keep in sync with the
// breakpoints documented in src/styles/base.css.
export const MEDIA = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  reducedMotion: REDUCED_MOTION_QUERY,
  motionOk: '(prefers-reduced-motion: no-preference)',
}

export { gsap, ScrollTrigger }

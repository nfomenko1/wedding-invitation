import { useSyncExternalStore } from 'react'
import { REDUCED_MOTION_QUERY } from '../lib/gsap.js'

function subscribe(callback) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

const getSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches
const getServerSnapshot = () => false

// True when the user has requested reduced motion.
// Updates live if the OS setting changes.
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

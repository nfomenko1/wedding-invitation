import { useContext } from 'react'
import { LenisContext } from '../providers/LenisContext.js'

// Access the global Lenis instance (e.g. lenis.scrollTo('#section')).
// Returns null when smooth scrolling is disabled (reduced motion).
export function useLenis() {
  return useContext(LenisContext)
}

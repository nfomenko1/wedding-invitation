import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion.js'

// Temporary placeholder: confirms React is running and reduced-motion
// detection works. Replace when building the actual page.
export default function App() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <main>
      <p>React app is running.</p>
      <p>Reduced motion: {reducedMotion ? 'on' : 'off'}</p>
    </main>
  )
}

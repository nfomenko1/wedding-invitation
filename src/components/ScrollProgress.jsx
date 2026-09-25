import { gsap } from '../lib/gsap.js'
import { useGsap } from '../hooks/useGsap.js'

// Thin gold line at the top of the viewport showing page progress.
export default function ScrollProgress() {
  const scope = useGsap(() => {
    gsap.fromTo(
      scope.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.4, refreshPriority: -1 },
      },
    )
  }, [])

  return <div className="scroll-progress" ref={scope} aria-hidden="true" />
}

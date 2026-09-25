import { useEffect } from 'react'
import { ScrollTrigger } from './lib/gsap.js'
import SiteHeader from './components/SiteHeader.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Hero from './sections/Hero.jsx'
import Intro from './sections/Intro.jsx'
import Story from './sections/Story.jsx'
import Gallery from './sections/Gallery.jsx'
import Ribbons from './sections/Ribbons.jsx'
import Details from './sections/Details.jsx'
import Rsvp from './sections/Rsvp.jsx'
import Finale from './sections/Finale.jsx'

// Mobile browsers resize the viewport when the address bar shows/hides;
// don't recalculate every ScrollTrigger for that.
ScrollTrigger.config({ ignoreMobileResize: true })

// Experimental prototype. Sections are in page order; pinned sections
// must stay in DOM order so ScrollTrigger measures them correctly.
export default function App() {
  useEffect(() => {
    // Web fonts change text metrics; re-measure once they are ready.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <a className="skip-link" href="#invitation">
        Skip to content
      </a>
      <ScrollProgress />
      <SiteHeader />
      <main className="page">
        <Hero />
        <Intro />
        <Story />
        <Gallery />
        <Ribbons />
        <Details />
        <Rsvp />
        <Finale />
      </main>
    </>
  )
}

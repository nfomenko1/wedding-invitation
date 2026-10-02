import { useState } from 'react'
import { ScrollTrigger } from './lib/gsap.js'
import IntroScreen from './sections/IntroScreen.jsx'
import SoundToggle from './components/SoundToggle.jsx'
import SiteNav from './components/SiteNav.jsx'
import IntroTransition from './sections/IntroTransition.jsx'
import Hero from './sections/Hero.jsx'
import Invitation from './sections/Invitation.jsx'
import FilmStrip from './sections/FilmStrip.jsx'
import Schedule from './sections/Schedule.jsx'
import Location from './sections/Location.jsx'
import RouteTransition from './sections/RouteTransition.jsx'
import SectionHandoffs from './sections/SectionHandoffs.jsx'
import DressCode from './sections/DressCode.jsx'
import Details from './sections/Details.jsx'
import Rsvp from './sections/Rsvp.jsx'
import Finale from './sections/Finale.jsx'

// Mobile browsers resize the viewport when the address bar shows/hides;
// don't recalculate every ScrollTrigger for that.
ScrollTrigger.config({ ignoreMobileResize: true })

// Web fonts change text metrics; re-measure pins and triggers once loaded.
document.fonts?.ready.then(() => ScrollTrigger.refresh())

// Static blueprint. Sections are in page order and alternate
// light / warm backgrounds (set by each section's `tone`).
export default function App() {
  const [introOpen, setIntroOpen] = useState(true)

  return (
    <>
      {introOpen && <IntroScreen onDone={() => setIntroOpen(false)} />}
      {!introOpen && <SiteNav />}
      <SoundToggle />
      <main inert={introOpen}>
        <IntroTransition>
          <Hero />
          <Invitation />
        </IntroTransition>
        <FilmStrip />
        <RouteTransition>
          <Schedule />
          <Location />
        </RouteTransition>
        <SectionHandoffs>
          <DressCode />
          <Details />
          <Rsvp />
        </SectionHandoffs>
        <Finale />
      </main>
    </>
  )
}

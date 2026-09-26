import { ScrollTrigger } from './lib/gsap.js'
import Hero from './sections/Hero.jsx'
import Invitation from './sections/Invitation.jsx'
import Story from './sections/Story.jsx'
import Schedule from './sections/Schedule.jsx'
import Location from './sections/Location.jsx'
import DressCode from './sections/DressCode.jsx'
import Details from './sections/Details.jsx'
import Rsvp from './sections/Rsvp.jsx'
import Finale from './sections/Finale.jsx'

// Mobile browsers resize the viewport when the address bar shows/hides;
// don't recalculate every ScrollTrigger for that.
ScrollTrigger.config({ ignoreMobileResize: true })

// Static blueprint. Sections are in page order and alternate
// light / warm backgrounds (set by each section's `tone`).
export default function App() {
  return (
    <main>
      <Hero />
      <Invitation />
      <Story />
      <Schedule />
      <Location />
      <DressCode />
      <Details />
      <Rsvp />
      <Finale />
    </main>
  )
}

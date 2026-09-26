import Section from '../components/Section.jsx'
import ImageFrame from '../components/ImageFrame.jsx'
import Veil from '../components/Veil.jsx'
import { couple, wedding, finale } from '../content/wedding.js'
import './Finale.css'

export default function Finale() {
  return (
    <Section id="finale" tone="light" marker={finale.marker} labelledBy="finale-title" className="finale">
      <div className="finale__text">
        <h2 id="finale-title" className="t-h1">
          {finale.title}
        </h2>
        <p className="finale__names t-h3">
          {couple.bride} &amp; {couple.groom}
        </p>
        <p className="t-label">{wedding.date}</p>
      </div>

      <div className="finale__visual">
        <Veil variant="frame" className="finale__frame" />
        <ImageFrame className="finale__image" {...finale.image} />
        <Veil variant="glass" className="finale__glass" />
      </div>
    </Section>
  )
}

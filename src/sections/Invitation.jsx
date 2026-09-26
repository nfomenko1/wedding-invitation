import Section from '../components/Section.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ImageFrame from '../components/ImageFrame.jsx'
import Veil from '../components/Veil.jsx'
import { couple, invitation } from '../content/wedding.js'
import './Invitation.css'

export default function Invitation() {
  return (
    <Section id="invitation" tone="warm" marker={invitation.marker} labelledBy="invitation-title">
      <div className="invitation__grid layout-grid">
        <SectionHeading id="invitation-title" title={invitation.title} className="invitation__heading" />

        <div className="invitation__visual">
          <Veil variant="frame" className="invitation__frame" />
          <ImageFrame className="invitation__image" ratio="3 / 4" {...invitation.image} />
        </div>

        <div className="invitation__body">
          {invitation.paragraphs.map((text, i) => (
            <p key={i} className="t-body">
              {text}
            </p>
          ))}
          <p className="invitation__sign">
            <span className="t-label">{invitation.signature}</span>
            <span className="invitation__names t-h3">
              {couple.bride} &amp; {couple.groom}
            </span>
          </p>
        </div>
      </div>
    </Section>
  )
}

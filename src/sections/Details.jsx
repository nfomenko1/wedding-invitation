import Section from '../components/Section.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { details } from '../content/wedding.js'
import './Details.css'

export default function Details() {
  return (
    <Section id="details" tone="light" marker={details.marker} labelledBy="details-title">
      <SectionHeading id="details-title" title={details.title} lead={details.lead} />

      {/* Add entries in content/wedding.js; the grid adapts to any count. */}
      <ul className="details__list">
        {details.items.map((item, i) => (
          <li key={item.title} className="detail">
            <div className="detail__top">
              <span className="detail__icon" aria-hidden="true" />
              <span className="t-label">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="detail__title t-h3">{item.title}</h3>
            <p className="t-body">{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

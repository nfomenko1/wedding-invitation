import Section from '../components/Section.jsx'
import Veil from '../components/Veil.jsx'
import { schedule } from '../content/wedding.js'
import './Schedule.css'

export default function Schedule() {
  return (
    <Section id="schedule" tone="warm" marker={schedule.marker} labelledBy="schedule-title">
      <header className="schedule__header layout-grid">
        <h2 id="schedule-title" className="schedule__title t-h2">
          {schedule.title}
        </h2>
        <p className="schedule__lead t-lead">{schedule.lead}</p>
      </header>

      <div className="schedule__timeline">
        <Veil variant="glass" className="schedule__veil" />
        <ol className="timeline">
          {schedule.events.map((event) => (
            <li key={event.time} className="timeline__item">
              <time className="timeline__time">{event.time}</time>
              <span className="timeline__axis" aria-hidden="true">
                <span className="timeline__dot" />
              </span>
              <span className="timeline__title">{event.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}

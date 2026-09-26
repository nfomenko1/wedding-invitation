import Section from '../components/Section.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ImageFrame from '../components/ImageFrame.jsx'
import Veil from '../components/Veil.jsx'
import { story } from '../content/wedding.js'
import './Story.css'

export default function Story() {
  return (
    <Section id="story" tone="light" marker={story.marker} labelledBy="story-title">
      <div className="story__grid layout-grid">
        <SectionHeading id="story-title" title={story.title} lead={story.lead} className="story__heading" />

        <div className="story__visual">
          <Veil variant="tint" className="story__tint" />
          <ImageFrame className="story__main" ratio="4 / 5" {...story.images.main} />
          <ImageFrame className="story__detail" ratio="3 / 4" {...story.images.detail} />
        </div>

        <div className="story__body">
          {story.paragraphs.map((text, i) => (
            <p key={i} className="t-body">
              {text}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}

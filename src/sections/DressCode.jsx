import Section from '../components/Section.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ImageFrame from '../components/ImageFrame.jsx'
import Veil from '../components/Veil.jsx'
import { dressCode } from '../content/wedding.js'
import './DressCode.css'

export default function DressCode() {
  return (
    <Section id="dress-code" tone="warm" marker={dressCode.marker} labelledBy="dress-code-title">
      <div className="dress__header layout-grid">
        <div className="dress__intro">
          <SectionHeading id="dress-code-title" title={dressCode.title} />
          <p className="dress__description t-body">{dressCode.description}</p>
        </div>

        <div className="dress__palette">
          <p className="dress__palette-label t-label">{dressCode.paletteLabel}</p>
          <ul className="palette">
            {dressCode.palette.map((tone) => (
              <li key={tone.value} className="palette__item">
                <span className="palette__swatch" style={{ '--swatch': tone.value }} aria-hidden="true" />
                <span className="t-meta">{tone.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dress__looks">
        <Veil variant="glass" className="dress__veil" />
        <ul className="looks">
          {dressCode.looks.map((look) => (
            <li key={look.alt} className="looks__item">
              <ImageFrame ratio="3 / 4" {...look} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

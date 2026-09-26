import Section from '../components/Section.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ImageFrame from '../components/ImageFrame.jsx'
import Button from '../components/Button.jsx'
import { location } from '../content/wedding.js'
import './Location.css'

export default function Location() {
  const { venue, map } = location

  return (
    <Section id="location" tone="light" marker={location.marker} labelledBy="location-title">
      <SectionHeading id="location-title" title={location.title} className="location__heading" />

      <ImageFrame className="location__image" {...location.image} />

      <div className="location__grid layout-grid">
        <div className="location__info">
          <h3 className="location__venue t-h3">{venue.name}</h3>
          <p className="location__address t-meta">{venue.address}</p>
          <p className="location__description t-body">{venue.description}</p>
          <Button href={map.url ?? undefined} target={map.url ? '_blank' : undefined} rel={map.url ? 'noreferrer' : undefined}>
            {map.buttonLabel}
          </Button>
        </div>

        <div className="location__map-panel">
          {/* Neutral map placeholder; a real map will replace it later. */}
          <div className="map" role="img" aria-label={map.label}>
            <span className="map__road map__road--a" />
            <span className="map__road map__road--b" />
            <span className="map__road map__road--c" />
            <span className="map__pin" />
            <span className="map__label t-label">{map.label}</span>
          </div>
        </div>
      </div>
    </Section>
  )
}

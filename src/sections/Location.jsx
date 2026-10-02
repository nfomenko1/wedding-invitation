import { location } from '../content/wedding.js'
import './Location.css'

const PHOTO_SRC = `${import.meta.env.BASE_URL}${location.image.src}`

// One screen: the venue photo, full bleed (the 04 → 05 route ends on exactly
// this frame), with the venue and city over it and, on the right, a place
// for the map (a placeholder for now).
export default function Location() {
  const { venue, map } = location

  return (
    <section id="location" className="location" aria-labelledby="location-title">
      <img className="location__photo" src={PHOTO_SRC} alt={location.image.alt} loading="lazy" decoding="async" />
      <div className="location__shade" aria-hidden="true" />

      <div className="location__content container">
        <div className="location__info">
          <h2 id="location-title" className="location__venue t-h2">
            {venue.name}
          </h2>
          <p className="location__city t-lead">{venue.city}</p>
        </div>

        {/* Place for the map; a real map will replace the placeholder later. */}
        <div className="location__map map" role="img" aria-label={map.label}>
          <span className="map__road map__road--a" />
          <span className="map__road map__road--b" />
          <span className="map__road map__road--c" />
          <span className="map__pin" />
          <span className="map__label t-label">{map.label}</span>
        </div>
      </div>
    </section>
  )
}

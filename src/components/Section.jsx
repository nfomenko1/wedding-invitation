import SectionMarker from './SectionMarker.jsx'
import './Section.css'

/**
 * Page section with the shared container and editorial marker.
 * `tone` sets the background: 'light' or 'warm' (alternate down the page).
 */
export default function Section({ id, tone = 'light', marker, labelledBy, className = '', children }) {
  const classes = ['section', `section--${tone}`, className].filter(Boolean).join(' ')

  return (
    <section id={id} className={classes} aria-labelledby={labelledBy}>
      <div className="container section__inner">
        {marker && <SectionMarker number={marker.number} label={marker.label} />}
        {children}
      </div>
    </section>
  )
}

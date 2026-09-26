import './SectionMarker.css'

// Small editorial section marker: "01 —— INTRO".
export default function SectionMarker({ number, label }) {
  return (
    <p className="marker">
      <span className="marker__number">{number}</span>
      <span className="marker__line" aria-hidden="true" />
      <span className="marker__label t-label">{label}</span>
    </p>
  )
}

// Small uppercase section label: "No. 01 —— The Invitation".
// Animate with eyebrowIn() from lib/animations.js.
export default function Eyebrow({ index, children, className = '' }) {
  return (
    <p className={`eyebrow ${className}`.trim()}>
      {index && <span className="eyebrow__text eyebrow__index">No. {index}</span>}
      <span className="eyebrow__line" aria-hidden="true" />
      <span className="eyebrow__text">{children}</span>
    </p>
  )
}

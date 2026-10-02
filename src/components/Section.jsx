import './Section.css'

/**
 * Page section with the shared container.
 * `tone` sets the background: 'light' or 'warm' (alternate down the page).
 * Sections still pass a `marker` ({ number, label }) from the content; it is
 * not shown (the "01 — Intro" style labels are switched off).
 */
export default function Section({ id, tone = 'light', labelledBy, className = '', children }) {
  const classes = ['section', `section--${tone}`, className].filter(Boolean).join(' ')

  return (
    <section id={id} className={classes} aria-labelledby={labelledBy}>
      <div className="container section__inner">{children}</div>
    </section>
  )
}

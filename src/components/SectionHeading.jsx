import './SectionHeading.css'

// Section title with an optional lead line under it.
export default function SectionHeading({ id, title, lead, as: Tag = 'h2', className = '' }) {
  return (
    <header className={`section-heading ${className}`.trim()}>
      <Tag id={id} className="t-h2">
        {title}
      </Tag>
      {lead && <p className="section-heading__lead t-lead">{lead}</p>}
    </header>
  )
}

import Section from '../components/Section.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import TextField from '../components/TextField.jsx'
import ChoiceGroup from '../components/ChoiceGroup.jsx'
import Button from '../components/Button.jsx'
import { rsvp } from '../content/wedding.js'
import './Rsvp.css'

// Visual form only: submission is not connected to any service yet.
const preventSubmit = (event) => event.preventDefault()

export default function Rsvp() {
  const { fields } = rsvp

  return (
    <Section id="rsvp" tone="warm" marker={rsvp.marker} labelledBy="rsvp-title">
      <div className="rsvp__grid layout-grid">
        <div className="rsvp__intro">
          <SectionHeading id="rsvp-title" title={rsvp.title} />
          <p className="rsvp__description t-body">{rsvp.description}</p>
          <p className="rsvp__deadline">
            <span className="rsvp__rule" aria-hidden="true" />
            <span className="t-label">{rsvp.deadline}</span>
          </p>
        </div>

        <form className="rsvp__panel" onSubmit={preventSubmit}>
          <TextField name="name" label={fields.name.label} autoComplete="name" />
          <ChoiceGroup name="attendance" {...fields.attendance} />
          <ChoiceGroup name="plusOne" {...fields.plusOne} />
          <TextField name="companion" label={fields.companion.label} />
          <TextField name="comment" label={fields.comment.label} multiline />
          <Button type="submit" variant="solid" className="rsvp__submit">
            {rsvp.submitLabel}
          </Button>
        </form>
      </div>
    </Section>
  )
}

import { useId, useImperativeHandle, useRef, useState } from 'react'
import { gsap } from '../lib/gsap.js'
import { useLenis } from '../hooks/useLenis.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { Flourish } from './Ornaments.jsx'
import { wedding } from '../content/wedding.js'
import './RsvpDialog.css'

/**
 * Prototype reply form in a native <dialog> (focus trapping, Esc to close).
 * Nothing is sent anywhere yet. Open it through the ref: ref.current.open().
 */
export default function RsvpDialog({ ref }) {
  const dialogRef = useRef(null)
  const lenis = useLenis()
  const reducedMotion = usePrefersReducedMotion()
  const [reply, setReply] = useState(null)
  const id = useId()

  useImperativeHandle(ref, () => ({
    open() {
      const dialog = dialogRef.current
      if (!dialog || dialog.open) return
      dialog.showModal()
      lenis?.stop()
      if (!reducedMotion) {
        gsap.fromTo(
          dialog,
          { autoAlpha: 0, y: 40, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out', clearProps: 'all' },
        )
      }
    },
  }))

  const close = () => dialogRef.current?.close()

  const handleClose = () => {
    lenis?.start()
    setReply(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setReply({ name: data.get('name'), attending: data.get('attending') === 'yes' })
  }

  // Click on the backdrop (outside the panel) closes the dialog.
  const handleClick = (event) => {
    if (event.target === dialogRef.current) close()
  }

  return (
    <dialog
      className="reply"
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleClick}
      aria-labelledby={`${id}-title`}
      data-lenis-prevent
    >
      <div className="reply__panel">
        <button type="button" className="reply__close" onClick={close} aria-label="Close">
          ×
        </button>

        {reply ? (
          <div className="reply__thanks" role="status">
            <p className="reply__kicker">Thank you</p>
            <h2 className="reply__title" id={`${id}-title`}>
              {reply.attending ? `We can't wait to see you, ${reply.name}.` : `We'll miss you, ${reply.name}.`}
            </h2>
            <Flourish className="reply__flourish" />
            <p className="reply__hint">Prototype only — this reply was not sent anywhere.</p>
            <button type="button" className="reply__submit" onClick={close}>
              Close
            </button>
          </div>
        ) : (
          <form className="reply__form" onSubmit={handleSubmit}>
            <p className="reply__kicker">Kindly reply by {wedding.rsvpBy}</p>
            <h2 className="reply__title" id={`${id}-title`}>
              Will you celebrate with us?
            </h2>

            <label className="reply__field">
              <span>Full name</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>

            <fieldset className="reply__choice">
              <legend>Attendance</legend>
              <label>
                <input type="radio" name="attending" value="yes" defaultChecked />
                <span>Joyfully accepts</span>
              </label>
              <label>
                <input type="radio" name="attending" value="no" />
                <span>Regretfully declines</span>
              </label>
            </fieldset>

            <label className="reply__field">
              <span>Number of guests</span>
              <select name="guests" defaultValue="1">
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </label>

            <label className="reply__field">
              <span>A note for the couple (optional)</span>
              <textarea name="note" rows="3" />
            </label>

            <button type="submit" className="reply__submit">
              Send reply
            </button>
            <p className="reply__hint">Prototype only — replies are not sent anywhere yet.</p>
          </form>
        )}
      </div>
    </dialog>
  )
}

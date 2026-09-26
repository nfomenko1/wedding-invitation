import { useId } from 'react'
import './Form.css'

// Labelled text input, or a textarea with `multiline`.
export default function TextField({ label, name, multiline = false, ...rest }) {
  const id = useId()

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {multiline ? (
        <textarea id={id} name={name} className="field__control" rows={3} {...rest} />
      ) : (
        <input id={id} name={name} type="text" className="field__control" {...rest} />
      )}
    </div>
  )
}

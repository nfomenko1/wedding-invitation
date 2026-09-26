import './Form.css'

// Radio group: native inputs (visually hidden) with a custom mark.
export default function ChoiceGroup({ legend, name, options }) {
  return (
    <fieldset className="field choice">
      <legend className="field__label">{legend}</legend>
      <div className="choice__options">
        {options.map((option) => (
          <label key={option.value} className="choice__option">
            <input className="choice__input" type="radio" name={name} value={option.value} />
            <span className="choice__mark" aria-hidden="true" />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

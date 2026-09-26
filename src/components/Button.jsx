import './Button.css'

// Renders a link when `href` is given, otherwise a <button>.
// variant: 'outline' | 'solid'
export default function Button({ href, variant = 'outline', type = 'button', className = '', children, ...rest }) {
  const classes = `button button--${variant} ${className}`.trim()

  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}

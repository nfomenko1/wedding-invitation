import './Veil.css'

/**
 * Decorative translucent layer, positioned by the section's CSS.
 * variant: 'glass' (frosted panel) | 'frame' (hairline outline) | 'tint' (soft block)
 * The parent must be position: relative.
 */
export default function Veil({ variant = 'glass', className = '' }) {
  return <div className={`veil veil--${variant} ${className}`.trim()} aria-hidden="true" />
}

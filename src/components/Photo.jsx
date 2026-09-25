import './Photo.css'

/**
 * Image frame used everywhere a photograph goes.
 * With `src` it renders the image; without it, a styled placeholder.
 *
 * The inner layer ([data-photo-inner]) is oversized so it can be moved
 * or scaled for parallax without exposing the frame's edges.
 * `pan` gives extra horizontal room (for sideways parallax).
 */
export default function Photo({ src, alt = '', tone = 'wine', motif = 'none', pan = false, className = '' }) {
  const classes = ['photo', `photo--${tone}`, pan && 'photo--pan', className].filter(Boolean).join(' ')

  return (
    <figure className={classes}>
      <div className="photo__inner" data-photo-inner>
        {src ? (
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        ) : (
          <div className="photo__placeholder" role="img" aria-label={alt}>
            {motif !== 'none' && <span className={`photo__motif photo__motif--${motif}`} aria-hidden="true" />}
          </div>
        )}
      </div>
      {!src && (
        <span className="photo__tag" aria-hidden="true">
          {alt}
        </span>
      )}
    </figure>
  )
}

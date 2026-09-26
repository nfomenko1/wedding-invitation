import './ImageFrame.css'

/**
 * Frame for every photograph. With `src` it renders the image (cover);
 * without it, a neutral placeholder labelled with `alt`.
 *
 * `ratio` is a CSS aspect-ratio ('4 / 5'). Omit it to set --ratio from
 * the section's CSS instead, e.g. to change the ratio per breakpoint.
 */
export default function ImageFrame({ src, alt = '', ratio, className = '' }) {
  return (
    <figure className={`image-frame ${className}`.trim()} style={ratio ? { '--ratio': ratio } : undefined}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <div className="image-frame__placeholder" role="img" aria-label={alt}>
          <span className="image-frame__label t-label" aria-hidden="true">
            {alt}
          </span>
        </div>
      )}
    </figure>
  )
}

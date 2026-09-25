import Eyebrow from '../components/Eyebrow.jsx'
import Photo from '../components/Photo.jsx'
import Split from '../components/Split.jsx'
import { RoundBadge, Sprig } from '../components/Ornaments.jsx'
import { useMotion } from '../hooks/useMotion.js'
import { gsap } from '../lib/gsap.js'
import { draw, eyebrowIn, parallax, riseIn } from '../lib/animations.js'
import { intro } from '../content/wedding.js'
import './Intro.css'

export default function Intro() {
  const scope = useMotion(({ el, q, mobile, reduce }) => {
    if (reduce) return

    eyebrowIn(q('.eyebrow'))

    // Lead paragraph "inks in" word by word as it scrolls through the viewport.
    gsap.fromTo(
      q('.intro__lead .split__word'),
      { opacity: 0.12 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: q('.intro__lead')[0], start: 'top 82%', end: 'bottom 50%', scrub: true },
      },
    )

    riseIn(q('.intro__sign .split__word'), {
      stagger: 0.08,
      scrollTrigger: { trigger: q('.intro__sign')[0], start: 'top 90%' },
    })

    // Main photo opens from a smaller window while its image settles.
    const main = q('.intro__photo--main')[0]
    gsap.fromTo(
      main,
      { clipPath: 'inset(16% 14% 16% 14%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: { trigger: main, start: 'top bottom', end: 'center 55%', scrub: true },
      },
    )
    parallax(main.querySelector('[data-photo-inner]'), { scale: 1.35, yPercent: -6 }, { scale: 1.02, yPercent: 6 }, main)

    // Layered depth: each layer travels at its own speed.
    const visual = q('.intro__visual')[0]
    parallax(main, { y: mobile ? 30 : 80 }, { y: mobile ? -30 : -80 }, visual)
    parallax(
      q('.intro__photo--small'),
      { yPercent: mobile ? 25 : 55, rotate: -7 },
      { yPercent: mobile ? -20 : -45, rotate: 3 },
      visual,
    )
    parallax(q('.intro__badge'), { y: mobile ? 40 : 140 }, { y: mobile ? -40 : -140 }, el)
    parallax(q('.intro__badge svg'), { rotate: 0 }, { rotate: 280 }, el)

    draw(q('.intro__sprig .draw'), {
      ease: 'none',
      stagger: 0.08,
      scrollTrigger: { trigger: visual, start: 'top 75%', end: 'bottom 60%', scrub: true },
    })
  })

  return (
    <section className="intro" id="invitation" ref={scope} data-tone="light" tabIndex={-1} aria-labelledby="intro-title">
      <div className="container intro__grid">
        <div className="intro__copy">
          <Eyebrow index="01">
            <span id="intro-title">The Invitation</span>
          </Eyebrow>
          <Split as="p" className="intro__lead" text={intro.lead} />
          <p className="intro__sign">
            <Split className="script" text="with love," />
            <Split className="intro__sign-names" text={intro.sign} />
          </p>
        </div>

        <div className="intro__visual">
          <Photo className="intro__photo intro__photo--main" {...intro.images.main} />
          <Photo className="intro__photo intro__photo--small" {...intro.images.small} />
          <RoundBadge className="intro__badge" text={intro.badge} />
          <Sprig className="intro__sprig" />
        </div>
      </div>
    </section>
  )
}

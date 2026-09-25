import Eyebrow from '../components/Eyebrow.jsx'
import Photo from '../components/Photo.jsx'
import Split from '../components/Split.jsx'
import { useMotion } from '../hooks/useMotion.js'
import { gsap } from '../lib/gsap.js'
import { clipIn, eyebrowIn, parallax, riseIn } from '../lib/animations.js'
import { story } from '../content/wedding.js'
import './Story.css'

export default function Story() {
  const scope = useMotion(({ q, mobile, reduce }) => {
    if (reduce) return

    eyebrowIn(q('.eyebrow'))
    riseIn(q('.story__title .split__word'), {
      stagger: 0.08,
      duration: 1.5,
      scrollTrigger: { trigger: q('.story__title')[0], start: 'top 85%' },
    })

    // The gold thread draws down the timeline with scroll.
    gsap.fromTo(
      q('.story__line-fill'),
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: q('.story__timeline')[0], start: 'top 65%', end: 'bottom 65%', scrub: true },
      },
    )

    q('.chapter').forEach((chapter, i) => {
      const photo = chapter.querySelector('.photo')
      const from = mobile ? 'bottom' : i % 2 ? 'right' : 'left'

      gsap
        .timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: chapter, start: 'top 72%', toggleActions: 'play none none reverse' },
        })
        .add(clipIn(photo, from, { duration: 1.6 }))
        .from(photo.querySelector('[data-photo-inner]'), { scale: 1.35, duration: 2.2 }, 0)
        .from(chapter.querySelector('.chapter__dot'), { scale: 0, duration: 0.9, ease: 'back.out(3)' }, 0.1)
        .from(chapter.querySelectorAll('.chapter__year .split__char'), { yPercent: 110, duration: 1.3, stagger: 0.07 }, 0.2)
        .from(chapter.querySelectorAll('.chapter__title .split__word'), { yPercent: 115, duration: 1.2, stagger: 0.06 }, 0.4)
        .from(chapter.querySelector('.chapter__body'), { autoAlpha: 0, y: 24, duration: 1.2, ease: 'power3.out' }, 0.6)

      // Photo and year drift at different speeds for depth.
      parallax(chapter.querySelector('.chapter__media'), { yPercent: mobile ? 4 : 10 }, { yPercent: mobile ? -4 : -10 }, chapter)
      parallax(chapter.querySelector('.chapter__year'), { yPercent: mobile ? 10 : 35 }, { yPercent: mobile ? -10 : -35 }, chapter)
    })
  })

  return (
    <section className="story" id="story" ref={scope} data-tone="light" tabIndex={-1} aria-labelledby="story-title">
      <header className="container story__head">
        <Eyebrow index="02">Our Story</Eyebrow>
        <h2 className="display story__title" id="story-title">
          <Split text={story.title[0]} /> <em><Split text={story.title[1]} /></em>
        </h2>
      </header>

      <div className="container">
        <div className="story__timeline">
          <span className="story__line" aria-hidden="true">
            <span className="story__line-fill" />
          </span>
          <ol className="story__chapters">
            {story.chapters.map((chapter, i) => (
              <li key={chapter.year} className={`chapter chapter--${i % 2 ? 'right' : 'left'}`}>
                <span className="chapter__dot" aria-hidden="true" />
                <div className="chapter__media">
                  <Photo {...chapter.image} />
                </div>
                <div className="chapter__text">
                  <Split className="chapter__year" text={chapter.year} by="chars" />
                  <Split as="h3" className="chapter__title" text={chapter.title} />
                  <div className="chapter__body">
                    <p>{chapter.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

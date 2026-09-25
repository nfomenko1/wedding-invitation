import Eyebrow from '../components/Eyebrow.jsx'
import Split from '../components/Split.jsx'
import { Corner, Flourish } from '../components/Ornaments.jsx'
import { useMotion } from '../hooks/useMotion.js'
import { gsap } from '../lib/gsap.js'
import { draw, eyebrowIn, riseIn } from '../lib/animations.js'
import { details, wedding } from '../content/wedding.js'
import './Details.css'

const CORNERS = ['tl', 'tr', 'bl', 'br']

export default function Details() {
  const scope = useMotion(({ q, mobile, reduce }) => {
    if (reduce) return

    eyebrowIn(q('.eyebrow'))
    riseIn(q('.details__title .split__word'), {
      stagger: 0.08,
      duration: 1.5,
      scrollTrigger: { trigger: q('.details__title')[0], start: 'top 85%' },
    })

    // Day counts up to the date.
    const day = q('.details__day')[0]
    const counter = { value: 1 }
    day.textContent = '01'
    gsap.to(counter, {
      value: Number(wedding.day),
      duration: 2.2,
      ease: 'power3.out',
      onUpdate: () => {
        day.textContent = String(Math.round(counter.value)).padStart(2, '0')
      },
      scrollTrigger: { trigger: day, start: 'top 85%' },
    })
    gsap.from(q('.details__month > *'), {
      autoAlpha: 0,
      x: -20,
      duration: 1.2,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: day, start: 'top 85%' },
    })

    // Cards stack (CSS sticky); each one recedes as the next slides over it.
    const cards = q('.card')
    cards.forEach((card, i) => {
      draw(card.querySelectorAll('.draw'), {
        duration: 2,
        stagger: 0.03,
        scrollTrigger: { trigger: card, start: 'top 70%' },
      })

      const next = cards[i + 1]
      if (!next) return
      const recede = { trigger: next, start: 'top bottom', end: mobile ? 'top 15%' : 'top 25%', scrub: true }
      gsap.to(card.querySelector('.card__inner'), {
        scale: 0.9,
        yPercent: -3,
        rotate: i % 2 ? 1.2 : -1.2,
        ease: 'none',
        scrollTrigger: recede,
      })
      gsap.to(card.querySelector('.card__shade'), { opacity: 0.45, ease: 'none', scrollTrigger: recede })
    })

    q('.fact').forEach((fact) => {
      gsap
        .timeline({ scrollTrigger: { trigger: fact, start: 'top 88%' } })
        .from(fact.querySelector('.fact__rule'), { scaleX: 0, duration: 1.4, ease: 'expo.inOut' })
        .from(fact.querySelectorAll('.fact__label, .fact__text'), { autoAlpha: 0, y: 18, duration: 1.1, stagger: 0.1, ease: 'power3.out' }, 0.3)
    })

    return () => {
      day.textContent = wedding.day
    }
  })

  return (
    <section className="details" id="details" ref={scope} data-tone="light" tabIndex={-1} aria-labelledby="details-title">
      <div className="container details__grid">
        <header className="details__head">
          <Eyebrow index="04">The Details</Eyebrow>
          <h2 className="display details__title" id="details-title">
            <Split text={details.title[0]} /> <em><Split text={details.title[1]} /></em>
          </h2>
          <p className="details__date">
            <span className="sr-only">
              {wedding.weekday}, {wedding.day} {wedding.month} {wedding.year}
            </span>
            <span className="details__day" aria-hidden="true">
              {wedding.day}
            </span>
            <span className="details__month" aria-hidden="true">
              <span className="details__weekday">{wedding.weekday}</span>
              <span>
                {wedding.month} <em>{wedding.year}</em>
              </span>
            </span>
          </p>
          <p className="details__text">{details.text}</p>
        </header>

        <ol className="details__cards">
          {details.events.map((event, i) => (
            <li key={event.title} className={`card card--${i % 2 ? 'dark' : 'light'}`} style={{ '--i': i }}>
              <article className="card__inner">
                {CORNERS.map((corner) => (
                  <Corner key={corner} className={`card__corner card__corner--${corner}`} />
                ))}
                <p className="card__numeral" aria-hidden="true">
                  {event.numeral}
                </p>
                <h3 className="card__title">{event.title}</h3>
                <p className="card__time">
                  <time dateTime={`${wedding.iso}T${event.time}`}>{event.time}</time>
                </p>
                <Flourish className="card__flourish" />
                <p className="card__venue">{event.venue}</p>
                <p className="card__address">{event.address}</p>
                <p className="card__note">{event.note}</p>
                <span className="card__shade" aria-hidden="true" />
              </article>
            </li>
          ))}
        </ol>
      </div>

      <ul className="container details__facts">
        {details.facts.map((fact) => (
          <li key={fact.label} className="fact">
            <span className="fact__rule" aria-hidden="true" />
            <p className="fact__label">{fact.label}</p>
            <p className="fact__text">{fact.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

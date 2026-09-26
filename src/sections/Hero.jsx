import Section from '../components/Section.jsx'
import ImageFrame from '../components/ImageFrame.jsx'
import Veil from '../components/Veil.jsx'
import { couple, wedding, hero } from '../content/wedding.js'
import './Hero.css'

export default function Hero() {
  return (
    <Section id="intro" tone="light" marker={hero.marker} labelledBy="hero-title" className="hero">
      <div className="hero__grid layout-grid">
        <div className="hero__text">
          <p className="hero__eyebrow t-label">{hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__names t-display">
            <span className="hero__name">{couple.bride}</span>
            <span className="hero__amp">&amp;</span>
            <span className="hero__name hero__name--second">{couple.groom}</span>
          </h1>
          <div className="hero__date">
            <span className="hero__rule" aria-hidden="true" />
            <p className="t-meta">{wedding.date}</p>
            <p className="t-label">{wedding.city}</p>
          </div>
        </div>

        <div className="hero__visual">
          <Veil variant="frame" className="hero__frame" />
          <ImageFrame className="hero__image" ratio="4 / 5" {...hero.image} />
          <Veil variant="glass" className="hero__glass" />
        </div>
      </div>

      <div className="hero__scroll">
        <span className="t-label">{hero.scrollHint}</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </div>
    </Section>
  )
}

import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { useMotion } from '../hooks/useMotion.js'
import { useScrollTo } from '../hooks/useScrollTo.js'
import { couple } from '../content/wedding.js'
import './SiteHeader.css'

const LINKS = [
  { href: '#story', label: 'Our story' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#details', label: 'Details' },
]

export default function SiteHeader() {
  const scrollTo = useScrollTo()

  const scope = useMotion(({ el, q, reduce }) => {
    // Match the header colour to the section beneath it.
    // refreshPriority -1: measure after all section pins exist.
    document.querySelectorAll('[data-tone]').forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 48px',
        end: 'bottom 48px',
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive) el.dataset.tone = section.dataset.tone
        },
      })
    })

    if (reduce) return

    gsap.from(q('.site-header__inner'), { yPercent: -140, autoAlpha: 0, duration: 1.4, ease: 'expo.out', delay: 3.2 })

    // Hide while scrolling down, reveal when scrolling up.
    let hidden = false
    const setHidden = (hide) => {
      if (hide === hidden) return
      hidden = hide
      gsap.to(el, { yPercent: hide ? -110 : 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' })
    }
    ScrollTrigger.create({
      start: 240,
      end: 'max',
      refreshPriority: -1,
      onUpdate: (self) => setHidden(self.direction === 1),
      onLeaveBack: () => setHidden(false),
    })

    // Keyboard users tabbing into a hidden header should see it.
    const reveal = () => setHidden(false)
    el.addEventListener('focusin', reveal)
    return () => el.removeEventListener('focusin', reveal)
  })

  const handleNav = (event) => {
    event.preventDefault()
    scrollTo(event.currentTarget.getAttribute('href'))
  }

  return (
    <header className="site-header" ref={scope} data-tone="dark">
      <div className="site-header__inner">
        <a className="site-header__mono" href="#top" onClick={handleNav} aria-label={`${couple.first} and ${couple.second}, back to top`}>
          {couple.first[0]}
          <span>&amp;</span>
          {couple.second[0]}
        </a>
        <nav className="site-header__nav" aria-label="Sections">
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={handleNav}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="site-header__rsvp" href="#rsvp" onClick={handleNav}>
          RSVP
        </a>
      </div>
    </header>
  )
}

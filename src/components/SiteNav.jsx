import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { useLenis } from '../hooks/useLenis.js'
import { setNavigating } from '../lib/scrollStep.js'
import { FILM_HANDOVER_LENGTH } from '../sections/sceneTiming.js'
import { nav } from '../content/wedding.js'
import './SiteNav.css'

const elementTop = (id) => {
  const el = document.getElementById(id)
  return el ? el.getBoundingClientRect().top + window.scrollY : 0
}

// Where each section is "open": with the transitions on, the scroll position
// where it has fully arrived (from the ScrollTriggers that bring it in);
// otherwise simply where it starts.
const target = (id) => {
  const vh = window.innerHeight
  const all = ScrollTrigger.getAll()
  switch (id) {
    case 'invitation': {
      const st = all.find((t) => t.pin && t.trigger?.classList?.contains('intro-transition'))
      return st ? st.end : elementTop(id)
    }
    case 'film-strip': {
      const st = all.find((t) => t.pin && t.trigger?.id === 'film-strip')
      return st ? st.start + vh * 0.35 : elementTop(id)
    }
    case 'schedule': {
      const st = ScrollTrigger.getById('schedule')
      return st ? st.start + vh * 0.3 : elementTop(id)
    }
    default: {
      // Sections brought in by a scroll step: just past its start.
      const st = ScrollTrigger.getById(id)
      return st ? st.start + 2 : elementTop(id)
    }
  }
}

// Where a section starts to take over the screen (its entry is marked from
// here): part-way into the transition that brings it in.
const takeover = (id) => {
  const vh = window.innerHeight
  const all = ScrollTrigger.getAll()
  switch (id) {
    case 'invitation': {
      const st = all.find((t) => t.pin && t.trigger?.classList?.contains('intro-transition'))
      return st ? (st.start + st.end) / 2 : elementTop(id) - vh * 0.4
    }
    case 'film-strip': {
      const st = all.find((t) => t.pin && t.trigger?.id === 'film-strip')
      return st ? st.start - vh * 0.4 : elementTop(id) - vh * 0.4
    }
    case 'schedule': {
      // Half-way through 03 dissolving into 04 (04 assembles at 0.8 of it).
      const st = ScrollTrigger.getById('schedule')
      return st ? st.start - FILM_HANDOVER_LENGTH * vh * 0.3 : elementTop(id) - vh * 0.4
    }
    default: {
      // Sections brought in by a scroll step: as soon as it sets off.
      const st = ScrollTrigger.getById(id)
      return st ? st.start : elementTop(id) - vh * 0.4
    }
  }
}

/**
 * Fixed top navigation (glass, like the sound toggle). Each entry takes the
 * page straight to its section, already arrived (a short fade, no replay of
 * the transitions in between); the entry of the section taking the screen
 * is marked. Scrolls sideways inside itself when it doesn't fit.
 */
export default function SiteNav() {
  const lenis = useLenis()
  const [active, setActive] = useState(null)
  const listRef = useRef(null)

  // Section in view: the last one that has started to take over the screen.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      let current = null
      for (const item of nav) if (takeover(item.id) <= y) current = item.id
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    ScrollTrigger.addEventListener('refresh', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      ScrollTrigger.removeEventListener('refresh', update)
    }
  }, [])

  // Keep the marked entry in view inside the bar.
  useEffect(() => {
    const link = active && listRef.current?.querySelector(`[data-id="${active}"]`)
    if (!link) return
    const list = listRef.current
    const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2
    list.scrollTo({ left, behavior: 'smooth' })
  }, [active])

  // Straight to the section: a short fade of the page, a jump there with
  // every transition on the way set to where it ends (nothing in between
  // plays), and the page fades back in, already arrived.
  const go = (event, id) => {
    event.preventDefault()
    const y = Math.round(target(id))
    if (!lenis) {
      window.scrollTo(0, y)
      return
    }
    const page = document.querySelector('main')
    setNavigating(true)
    gsap.to(page, {
      autoAlpha: 0,
      duration: 0.35,
      ease: 'sine.in',
      overwrite: true,
      onComplete: () => {
        try {
          lenis.scrollTo(y, { immediate: true, force: true })
          ScrollTrigger.update()
          // Scrubbed animations: be where the scroll is now, not catching up.
          ScrollTrigger.getAll().forEach((st) => {
            const tween = st.getTween?.()
            if (tween && typeof tween.progress === 'function') tween.progress(1)
          })
        } finally {
          setNavigating(false)
          gsap.to(page, { autoAlpha: 1, duration: 0.55, ease: 'sine.out', delay: 0.05, clearProps: 'opacity,visibility' })
        }
      },
    })
  }

  return (
    <nav className="site-nav" aria-label="Разделы">
      <ul ref={listRef} className="site-nav__list">
        {nav.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              data-id={item.id}
              className={`site-nav__link t-label${active === item.id ? ' is-active' : ''}`}
              aria-current={active === item.id ? 'true' : undefined}
              onClick={(event) => go(event, item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

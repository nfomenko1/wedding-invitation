import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, REDUCED_MOTION_QUERY } from '../lib/gsap.js'
import { useAudio } from '../hooks/useAudio.js'
import { useLenis } from '../hooks/useLenis.js'
import Button from '../components/Button.jsx'
import { intro, media } from '../content/wedding.js'
import './IntroScreen.css'

// Seconds into video_intro.mp4 where the needle meets the record; the music
// starts here. Change this one value to move the music start.
export const NEEDLE_CONTACT_TIME = 7.5

// Seconds after the video starts at which each part of the text appears:
// lead line, title (4 s later), button.
const TEXT_AT = [4, 8, 10]

// Reveal duration of each part: the two lines slow and calm, the button as before.
const TEXT_DURATION = [2.4, 2.4, 1.6]

// If the video has not started by then (slow network, blocked autoplay),
// the scene is shown anyway and the music is cued by the clock instead.
const VIDEO_WAIT = 2.5

const VIDEO_SRC = `${import.meta.env.BASE_URL}${media.introVideo}`

const reducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches

/**
 * Full-screen intro scene before 01: the record-player video, the music
 * cued to the needle drop, a short text sequence and the button that
 * dissolves into the page. The page underneath is already rendered and
 * scroll-locked until then. Calls `onDone` once it has faded out.
 */
export default function IntroScreen({ onDone }) {
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const ctxRef = useRef(null)
  const [leaving, setLeaving] = useState(false)
  const { cueMusic } = useAudio()
  const lenis = useLenis()

  // Always open at the top of the page, behind the scene.
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // Scroll lock while the scene is up.
  useEffect(() => {
    lenis?.stop()
    document.documentElement.classList.add('has-intro')
    return () => {
      lenis?.start()
      document.documentElement.classList.remove('has-intro')
    }
  }, [lenis])

  useLayoutEffect(() => {
    const root = rootRef.current
    const video = videoRef.current
    const reduce = reducedMotion()
    const q = gsap.utils.selector(root)
    let revealed = false
    let gaveUp = false
    let fallback

    const ctx = gsap.context((self) => {
      const stage = q('.intro-screen__video')
      const items = q('.intro-screen__line, .intro-screen__open')

      gsap.set(stage, reduce ? { autoAlpha: 0 } : { autoAlpha: 0, scale: 1.02, filter: 'blur(8px)' })
      gsap.set(items, reduce ? { autoAlpha: 0 } : { autoAlpha: 0, y: 12, filter: 'blur(4px)' })

      // Video: barely-there focus-in. Text: one line after another.
      self.add('reveal', (startedAt) => {
        if (revealed) return
        revealed = true
        gsap.to(stage, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: reduce ? 0.6 : 1.4, ease: 'power2.out' })

        // Wait for the fonts so the text never appears in a fallback face.
        document.fonts.ready.then(() =>
          self.add(() => {
            const elapsed = (performance.now() - startedAt) / 1000
            items.forEach((item, i) => {
              gsap.to(item, {
                autoAlpha: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: reduce ? 0.6 : TEXT_DURATION[i],
                ease: i < 2 ? 'sine.out' : 'power2.out',
                delay: Math.max(0, TEXT_AT[i] - elapsed),
                // Hand transform back to CSS (the button's hover uses `scale`).
                clearProps: 'transform,translate,scale,rotate,filter',
              })
            })
          }),
        )
      })
    }, root)
    ctxRef.current = ctx

    // The music cue follows the video clock, every frame until the needle
    // drop (so a stalled video holds it back). After that it keeps time on
    // its own, also once the intro is gone.
    const syncMusic = () => {
      cueMusic(performance.now() + (NEEDLE_CONTACT_TIME - video.currentTime) * 1000)
      if (video.currentTime >= NEEDLE_CONTACT_TIME) gsap.ticker.remove(syncMusic)
    }

    const onPlaying = () => {
      clearTimeout(fallback)
      ctx.reveal(performance.now() - video.currentTime * 1000)
      gsap.ticker.add(syncMusic)
    }

    // Video missing or not playing: show the scene, cue the music by clock.
    // Runs once (fallback timer and error event can both call it).
    const giveUp = () => {
      if (gaveUp || (!video.paused && video.currentTime > 0)) return
      gaveUp = true
      clearTimeout(fallback)
      const now = performance.now()
      ctx.reveal(now)
      cueMusic(now + NEEDLE_CONTACT_TIME * 1000)
    }
    fallback = setTimeout(giveUp, VIDEO_WAIT * 1000)

    video.addEventListener('playing', onPlaying, { once: true })
    video.addEventListener('error', giveUp, { once: true })
    video.muted = true
    video.play().catch(() => {})

    return () => {
      clearTimeout(fallback)
      gsap.ticker.remove(syncMusic)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', giveUp)
      ctx.revert()
    }
  }, [cueMusic])

  // Camera push-in and dissolve into 01 (about 2.3 s): the scene pushes in
  // slightly, blurs and fades out completely; only then the page's first
  // screen comes up out of a light blur, so the two never compete. Visual
  // only: the music is untouched (if the visitor was faster than the needle,
  // it still starts on cue).
  const open = () => {
    if (leaving) return
    setLeaving(true)

    const root = rootRef.current
    const page = document.querySelector('main')
    const reduce = reducedMotion()
    ctxRef.current.add(() => {
      const tl = gsap.timeline({ onComplete: onDone })
      if (reduce) {
        tl.to(root, { autoAlpha: 0, duration: 0.6, ease: 'power1.inOut' })
        return
      }
      tl.to(root, { scale: 1.022, duration: 1.3, ease: 'sine.inOut' }, 0.1)
        .to(root, { filter: 'blur(6px)', duration: 1.2, ease: 'sine.in' }, 0.1)
        .to(root, { autoAlpha: 0, duration: 1, ease: 'sine.inOut' }, 0.25)
        // Starts once the scene is all but gone (~2% left).
        .fromTo(
          page,
          { autoAlpha: 0, filter: 'blur(5px)' },
          { autoAlpha: 1, filter: 'blur(0px)', duration: 1.1, ease: 'sine.out', clearProps: 'opacity,visibility,filter' },
          1.2,
        )
    })
  }

  return (
    <div ref={rootRef} className="intro-screen" role="dialog" aria-modal="true" aria-label={intro.lines[1]}>
      <video
        ref={videoRef}
        className="intro-screen__video"
        src={VIDEO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="intro-screen__content">
        <p className="intro-screen__line intro-screen__line--lead t-lead">{intro.lines[0]}</p>
        <p className="intro-screen__line intro-screen__line--title t-h3">{intro.lines[1]}</p>
        <Button className="intro-screen__open" onClick={open} disabled={leaving}>
          {intro.openLabel}
        </Button>
      </div>
    </div>
  )
}

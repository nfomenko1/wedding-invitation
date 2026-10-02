import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '../lib/gsap.js'
import { AudioContext } from './AudioContext.js'
import { media } from '../content/wedding.js'

const MUSIC_SRC = `${import.meta.env.BASE_URL}${media.music}`

// Events that grant user activation, i.e. may start blocked media.
const ACTIVATION_EVENTS = ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click']

/**
 * Owns the one <audio> element for the whole site, so the music keeps its
 * position across scenes (intro → page). Sound is on by default; the
 * toggle only flips `muted`, never pauses or restarts. The toggle shows the
 * visitor's choice, not whether the browser has let the music start yet.
 *
 * The intro cues the music to a moment (the needle drop) with `cueMusic`.
 * At that moment play() is tried once. If the browser's autoplay policy
 * refuses it, nothing plays until the first interaction, which starts the
 * music from where it would be by now, counted from the cue. An interaction
 * before the cue starts nothing; the music still starts on cue.
 */
export default function AudioProvider({ children }) {
  const audioRef = useRef(null)
  // performance.now() of the cue; null until the intro sets it.
  const cueAtRef = useRef(null)
  // The cue has been reached and play() tried.
  const dueRef = useRef(false)
  // The music has really started playing at least once.
  const startedRef = useRef(false)
  // play() promise in flight.
  const pendingRef = useRef(false)
  // The visitor's sound choice: on until they turn it off.
  const [soundOn, setSoundOn] = useState(true)
  const soundOnRef = useRef(soundOn)

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio || pendingRef.current || !audio.paused) return
    // First start: catch up with the time elapsed since the cue.
    if (!startedRef.current) audio.currentTime = Math.max(0, (performance.now() - cueAtRef.current) / 1000)
    audio.muted = !soundOnRef.current
    pendingRef.current = true
    audio
      .play()
      .then(() => {
        startedRef.current = true
      })
      .catch(() => {})
      .finally(() => {
        pendingRef.current = false
      })
  }, [])

  // Sets (or moves) the cue: `at` is a performance.now() timestamp.
  // Ignored once the cue has been reached.
  const cueMusic = useCallback((at) => {
    if (!dueRef.current) cueAtRef.current = at
  }, [])

  // Tries play() once, when the cue is reached.
  useEffect(() => {
    const check = () => {
      if (dueRef.current || cueAtRef.current === null || performance.now() < cueAtRef.current) return
      dueRef.current = true
      gsap.ticker.remove(check)
      play()
    }
    gsap.ticker.add(check)
    return () => gsap.ticker.remove(check)
  }, [play])

  // Cue passed but play() was blocked: the first interaction starts the
  // music. The toggle handles its own presses.
  useEffect(() => {
    const onInteract = (event) => {
      if (startedRef.current || !dueRef.current) return
      if (event.target instanceof Element && event.target.closest('[data-sound-toggle]')) return
      play()
    }
    ACTIVATION_EVENTS.forEach((type) => window.addEventListener(type, onInteract, true))
    return () => ACTIVATION_EVENTS.forEach((type) => window.removeEventListener(type, onInteract, true))
  }, [play])

  // Initial state: sound on, element unmuted.
  useEffect(() => {
    audioRef.current.muted = !soundOnRef.current
  }, [])

  const toggleMuted = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const next = !soundOnRef.current
    soundOnRef.current = next
    setSoundOn(next)
    audio.muted = !next
    // Cue passed but nothing plays (autoplay blocked): start now.
    if (next && dueRef.current) play()
  }, [play])

  const value = useMemo(() => ({ soundOn, cueMusic, toggleMuted }), [soundOn, cueMusic, toggleMuted])

  return (
    <AudioContext.Provider value={value}>
      <audio ref={audioRef} src={MUSIC_SRC} preload="auto" />
      {children}
    </AudioContext.Provider>
  )
}

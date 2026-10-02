import { useAudio } from '../hooks/useAudio.js'
import { sound } from '../content/wedding.js'
import './SoundToggle.css'

// Persistent sound on / off (mute) control, shared by the intro and the page.
export default function SoundToggle() {
  const { soundOn, toggleMuted } = useAudio()

  return (
    <button type="button" className="sound-toggle t-label" onClick={toggleMuted} data-sound-toggle>
      {soundOn ? sound.on : sound.off}
    </button>
  )
}

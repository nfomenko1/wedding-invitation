import { useContext } from 'react'
import { AudioContext } from '../providers/AudioContext.js'

// Background music: { soundOn, cueMusic(at), toggleMuted() }.
export function useAudio() {
  return useContext(AudioContext)
}

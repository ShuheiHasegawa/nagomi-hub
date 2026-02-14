'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'


import { useAudio } from '@/components/providers/AudioProvider'
import type { ChannelId } from '@/lib/audio/audio-engine'

interface SoundOption {
  id: ChannelId
  name: string
  icon: string
  volume: number
  url: string
}

const defaultSounds: SoundOption[] = [
  { id: 'rain', name: '雨音', icon: '🌧️', volume: 50, url: '/audio/rain.ogg' },
  { id: 'forest', name: '森', icon: '🌲', volume: 30, url: '/audio/forest.ogg' },
  { id: 'ocean', name: '海', icon: '🌊', volume: 40, url: '/audio/ocean.ogg' },
  { id: 'fire', name: '焚き火', icon: '🔥', volume: 35, url: '/audio/fire.ogg' },
]

export default function AmbientSound() {
  const [sounds, setSounds] = useState<SoundOption[]>(defaultSounds)
  const [masterVolume, setMasterVolume] = useState(70)
  const [activeSounds, setActiveSounds] = useState<Set<ChannelId>>(new Set())
  const audio = useAudio()

  const handleVolumeChange = (id: ChannelId, volume: number) => {
    setSounds((prev) => prev.map((sound) => (sound.id === id ? { ...sound, volume } : sound)))
    audio.setChannelVolume(id, volume)
  }

  const handleMasterVolumeChange = (volume: number) => {
    setMasterVolume(volume)
    audio.setMasterVolume(volume)
  }

  const toggleSound = async (sound: SoundOption) => {
    if (!audio.initialized) {
      await audio.initialize()
    }

    if (activeSounds.has(sound.id)) {
      audio.stop(sound.id)
      setActiveSounds((prev) => {
        const next = new Set(prev)
        next.delete(sound.id)
        return next
      })
    } else {
      try {
        await audio.play(sound.id, sound.url)
        audio.setChannelVolume(sound.id, sound.volume)
        setActiveSounds((prev) => new Set(prev).add(sound.id))
      } catch {
        console.warn(`Audio file not found: ${sound.url}`)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-primary-600">マスター音量</span>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(e) => handleMasterVolumeChange(Number(e.target.value))}
            className="w-24 h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <span className="text-sm text-primary-600 w-10">{masterVolume}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {sounds.map((sound) => (
          <motion.div
            key={sound.id}
            className={`flex items-center gap-4 p-3 glass rounded-xl ${
              activeSounds.has(sound.id) ? 'ring-2 ring-primary-400/50' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <button
              onClick={() => toggleSound(sound)}
              className={`text-2xl transition-transform ${activeSounds.has(sound.id) ? 'scale-110' : 'opacity-60'}`}
              title={activeSounds.has(sound.id) ? '停止' : '再生'}
            >
              {sound.icon}
            </button>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-primary-700">{sound.name}</span>
                <span className="text-xs text-primary-600">{sound.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sound.volume}
                onChange={(e) => handleVolumeChange(sound.id, Number(e.target.value))}
                className="w-full h-1.5 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface SoundOption {
  id: string
  name: string
  icon: string
  volume: number
}

const soundOptions: SoundOption[] = [
  { id: 'rain', name: '雨音', icon: '🌧️', volume: 50 },
  { id: 'forest', name: '森', icon: '🌲', volume: 30 },
  { id: 'ocean', name: '海', icon: '🌊', volume: 40 },
  { id: 'fire', name: '焚き火', icon: '🔥', volume: 35 },
]

export default function AmbientSound() {
  const [sounds, setSounds] = useState<SoundOption[]>(soundOptions)
  const [masterVolume, setMasterVolume] = useState(70)

  const handleVolumeChange = (id: string, volume: number) => {
    setSounds((prev) => prev.map((sound) => (sound.id === id ? { ...sound, volume } : sound)))
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
            onChange={(e) => setMasterVolume(Number(e.target.value))}
            className="w-24 h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <span className="text-sm text-primary-600 w-10">{masterVolume}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {sounds.map((sound) => (
          <motion.div
            key={sound.id}
            className="flex items-center gap-4 p-3 glass rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="text-2xl">{sound.icon}</span>
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

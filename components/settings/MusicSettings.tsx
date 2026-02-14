'use client'

import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useAudio } from '@/components/providers/AudioProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { getUserSettings, saveUserSettings } from '@/lib/settings/settings-service'

interface MusicTrack {
  id: string
  name: string
  artist: string
  duration: string
  isPlaying: boolean
}

const musicTracks: MusicTrack[] = [
  {
    id: '1',
    name: 'Forest Ambience',
    artist: 'Nature Sounds',
    duration: '10:00',
    isPlaying: false,
  },
  { id: '2', name: 'Rainy Day', artist: 'Ambient Mix', duration: '15:30', isPlaying: true },
  { id: '3', name: 'Ocean Waves', artist: 'Relaxation', duration: '20:00', isPlaying: false },
  { id: '4', name: 'Morning Birds', artist: 'Nature Sounds', duration: '12:45', isPlaying: false },
]

export default function MusicSettings() {
  const { user } = useAuth()
  const { setChannelVolume } = useAudio()
  const [tracks, setTracks] = useState<MusicTrack[]>(musicTracks)
  const [bgmVolume, setBgmVolume] = useState(60)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  const loadSettings = useCallback(async () => {
    if (!user) return
    const settings = await getUserSettings(user.id)
    setBgmVolume(settings.bgm_volume)
  }, [user])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const handleVolumeChange = (value: number) => {
    setBgmVolume(value)
    setChannelVolume('bgm', value / 100)

    // デバウンス保存 (500ms)
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    if (user) {
      saveTimeout.current = setTimeout(() => {
        saveUserSettings(user.id, { bgm_volume: value })
      }, 500)
    }
  }

  const handlePlayToggle = (id: string) => {
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        isPlaying: track.id === id ? !track.isPlaying : false,
      }))
    )
  }

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-4">
      <h3 className="text-xl font-semibold text-primary-700">音楽設定</h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-primary-600">BGM音量</span>
          <span className="text-sm text-primary-600">{bgmVolume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={bgmVolume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
      </div>

      <div className="space-y-2 pt-4">
        <h4 className="text-sm font-semibold text-primary-700">プレイリスト</h4>
        <div className="space-y-2">
          {tracks.map((track) => (
            <motion.div
              key={track.id}
              className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                track.isPlaying ? 'glass-strong' : 'glass'
              }`}
              whileHover={{ scale: 1.01 }}
            >
              <button
                onClick={() => handlePlayToggle(track.id)}
                className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                {track.isPlaying ? '⏸️' : '▶️'}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-700 truncate">{track.name}</p>
                <p className="text-xs text-primary-500">{track.artist}</p>
              </div>
              <span className="text-xs text-primary-500">{track.duration}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

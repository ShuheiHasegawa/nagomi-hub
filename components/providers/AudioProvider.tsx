'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import AudioEngine from '@/lib/audio/audio-engine'
import type { ChannelId } from '@/lib/audio/audio-engine'

interface AudioContextType {
  initialized: boolean
  initialize: () => Promise<void>
  play: (channelId: ChannelId, url: string) => Promise<void>
  crossfadeTo: (channelId: ChannelId, url: string, duration?: number) => Promise<void>
  stop: (channelId: ChannelId) => void
  stopAll: () => void
  setChannelVolume: (channelId: ChannelId, volume: number) => void
  setMasterVolume: (volume: number) => void
  getMasterVolume: () => number
  getChannelVolume: (channelId: ChannelId) => number
  isPlaying: (channelId: ChannelId) => boolean
}

const AudioCtx = createContext<AudioContextType | null>(null)

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<AudioEngine | null>(null)
  const [initialized, setInitialized] = useState(false)

  // エンジン取得（lazy init）
  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = AudioEngine.getInstance()
    }
    return engineRef.current
  }, [])

  const initialize = useCallback(async () => {
    const engine = getEngine()
    await engine.initialize()
    setInitialized(true)
  }, [getEngine])

  const play = useCallback(
    async (channelId: ChannelId, url: string) => {
      const engine = getEngine()
      if (!engine.isInitialized()) await engine.initialize()
      await engine.play(channelId, url)
    },
    [getEngine]
  )

  const crossfadeTo = useCallback(
    async (channelId: ChannelId, url: string, duration = 2) => {
      const engine = getEngine()
      if (!engine.isInitialized()) await engine.initialize()
      await engine.crossfadeTo(channelId, url, duration)
    },
    [getEngine]
  )

  const stop = useCallback(
    (channelId: ChannelId) => {
      getEngine().stopChannel(channelId)
    },
    [getEngine]
  )

  const stopAll = useCallback(() => {
    getEngine().stopAll()
  }, [getEngine])

  const setChannelVolume = useCallback(
    (channelId: ChannelId, volume: number) => {
      getEngine().setChannelVolume(channelId, volume)
    },
    [getEngine]
  )

  const setMasterVolume = useCallback(
    (volume: number) => {
      getEngine().setMasterVolume(volume)
    },
    [getEngine]
  )

  const getMasterVolume = useCallback(() => {
    return getEngine().getMasterVolume()
  }, [getEngine])

  const getChannelVolume = useCallback(
    (channelId: ChannelId) => {
      return getEngine().getChannelVolume(channelId)
    },
    [getEngine]
  )

  const isPlaying = useCallback(
    (channelId: ChannelId) => {
      return getEngine().isChannelPlaying(channelId)
    },
    [getEngine]
  )

  // バックグラウンド / フォアグラウンド対応
  useEffect(() => {
    const handleVisibilityChange = async () => {
      const engine = getEngine()
      if (!engine.isInitialized()) return

      if (document.hidden) {
        await engine.suspend()
      } else {
        await engine.resume()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [getEngine])

  // クリーンアップ
  useEffect(() => {
    return () => {
      engineRef.current?.dispose()
    }
  }, [])

  return (
    <AudioCtx.Provider
      value={{
        initialized,
        initialize,
        play,
        crossfadeTo,
        stop,
        stopAll,
        setChannelVolume,
        setMasterVolume,
        getMasterVolume,
        getChannelVolume,
        isPlaying,
      }}
    >
      {children}
    </AudioCtx.Provider>
  )
}

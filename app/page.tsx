'use client'

import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

import { useAudio } from '@/components/providers/AudioProvider'

export default function Home() {
  const [entered, setEntered] = useState(false)
  const [loading, setLoading] = useState(false)
  const audio = useAudio()

  const handleEnter = async () => {
    setLoading(true)
    try {
      await audio.initialize()
    } catch {
      // AudioContext 初期化失敗でも入室は許可
    }
    await new Promise((resolve) => setTimeout(resolve, 800))
    setEntered(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-base-100 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 z-10"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl mb-4"
            >
              🍃
            </motion.div>
            <h1 className="text-5xl font-bold text-primary-700 text-shadow-lg font-playfair">
              Nagomi Hub
            </h1>
            <p className="text-lg text-primary-600/80">リラックスできる作業空間へようこそ</p>

            <motion.button
              onClick={handleEnter}
              disabled={loading}
              className="px-8 py-4 glass-strong rounded-full text-primary-700 font-semibold text-lg hover:scale-105 transition-transform disabled:opacity-70"
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ✨
                  </motion.span>
                  入室中...
                </span>
              ) : (
                '部屋に入る'
              )}
            </motion.button>

            <p className="text-xs text-primary-500/60">クリックで音声が有効になります</p>
          </motion.div>
        ) : (
          <motion.div
            key="entered"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-8"
          >
            <h1 className="text-5xl font-bold text-primary-700 text-shadow-lg">Nagomi Hub</h1>
            <p className="text-xl text-primary-600">お部屋を選んでください</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/game"
                className="px-6 py-3 glass-strong rounded-full text-primary-700 font-semibold hover:scale-105 transition-transform"
              >
                🎮 ゲーム画面
              </Link>
              <Link
                href="/settings"
                className="px-6 py-3 glass-strong rounded-full text-primary-700 font-semibold hover:scale-105 transition-transform"
              >
                ⚙️ 設定画面
              </Link>
              <Link
                href="/achievements"
                className="px-6 py-3 glass-strong rounded-full text-primary-700 font-semibold hover:scale-105 transition-transform"
              >
                🏆 実績
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

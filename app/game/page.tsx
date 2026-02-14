'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

import CanvasParticles from '@/components/effects/CanvasParticles'
import ThemeBackground from '@/components/effects/ThemeBackground'
import AmbientSound from '@/components/game/AmbientSound'
import Character from '@/components/game/Character'
import FloatingActionButton from '@/components/game/FloatingActionButton'
import ProgressBar from '@/components/game/ProgressBar'
import Timer from '@/components/game/Timer'
import Modal from '@/components/ui/Modal'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

export default function GamePage() {
  const [timerOpen, setTimerOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const [soundOpen, setSoundOpen] = useState(false)
  const { theme } = useTheme()
  const [primaryColor, setPrimaryColor] = useState('var(--color-primary)')
  const [secondaryColor, setSecondaryColor] = useState('var(--color-secondary)')

  // テーマが変わったときに色を更新
  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateColors = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const primary = computedStyle.getPropertyValue('--color-primary').trim()
      const secondary = computedStyle.getPropertyValue('--color-secondary').trim()

      if (primary) setPrimaryColor(primary)
      if (secondary) setSecondaryColor(secondary)
    }

    // 初回実行
    updateColors()

    // テーマ変更を監視
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [theme])

  return (
    <div className="h-screen overflow-hidden relative noise">
      {/* 全画面背景（オーバーレイ） - テーマ対応 */}
      <ThemeBackground />

      {/* 2Dパーティクルエフェクト背景 */}
      <CanvasParticles />

      {/* ヘッダー */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
      >
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-shadow-lg font-playfair tracking-wide relative z-40"
          style={{
            backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Nagomi Hub
        </h1>
        <nav className="flex gap-2 sm:gap-4 items-center">
          <ThemeSwitcher />
          <Link
            href="/settings"
            className="px-4 py-2 glass rounded-full text-sm font-medium text-base-content hover:bg-base-200/30 transition-colors"
          >
            設定
          </Link>
          <Link
            href="/achievements"
            className="px-4 py-2 glass rounded-full text-sm font-medium text-base-content hover:bg-base-200/30 transition-colors"
          >
            実績
          </Link>
        </nav>
      </motion.header>

      {/* キャラクター表示エリア（中央） */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <Character name="森の精霊" level={5} />
        </motion.div>

        {/* 装飾的な要素 - テーマ連動 */}
        <div
          className="absolute top-20 right-20 text-4xl opacity-20 pointer-events-none transition-colors duration-300"
          style={{ color: primaryColor }}
        >
          🍃
        </div>
        <div
          className="absolute bottom-20 left-20 text-3xl opacity-20 pointer-events-none transition-colors duration-300"
          style={{ color: secondaryColor }}
        >
          🌿
        </div>
      </div>

      {/* フローティングアクションボタン */}
      <FloatingActionButton
        icon="⏱️"
        label="タイマー"
        onClick={() => setTimerOpen(true)}
        position="bottom-right"
        index={0}
      />
      <FloatingActionButton
        icon="📊"
        label="進捗"
        onClick={() => setProgressOpen(true)}
        position="bottom-right"
        index={1}
      />
      <FloatingActionButton
        icon="🎵"
        label="環境音"
        onClick={() => setSoundOpen(true)}
        position="bottom-right"
        index={2}
      />

      {/* モーダル */}
      <Modal isOpen={timerOpen} onClose={() => setTimerOpen(false)} title="ポモドーロタイマー">
        <Timer />
      </Modal>

      <Modal isOpen={progressOpen} onClose={() => setProgressOpen(false)} title="進捗">
        <ProgressBar currentXP={450} nextLevelXP={600} level={5} />
      </Modal>

      <Modal isOpen={soundOpen} onClose={() => setSoundOpen(false)} title="環境音">
        <AmbientSound />
      </Modal>
    </div>
  )
}

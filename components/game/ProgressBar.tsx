'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentXP: number
  nextLevelXP: number
  level: number
}

export default function ProgressBar({ currentXP, nextLevelXP, level }: ProgressBarProps) {
  const progress = (currentXP / nextLevelXP) * 100

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-base-content/70">Lv. {level}</span>
      </div>

      {/* プログレスバー */}
      <div className="relative h-4 bg-base-300 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary to-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-base-content z-10">
            {currentXP} / {nextLevelXP} XP
          </span>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">12</p>
          <p className="text-xs text-base-content/60">セッション</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">5h 30m</p>
          <p className="text-xs text-base-content/60">総時間</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">8</p>
          <p className="text-xs text-base-content/60">実績</p>
        </div>
      </div>
    </div>
  )
}

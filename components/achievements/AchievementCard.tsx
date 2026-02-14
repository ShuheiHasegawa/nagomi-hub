'use client'

import { motion } from 'framer-motion'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
  unlockedAt?: string
}

interface AchievementCardProps {
  achievement: Achievement
  index: number
}

export default function AchievementCard({ achievement, index }: AchievementCardProps) {
  const progressPercentage =
    achievement.progress && achievement.maxProgress
      ? (achievement.progress / achievement.maxProgress) * 100
      : achievement.unlocked
        ? 100
        : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl p-6 ${
        achievement.unlocked ? 'glass-strong ring-2 ring-primary-400' : 'glass opacity-60'
      }`}
    >
      {/* 背景装飾 */}
      {achievement.unlocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-300/20 to-accent-blue/20" />
      )}

      <div className="relative flex items-start gap-4">
        {/* アイコン */}
        <div
          className={`text-5xl flex-shrink-0 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}
        >
          {achievement.icon}
        </div>

        {/* 情報 */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold mb-1 ${
              achievement.unlocked ? 'text-primary-700' : 'text-primary-500'
            }`}
          >
            {achievement.title}
          </h3>
          <p className="text-sm text-primary-600 mb-3">{achievement.description}</p>

          {/* 進捗バー */}
          {!achievement.unlocked && achievement.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-primary-500">
                <span>進捗</span>
                <span>
                  {achievement.progress} / {achievement.maxProgress}
                </span>
              </div>
              <div className="h-2 bg-primary-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </div>
          )}

          {/* 解除日時 */}
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-primary-500 mt-2">解除日: {achievement.unlockedAt}</p>
          )}
        </div>

        {/* バッジ */}
        {achievement.unlocked && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: index * 0.1 }}
            className="text-2xl"
          >
            ✅
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import AchievementCard from '@/components/achievements/AchievementCard'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

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

const achievements: Achievement[] = [
  {
    id: '1',
    title: '初めてのセッション',
    description: '最初のポモドーロセッションを完了',
    icon: '🎯',
    unlocked: true,
    unlockedAt: '2024-01-15',
  },
  {
    id: '2',
    title: '継続の力',
    description: '7日連続でセッションを完了',
    icon: '🔥',
    unlocked: true,
    unlockedAt: '2024-01-22',
  },
  {
    id: '3',
    title: 'マスター',
    description: '100回のセッションを完了',
    icon: '👑',
    unlocked: false,
    progress: 45,
    maxProgress: 100,
  },
  {
    id: '4',
    title: '夜更かし',
    description: '深夜にセッションを完了',
    icon: '🌙',
    unlocked: true,
    unlockedAt: '2024-01-20',
  },
  {
    id: '5',
    title: '早起き',
    description: '朝6時前にセッションを完了',
    icon: '🌅',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: '6',
    title: '集中の達人',
    description: '1日で10セッションを完了',
    icon: '⚡',
    unlocked: false,
    progress: 7,
    maxProgress: 10,
  },
  {
    id: '7',
    title: '環境音マスター',
    description: 'すべての環境音を試す',
    icon: '🎵',
    unlocked: true,
    unlockedAt: '2024-01-18',
  },
  {
    id: '8',
    title: 'カスタマイズ好き',
    description: 'すべての背景とキャラクターを試す',
    icon: '🎨',
    unlocked: false,
    progress: 5,
    maxProgress: 8,
  },
]

export default function AchievementsPage() {
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length
  const completionPercentage = (unlockedCount / totalCount) * 100

  return (
    <div className="min-h-screen p-4 md:p-8 noise bg-base-100">
      <div className="max-w-5xl mx-auto">
        {/* ヘッダー */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-base-content text-shadow">実績</h1>
              <p className="text-xs sm:text-sm text-base-content/70 mt-1">あなたの達成を記録</p>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <ThemeSwitcher />
              <Link
                href="/game"
                className="px-4 py-2 glass rounded-full text-xs sm:text-sm font-medium text-base-content hover:bg-base-200/30 transition-colors whitespace-nowrap w-full sm:w-auto text-center"
              >
                ゲームに戻る
              </Link>
            </div>
          </div>

          {/* 進捗サマリー */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-primary-700">実績進捗</h2>
              <span className="text-2xl font-bold text-primary-600">
                {unlockedCount} / {totalCount}
              </span>
            </div>
            <div className="relative h-4 bg-primary-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="text-sm text-primary-600 mt-2 text-center">
              {Math.round(completionPercentage)}% 完了
            </p>
          </div>
        </motion.header>

        {/* 実績グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

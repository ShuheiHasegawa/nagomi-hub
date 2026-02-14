'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import AchievementCard from '@/components/achievements/AchievementCard'
import { useAuth } from '@/components/providers/AuthProvider'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'
import {
  getAllAchievements,
  getUserAchievements,
} from '@/lib/achievements/achievement-service'
import type { Achievement as AchievementMaster } from '@/lib/achievements/achievement-service'

interface AchievementView {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
  unlockedAt?: string
}

function mergeAchievements(
  all: AchievementMaster[],
  userMap: Map<string, { progress: number; unlocked: boolean; unlocked_at: string | null }>
): AchievementView[] {
  return all.map((a) => {
    const user = userMap.get(a.id)
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon,
      unlocked: user?.unlocked ?? false,
      progress: user?.progress ?? 0,
      maxProgress: a.condition_value,
      unlockedAt: user?.unlocked_at ?? undefined,
    }
  })
}

export default function AchievementsPage() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<AchievementView[]>([])
  const [loading, setLoading] = useState(true)

  const loadAchievements = useCallback(async () => {
    setLoading(true)
    const allAchievements = await getAllAchievements()

    if (user) {
      const userAchievements = await getUserAchievements(user.id)
      const userMap = new Map(
        userAchievements.map((ua) => [
          ua.achievement_id,
          { progress: ua.progress, unlocked: ua.unlocked, unlocked_at: ua.unlocked_at },
        ])
      )
      setAchievements(mergeAchievements(allAchievements, userMap))
    } else {
      setAchievements(
        allAchievements.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          icon: a.icon,
          unlocked: false,
          progress: 0,
          maxProgress: a.condition_value,
        }))
      )
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadAchievements()
  }, [loadAchievements])

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

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
        {loading ? (
          <div className="text-center py-12 text-base-content/50">読み込み中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

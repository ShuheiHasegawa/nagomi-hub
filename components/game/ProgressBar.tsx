'use client'

import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/components/providers/AuthProvider'
import { calculateLevel, getProfile } from '@/lib/profile/profile-service'
import { getUserStats } from '@/lib/timer/session-service'

interface Stats {
  totalSessions: number
  totalMinutes: number
  totalXp: number
}

export default function ProgressBar() {
  const { user } = useAuth()
  const [level, setLevel] = useState(1)
  const [currentXP, setCurrentXP] = useState(0)
  const [nextLevelXP, setNextLevelXP] = useState(100)
  const [stats, setStats] = useState<Stats>({ totalSessions: 0, totalMinutes: 0, totalXp: 0 })

  const loadData = useCallback(async () => {
    if (!user) return

    const [profile, userStats] = await Promise.all([getProfile(user.id), getUserStats(user.id)])

    if (profile) {
      const calc = calculateLevel(profile.total_xp)
      setLevel(calc.level)
      setCurrentXP(calc.currentLevelXp)
      setNextLevelXP(calc.nextLevelXp)
    }

    if (userStats) {
      const s = 'stats' in userStats && userStats.stats ? userStats.stats : null
      if (s) {
        setStats({
          totalSessions: s.totalSessions,
          totalMinutes: s.totalMinutes,
          totalXp: s.totalXp,
        })
      }
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const progress = nextLevelXP > 0 ? (currentXP / nextLevelXP) * 100 : 0
  const hours = Math.floor(stats.totalMinutes / 60)
  const minutes = stats.totalMinutes % 60

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
          <p className="text-2xl font-bold text-primary">{stats.totalSessions}</p>
          <p className="text-xs text-base-content/60">セッション</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {hours}h {minutes}m
          </p>
          <p className="text-xs text-base-content/60">総時間</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{stats.totalXp}</p>
          <p className="text-xs text-base-content/60">XP</p>
        </div>
      </div>
    </div>
  )
}

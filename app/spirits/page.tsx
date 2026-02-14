'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/components/providers/AuthProvider'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'
import { getAllSpirits, getUserSpirits } from '@/lib/spirits/spirit-service'
import type { Spirit, UserSpirit } from '@/lib/spirits/spirit-service'

const RARITY_COLORS: Record<string, string> = {
  common: 'from-green-400 to-emerald-500',
  uncommon: 'from-blue-400 to-cyan-500',
  rare: 'from-purple-400 to-violet-500',
  legendary: 'from-amber-400 to-orange-500',
}

const RARITY_LABELS: Record<string, string> = {
  common: 'コモン',
  uncommon: 'アンコモン',
  rare: 'レア',
  legendary: 'レジェンダリー',
}

const RARITY_EMOJI: Record<string, string> = {
  common: '🌿',
  uncommon: '💎',
  rare: '⭐',
  legendary: '🔥',
}

export default function SpiritsPage() {
  const { user } = useAuth()
  const [allSpirits, setAllSpirits] = useState<Spirit[]>([])
  const [obtained, setObtained] = useState<Set<string>>(new Set())
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [selectedSpirit, setSelectedSpirit] = useState<Spirit | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    const spirits = await getAllSpirits()
    setAllSpirits(spirits)

    if (user) {
      const userSpirits = await getUserSpirits(user.id)
      setObtained(new Set(userSpirits.map((us: UserSpirit) => us.spirit_id)))
      setFavorites(new Set(userSpirits.filter((us: UserSpirit) => us.is_favorite).map((us: UserSpirit) => us.spirit_id)))
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const obtainedCount = allSpirits.filter((s) => obtained.has(s.id)).length

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
              <h1 className="text-2xl sm:text-3xl font-bold text-base-content text-shadow">
                精霊図鑑
              </h1>
              <p className="text-xs sm:text-sm text-base-content/70 mt-1">
                集中することで精霊たちが集まってきます
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <ThemeSwitcher />
              <Link
                href="/game"
                className="px-4 py-2 glass rounded-full text-xs sm:text-sm font-medium text-base-content hover:bg-base-200/30 transition-colors"
              >
                ゲームに戻る
              </Link>
            </div>
          </div>

          {/* コレクション進捗 */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-primary-700">コレクション進捗</h2>
              <span className="text-2xl font-bold text-primary-600">
                {obtainedCount} / {allSpirits.length}
              </span>
            </div>
            <div className="relative h-4 bg-primary-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${allSpirits.length > 0 ? (obtainedCount / allSpirits.length) * 100 : 0}%`,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.header>

        {/* 精霊グリッド */}
        {loading ? (
          <div className="text-center py-12 text-base-content/50">読み込み中...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allSpirits.map((spirit, index) => {
              const isObtained = obtained.has(spirit.id)
              const isFav = favorites.has(spirit.id)

              return (
                <motion.button
                  key={spirit.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedSpirit(spirit)}
                  className={`relative p-4 rounded-2xl text-center transition-all ${
                    isObtained ? 'glass-strong' : 'glass opacity-50 grayscale'
                  }`}
                >
                  {isFav && (
                    <span className="absolute top-2 right-2 text-sm">❤️</span>
                  )}

                  <div className="text-4xl mb-2">
                    {isObtained ? RARITY_EMOJI[spirit.rarity] : '❓'}
                  </div>
                  <p className="text-sm font-medium text-base-content truncate">
                    {isObtained ? spirit.name : '???'}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${RARITY_COLORS[spirit.rarity]}`}
                  >
                    {RARITY_LABELS[spirit.rarity]}
                  </span>
                </motion.button>
              )
            })}
          </div>
        )}

        {/* 精霊詳細モーダル */}
        {selectedSpirit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setSelectedSpirit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-strong rounded-3xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-3">
                  {obtained.has(selectedSpirit.id) ? RARITY_EMOJI[selectedSpirit.rarity] : '❓'}
                </div>
                <h3 className="text-xl font-bold text-base-content">
                  {obtained.has(selectedSpirit.id) ? selectedSpirit.name : '???'}
                </h3>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${RARITY_COLORS[selectedSpirit.rarity]}`}
                >
                  {RARITY_LABELS[selectedSpirit.rarity]}
                </span>
                <p className="mt-4 text-sm text-base-content/70">
                  {obtained.has(selectedSpirit.id)
                    ? selectedSpirit.description
                    : '条件を満たすと出現します。集中を続けましょう。'}
                </p>
              </div>
              <button
                onClick={() => setSelectedSpirit(null)}
                className="mt-6 w-full py-2 glass rounded-xl text-sm font-medium text-base-content"
              >
                閉じる
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

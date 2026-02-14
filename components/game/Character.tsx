'use client'

import { motion } from 'framer-motion'

interface CharacterProps {
  name: string
  level: number
}

export default function Character({ name, level }: CharacterProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* キャラクター表示エリア */}
      <motion.div
        className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* キャラクターのプレースホルダー */}
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-300 to-primary-400 glass-strong flex items-center justify-center text-4xl sm:text-5xl md:text-6xl">
          🍃
        </div>

        {/* 光のパーティクル効果 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-accent-blue/40 to-transparent" />
        </motion.div>
      </motion.div>

      {/* キャラクター情報 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-4">
        <div className="glass-strong rounded-full px-6 py-2 text-center">
          <p className="text-sm font-semibold text-primary-700">{name}</p>
          <p className="text-xs text-primary-600">Lv. {level}</p>
        </div>
      </div>
    </div>
  )
}

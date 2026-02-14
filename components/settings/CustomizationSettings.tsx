'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Background {
  id: string
  name: string
  preview: string
}

interface Character {
  id: string
  name: string
  icon: string
}

const backgrounds: Background[] = [
  { id: '1', name: '森の朝', preview: '🌲' },
  { id: '2', name: '湖畔の午後', preview: '🌊' },
  { id: '3', name: '山の夕暮れ', preview: '⛰️' },
  { id: '4', name: '星空の夜', preview: '✨' },
]

const characters: Character[] = [
  { id: '1', name: '森の精霊', icon: '🍃' },
  { id: '2', name: '水の精霊', icon: '💧' },
  { id: '3', name: '風の精霊', icon: '🌬️' },
  { id: '4', name: '光の精霊', icon: '✨' },
]

export default function CustomizationSettings() {
  const [selectedBackground, setSelectedBackground] = useState('1')
  const [selectedCharacter, setSelectedCharacter] = useState('1')
  const [themeColor, setThemeColor] = useState('green')

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-6">
      <h3 className="text-xl font-semibold text-primary-700">カスタマイズ</h3>

      {/* 背景選択 */}
      <div>
        <h4 className="text-sm font-semibold text-primary-700 mb-3">背景</h4>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {backgrounds.map((bg) => (
            <motion.button
              key={bg.id}
              onClick={() => setSelectedBackground(bg.id)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedBackground === bg.id
                  ? 'glass-strong ring-2 ring-primary-500'
                  : 'glass hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-2">{bg.preview}</div>
              <p className="text-xs font-medium text-primary-700">{bg.name}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* キャラクター選択 */}
      <div>
        <h4 className="text-sm font-semibold text-primary-700 mb-3">キャラクター</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {characters.map((char) => (
            <motion.button
              key={char.id}
              onClick={() => setSelectedCharacter(char.id)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedCharacter === char.id
                  ? 'glass-strong ring-2 ring-primary-500'
                  : 'glass hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-3xl mb-1">{char.icon}</div>
              <p className="text-xs font-medium text-primary-700">{char.name}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* テーマカラー */}
      <div>
        <h4 className="text-sm font-semibold text-primary-700 mb-3">テーマカラー</h4>
        <div className="flex gap-3">
          {[
            { id: 'green', name: 'グリーン', color: 'bg-primary-500' },
            { id: 'blue', name: 'ブルー', color: 'bg-accent-blue' },
            { id: 'orange', name: 'オレンジ', color: 'bg-accent-orange' },
          ].map((theme) => (
            <motion.button
              key={theme.id}
              onClick={() => setThemeColor(theme.id)}
              className={`w-16 h-16 rounded-full ${theme.color} ${
                themeColor === theme.id ? 'ring-4 ring-primary-300' : ''
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={theme.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

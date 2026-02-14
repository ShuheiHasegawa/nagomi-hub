'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function AccountSettings() {
  const [email, setEmail] = useState('user@example.com')
  const [displayName, setDisplayName] = useState('ユーザー')
  const [notifications, setNotifications] = useState(true)
  const [dataSync, setDataSync] = useState(true)

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-6">
      <h3 className="text-xl font-semibold text-primary-700">アカウント設定</h3>

      {/* プロフィール情報 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">表示名</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2 glass rounded-xl text-primary-700 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder="表示名を入力"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 glass rounded-xl text-primary-700 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder="email@example.com"
          />
        </div>
      </div>

      {/* 設定オプション */}
      <div className="space-y-4 pt-4 border-t border-primary-200/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-700">通知を受け取る</p>
            <p className="text-xs text-primary-500">タイマー完了などの通知</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              notifications ? 'bg-primary-500' : 'bg-primary-300'
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
              animate={{ x: notifications ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-700">データ同期</p>
            <p className="text-xs text-primary-500">クラウドに進捗を保存</p>
          </div>
          <button
            onClick={() => setDataSync(!dataSync)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              dataSync ? 'bg-primary-500' : 'bg-primary-300'
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
              animate={{ x: dataSync ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* 保存ボタン */}
      <motion.button
        className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        変更を保存
      </motion.button>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'

export default function AccountSettings() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [dataSync, setDataSync] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const loadProfile = useCallback(async () => {
    if (!user) return
    setEmail(user.email ?? '')

    const supabase = createClient()
    const { data } = await supabase.from('profiles').select('display_name').eq('id', user.id).single()

    if (data?.display_name) setDisplayName(data.display_name)
  }, [user])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setMessage('')

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', user.id)

    setSaving(false)
    setMessage(error ? '保存に失敗しました' : '保存しました')
    setTimeout(() => setMessage(''), 3000)
  }

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
            readOnly
            className="w-full px-4 py-2 glass rounded-xl text-primary-700/60 cursor-not-allowed"
          />
          <p className="text-xs text-primary-500 mt-1">メールアドレスは変更できません</p>
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

      {/* メッセージ */}
      {message && (
        <p className={`text-sm ${message.includes('失敗') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}

      {/* 保存ボタン */}
      <motion.button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {saving ? '保存中...' : '変更を保存'}
      </motion.button>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signInWithEmail, signInWithOAuth } from '@/lib/supabase/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signInWithEmail(email, password)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/game')
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null)
    const { error } = await signInWithOAuth(provider)
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 noise">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 space-y-6">
          {/* ヘッダー */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary-700 text-shadow">Nagomi Hub</h1>
            <p className="text-sm text-primary-600">ログインして始めましょう</p>
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="p-3 rounded-xl bg-red-100/50 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* フォーム */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl text-primary-700 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">パスワード</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl text-primary-700 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 pr-12"
                  placeholder="パスワードを入力"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-primary-600">
                <input type="checkbox" className="rounded accent-primary-500" />
                ログイン状態を保持
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-primary-600 hover:text-primary-700"
              >
                パスワードを忘れた？
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </motion.button>
          </form>

          {/* ソーシャルログイン */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/20 text-primary-600">または</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuth('google')}
              className="px-4 py-3 glass rounded-xl text-sm font-medium text-primary-700 hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
            >
              <span>🔵</span>
              Google
            </button>
            <button
              onClick={() => handleOAuth('github')}
              className="px-4 py-3 glass rounded-xl text-sm font-medium text-primary-700 hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
            >
              <span>⚫</span>
              GitHub
            </button>
          </div>

          {/* サインアップリンク */}
          <p className="text-center text-sm text-primary-600">
            アカウントをお持ちでないですか？{' '}
            <Link href="/auth/signup" className="text-primary-700 font-semibold hover:underline">
              サインアップ
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

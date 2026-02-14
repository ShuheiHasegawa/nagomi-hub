'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signInWithOAuth, signUpWithEmail } from '@/lib/supabase/auth'

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }
    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      return
    }

    setLoading(true)
    const { error } = await signUpWithEmail(email, password, displayName)
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
            <h1 className="text-3xl font-bold text-primary-700 text-shadow">アカウント作成</h1>
            <p className="text-sm text-primary-600">新しいアカウントを作成して始めましょう</p>
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
              <label className="block text-sm font-medium text-primary-700 mb-2">表示名</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl text-primary-700 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="表示名を入力"
              />
            </div>

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
                  placeholder="8文字以上"
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

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                パスワード確認
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl text-primary-700 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="パスワードを再入力"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 rounded accent-primary-500"
              />
              <label className="text-sm text-primary-600">
                <Link href="/terms" className="text-primary-700 hover:underline">
                  利用規約
                </Link>
                と
                <Link href="/privacy" className="text-primary-700 hover:underline">
                  プライバシーポリシー
                </Link>
                に同意します
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={!agreeToTerms || loading}
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: agreeToTerms && !loading ? 1.02 : 1 }}
              whileTap={{ scale: agreeToTerms && !loading ? 0.98 : 1 }}
            >
              {loading ? '作成中...' : 'アカウントを作成'}
            </motion.button>
          </form>

          {/* ソーシャルサインアップ */}
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

          {/* ログインリンク */}
          <p className="text-center text-sm text-primary-600">
            既にアカウントをお持ちですか？{' '}
            <Link href="/auth/login" className="text-primary-700 font-semibold hover:underline">
              ログイン
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

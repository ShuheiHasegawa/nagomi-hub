'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import AccountSettings from '@/components/settings/AccountSettings'
import CustomizationSettings from '@/components/settings/CustomizationSettings'
import MusicSettings from '@/components/settings/MusicSettings'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 noise bg-base-100">
      <div className="max-w-5xl mx-auto">
        {/* ヘッダー */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-between items-center"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content text-shadow">設定</h1>
            <p className="text-xs sm:text-sm text-base-content/70 mt-1">
              ゲームの設定をカスタマイズ
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <ThemeSwitcher />
            <Link
              href="/game"
              className="px-4 py-2 glass rounded-full text-xs sm:text-sm font-medium text-base-content hover:bg-base-200/30 transition-colors whitespace-nowrap"
            >
              ゲームに戻る
            </Link>
          </div>
        </motion.header>

        {/* 設定セクション */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MusicSettings />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CustomizationSettings />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AccountSettings />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

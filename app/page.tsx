'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-base-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8"
      >
        <h1 className="text-5xl font-bold text-primary-700 text-shadow-lg">Nagomi Hub</h1>
        <p className="text-xl text-primary-600">モック画面へ移動</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/game"
            className="px-6 py-3 glass-strong rounded-full text-primary-700 font-semibold hover:scale-105 transition-transform"
          >
            ゲーム画面
          </Link>
          <Link
            href="/settings"
            className="px-6 py-3 glass-strong rounded-full text-primary-700 font-semibold hover:scale-105 transition-transform"
          >
            設定画面
          </Link>
        </div>
      </motion.div>
    </main>
  )
}

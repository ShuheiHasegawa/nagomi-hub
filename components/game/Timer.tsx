'use client'

import { motion } from 'framer-motion'

import { useTimer } from '@/lib/timer/use-timer'
import type { SessionType } from '@/lib/timer/use-timer'

const SESSION_LABELS: Record<SessionType, string> = {
  work: '作業',
  short_break: '休憩',
  long_break: '長休憩',
}

export default function Timer() {
  const timer = useTimer({
    onComplete: (sessionType) => {
      if (sessionType === 'work') {
        // TODO: M1-6 でSupabaseにセッション記録
      }
    },
  })

  const minutes = Math.floor(timer.remaining / 60)
  const seconds = timer.remaining % 60
  const progress = timer.total > 0 ? (timer.elapsed / timer.total) * 100 : 0

  return (
    <div className="space-y-4">
      {/* セッション種別表示 */}
      <div className="text-center">
        <span className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
          {SESSION_LABELS[timer.sessionType]}
        </span>
      </div>

      {/* タイマー表示 */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-base-300"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-base-content">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>

      {/* コントロールボタン */}
      <div className="flex gap-3 justify-center">
        {timer.status === 'idle' || timer.status === 'completed' ? (
          <button
            onClick={() => timer.start('work')}
            className="px-6 py-2 bg-primary text-primary-content rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            開始
          </button>
        ) : timer.status === 'running' ? (
          <button
            onClick={timer.pause}
            className="px-6 py-2 bg-accent text-accent-content rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            一時停止
          </button>
        ) : (
          <button
            onClick={timer.resume}
            className="px-6 py-2 bg-accent text-accent-content rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            再開
          </button>
        )}
        <button
          onClick={timer.stop}
          className="px-6 py-2 glass rounded-full font-semibold text-base-content hover:bg-base-200/30 transition-colors"
        >
          リセット
        </button>
      </div>

      {/* 完了時の次セッションボタン */}
      {timer.status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={timer.startNext}
            className="px-6 py-2 bg-secondary text-secondary-content rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            次へ: {timer.sessionType === 'work' ? '休憩' : '作業'}
          </button>
        </motion.div>
      )}

      {/* セッション数表示 */}
      <div className="text-center text-xs text-base-content/50">
        完了セッション: {timer.completedSessions}
      </div>
    </div>
  )
}

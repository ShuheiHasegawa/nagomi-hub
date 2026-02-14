'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Timer() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!isRunning || isPaused) return

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          if (minutes === 0) {
            setIsRunning(false)
            return 0
          }
          setMinutes((m) => m - 1)
          return 59
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isPaused, minutes])

  const handleStart = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setMinutes(25)
    setSeconds(0)
  }

  const totalSeconds = minutes * 60 + seconds
  const maxSeconds = 25 * 60
  const progress = ((maxSeconds - totalSeconds) / maxSeconds) * 100

  return (
    <div className="space-y-4">
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
            transition={{ duration: 1 }}
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
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-primary text-primary-content rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            開始
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-accent text-accent-content rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            {isPaused ? '再開' : '一時停止'}
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-6 py-2 glass rounded-full font-semibold text-base-content hover:bg-base-200/30 transition-colors"
        >
          リセット
        </button>
      </div>
    </div>
  )
}

'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

const themeGradients: Record<string, string> = {
  light: 'from-green-50/20 via-emerald-100/10 to-blue-50/20',
  dark: 'from-gray-900/30 via-slate-800/20 to-gray-900/30',
  forest: 'from-emerald-900/20 via-green-800/15 to-lime-900/20',
  ocean: 'from-blue-900/20 via-cyan-800/15 to-indigo-900/20',
  sunset: 'from-orange-200/20 via-rose-100/15 to-amber-100/20',
  night: 'from-indigo-950/30 via-purple-900/20 to-blue-950/30',
  sakura: 'from-pink-100/20 via-rose-100/15 to-pink-50/20',
  autumn: 'from-orange-100/20 via-amber-100/15 to-red-100/20',
  winter: 'from-blue-50/20 via-slate-100/15 to-cyan-50/20',
}

export default function ThemeBackground() {
  const { theme } = useTheme()
  const [currentGradient, setCurrentGradient] = useState('')
  const [prevGradient, setPrevGradient] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const newGradient = themeGradients[theme ?? 'light'] ?? themeGradients.light
    if (newGradient === currentGradient) return

    setPrevGradient(currentGradient)
    setCurrentGradient(newGradient)
    setTransitioning(true)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setTransitioning(false), 800)
  }, [theme, currentGradient])

  return (
    <div className="absolute inset-0 z-[1]">
      {/* 前のテーマ (フェードアウト) */}
      {transitioning && prevGradient && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${prevGradient} transition-opacity duration-700 ease-out opacity-0`}
        />
      )}
      {/* 現在のテーマ (フェードイン) */}
      <div className="absolute inset-0 bg-base-100 transition-colors duration-500" />
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentGradient} transition-opacity duration-700 ease-in opacity-100`}
      />
    </div>
  )
}

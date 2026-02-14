'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useState } from 'react'

export default function DynamicGradient() {
  const [time, setTime] = useState(0)

  useFrame((state) => {
    setTime(state.clock.elapsedTime)
  })

  // 時間帯に応じたグラデーションの色を計算
  const getGradientColors = () => {
    const hour = (time / 3600) % 24 // 仮想的な時間（実際の時間に変更可能）

    if (hour >= 6 && hour < 12) {
      // 朝
      return {
        from: 'rgba(255, 200, 150, 0.3)',
        via: 'rgba(184, 224, 246, 0.4)',
        to: 'rgba(168, 213, 186, 0.3)',
      }
    } else if (hour >= 12 && hour < 18) {
      // 昼
      return {
        from: 'rgba(184, 224, 246, 0.4)',
        via: 'rgba(168, 213, 186, 0.5)',
        to: 'rgba(184, 224, 246, 0.4)',
      }
    } else if (hour >= 18 && hour < 22) {
      // 夕方
      return {
        from: 'rgba(255, 184, 140, 0.4)',
        via: 'rgba(255, 200, 150, 0.3)',
        to: 'rgba(184, 224, 246, 0.3)',
      }
    } else {
      // 夜
      return {
        from: 'rgba(100, 100, 150, 0.3)',
        via: 'rgba(150, 150, 200, 0.2)',
        to: 'rgba(100, 100, 150, 0.3)',
      }
    }
  }

  const colors = getGradientColors()

  return (
    <div
      className="absolute inset-0 transition-all duration-1000"
      style={{
        background: `linear-gradient(to bottom right, ${colors.from}, ${colors.via}, ${colors.to})`,
      }}
    />
  )
}

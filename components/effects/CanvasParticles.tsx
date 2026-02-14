'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  baseOpacity: number
  type: 'leaf' | 'light'
  baseSize: number
  windOffset: number // 風による左右の揺れ
  windSpeed: number // 風の速度
  fallSpeed: number // 落下速度
}

interface MousePosition {
  x: number
  y: number
}

export default function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const mouseRef = useRef<MousePosition>({ x: -1000, y: -1000 })
  const [isHovering, setIsHovering] = useState(false)
  const { theme } = useTheme()

  // テーマに応じた色を取得
  const getParticleColor = (type: 'leaf' | 'light') => {
    if (type === 'leaf') {
      // テーマに応じた葉っぱの色
      switch (theme) {
        case 'dark':
        case 'night':
          return '#4a7c2a' // 暗い緑
        case 'forest':
          return '#6b8e23' // オリーブグリーン
        case 'ocean':
          return '#8bb6e0' // 青緑
        case 'sunset':
          return '#fed7aa' // オレンジ系
        default:
          return '#a8d5ba' // デフォルト（明るい緑）
      }
    } else {
      // テーマに応じた光の色
      switch (theme) {
        case 'dark':
        case 'night':
          return '#ffffff' // 白
        case 'forest':
          return '#8b9a46' // 黄緑
        case 'ocean':
          return '#b8e0f6' // 青
        case 'sunset':
          return '#ffd700' // 金色
        default:
          return '#ffffff' // デフォルト（白）
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // キャンバスサイズを設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // マウス位置を追跡（ウィンドウ全体で）
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
      setIsHovering(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    // パーティクルを生成（雪のように）
    const particleCount = 300
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height, // 上から開始
      vx: 0,
      vy: 0,
      size: Math.random() * 4 + 2,
      baseSize: Math.random() * 4 + 2,
      opacity: Math.random() * 0.4 + 0.6,
      baseOpacity: Math.random() * 0.4 + 0.6,
      type: Math.random() > 0.3 ? 'light' : 'leaf', // 主に光の粒（雪のように）
      windOffset: Math.random() * Math.PI * 2, // 風の位相
      windSpeed: Math.random() * 0.02 + 0.01, // 風の速度
      fallSpeed: Math.random() * 0.5 + 0.3, // 落下速度
    }))

    // ヘルパー関数: 16進数カラーをRGBに変換
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 255, b: 255 }
    }

    // アニメーションループ
    let time = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      const mouse = mouseRef.current
      const mouseRadius = 120 // マウスの影響範囲
      const isValidMouse =
        mouse.x >= 0 && mouse.y >= 0 && mouse.x <= canvas.width && mouse.y <= canvas.height

      // マウス周りのエフェクトを描画
      if (isHovering && isValidMouse) {
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouseRadius
        )
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
        gradient.addColorStop(0.5, 'rgba(184, 224, 246, 0.08)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      particlesRef.current.forEach((particle, index) => {
        // 風による左右の揺れ（ゆらゆら）
        particle.windOffset += particle.windSpeed
        const windX = Math.sin(particle.windOffset + time * 0.5) * 0.8

        // 基本的な落下速度
        particle.vy = particle.fallSpeed

        // マウスとの距離に応じて反応
        if (isHovering && isValidMouse) {
          const dx = mouse.x - particle.x
          const dy = mouse.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouseRadius) {
            // マウスに近づくと押しのけられる
            const force = (mouseRadius - distance) / mouseRadius
            const angle = Math.atan2(dy, dx)

            // 反発力（押しのける）
            const repelForce = force * 0.8
            particle.vx = -Math.cos(angle) * repelForce + windX
            particle.vy = -Math.sin(angle) * repelForce * 0.5 + particle.fallSpeed

            // パーティクルを大きく、明るくする
            particle.size = particle.baseSize * (1 + force * 0.6)
            particle.opacity = Math.min(1, particle.baseOpacity + force * 0.4)
          } else {
            // 通常の落下 + 風による揺れ
            particle.vx = windX
            particle.size += (particle.baseSize - particle.size) * 0.1
            particle.opacity += (particle.baseOpacity - particle.opacity) * 0.1
          }
        } else {
          // 通常の落下 + 風による揺れ
          particle.vx = windX
          particle.size += (particle.baseSize - particle.size) * 0.1
          particle.opacity += (particle.baseOpacity - particle.opacity) * 0.1
        }

        // 位置を更新
        particle.x += particle.vx
        particle.y += particle.vy

        // 画面下部に到達したら上から再スタート
        if (particle.y > canvas.height + 10) {
          particle.y = -10
          particle.x = Math.random() * canvas.width
          particle.windOffset = Math.random() * Math.PI * 2
        }

        // 左右の境界で反転（画面内に留める）
        if (particle.x < -10) {
          particle.x = canvas.width + 10
        }
        if (particle.x > canvas.width + 10) {
          particle.x = -10
        }

        // パーティクルを描画（雪のように）
        ctx.save()
        ctx.globalAlpha = particle.opacity

        const particleColor = getParticleColor(particle.type)
        const rgb = hexToRgb(particleColor)

        if (particle.type === 'leaf') {
          // 葉っぱの形状（少ない）
          ctx.fillStyle = particleColor
          ctx.beginPath()
          ctx.ellipse(
            particle.x,
            particle.y,
            particle.size * 1.2,
            particle.size * 0.8,
            Math.sin(particle.windOffset) * 0.3,
            0,
            Math.PI * 2
          )
          ctx.fill()
        } else {
          // 雪のような光の粒
          ctx.fillStyle = particleColor
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          // 雪の結晶のような形状（6角形）
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${particle.opacity * 0.8})`
          ctx.lineWidth = 1
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i
            const x1 = particle.x + Math.cos(angle) * particle.size
            const y1 = particle.y + Math.sin(angle) * particle.size
            const x2 = particle.x + Math.cos(angle) * particle.size * 0.5
            const y2 = particle.y + Math.sin(angle) * particle.size * 0.5
            if (i === 0) {
              ctx.moveTo(x1, y1)
            } else {
              ctx.lineTo(x1, y1)
            }
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(x2, y2)
          }
          ctx.stroke()

          // 光のハロー（柔らかく）
          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 2.5
          )
          gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${particle.opacity * 0.6})`)
          gradient.addColorStop(
            0.5,
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${particle.opacity * 0.3})`
          )
          gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`)
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 2.5, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isHovering, theme])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  )
}

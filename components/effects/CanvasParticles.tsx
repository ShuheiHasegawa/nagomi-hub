'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

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
  windOffset: number
  windSpeed: number
  fallSpeed: number
  active: boolean
}

const MOUSE_RADIUS = 120
const TARGET_FPS = 50
const MIN_PARTICLES = 40
const MAX_PARTICLES = 200

function getParticleColor(type: 'leaf' | 'light', theme: string | undefined) {
  if (type === 'leaf') {
    switch (theme) {
      case 'dark':
      case 'night':
        return '#4a7c2a'
      case 'forest':
        return '#6b8e23'
      case 'ocean':
        return '#8bb6e0'
      case 'sunset':
        return '#fed7aa'
      default:
        return '#a8d5ba'
    }
  } else {
    switch (theme) {
      case 'dark':
      case 'night':
        return '#ffffff'
      case 'forest':
        return '#8b9a46'
      case 'ocean':
        return '#b8e0f6'
      case 'sunset':
        return '#ffd700'
      default:
        return '#ffffff'
    }
  }
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 255, g: 255, b: 255 }
}

function createParticle(w: number, h: number, startFromTop: boolean): Particle {
  return {
    x: Math.random() * w,
    y: startFromTop ? -10 : Math.random() * h,
    vx: 0,
    vy: 0,
    size: Math.random() * 4 + 2,
    baseSize: Math.random() * 4 + 2,
    opacity: Math.random() * 0.4 + 0.6,
    baseOpacity: Math.random() * 0.4 + 0.6,
    type: Math.random() > 0.3 ? 'light' : 'leaf',
    windOffset: Math.random() * Math.PI * 2,
    windSpeed: Math.random() * 0.02 + 0.01,
    fallSpeed: Math.random() * 0.5 + 0.3,
    active: true,
  }
}

export default function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const mouse = { x: -1000, y: -1000 }
    let hovering = false

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      hovering = true
    }
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
      hovering = false
    }
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    // 初期パーティクル数（デバイス性能に応じて調整される）
    const isMobile = window.innerWidth < 768
    let activeCount = isMobile ? 80 : 150
    const particles: Particle[] = Array.from({ length: MAX_PARTICLES }, (_, i) => {
      const p = createParticle(canvas.width, canvas.height, false)
      p.active = i < activeCount
      return p
    })

    // FPS計測用
    let lastFrameTime = performance.now()
    let fpsAccum = 0
    let fpsFrames = 0
    let animationFrame = 0
    let time = 0

    const animate = () => {
      const now = performance.now()
      const delta = now - lastFrameTime
      lastFrameTime = now

      // FPS計測 (2秒ごとにパーティクル数を調整)
      fpsAccum += 1000 / Math.max(delta, 1)
      fpsFrames++
      if (fpsFrames >= 120) {
        const avgFps = fpsAccum / fpsFrames
        if (avgFps < TARGET_FPS && activeCount > MIN_PARTICLES) {
          activeCount = Math.max(MIN_PARTICLES, activeCount - 20)
          for (let i = activeCount; i < particles.length; i++) particles[i].active = false
        } else if (avgFps > TARGET_FPS + 10 && activeCount < MAX_PARTICLES) {
          const newCount = Math.min(MAX_PARTICLES, activeCount + 10)
          for (let i = activeCount; i < newCount; i++) {
            particles[i] = createParticle(canvas.width, canvas.height, true)
          }
          activeCount = newCount
        }
        fpsAccum = 0
        fpsFrames = 0
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      const isValidMouse =
        mouse.x >= 0 && mouse.y >= 0 && mouse.x <= canvas.width && mouse.y <= canvas.height

      if (hovering && isValidMouse) {
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          MOUSE_RADIUS
        )
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
        gradient.addColorStop(0.5, 'rgba(184, 224, 246, 0.08)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (!p.active) continue

        p.windOffset += p.windSpeed
        const windX = Math.sin(p.windOffset + time * 0.5) * 0.8
        p.vy = p.fallSpeed

        if (hovering && isValidMouse) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MOUSE_RADIUS) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
            const angle = Math.atan2(dy, dx)
            p.vx = -Math.cos(angle) * force * 0.8 + windX
            p.vy = -Math.sin(angle) * force * 0.4 + p.fallSpeed
            p.size = p.baseSize * (1 + force * 0.6)
            p.opacity = Math.min(1, p.baseOpacity + force * 0.4)
          } else {
            p.vx = windX
            p.size += (p.baseSize - p.size) * 0.1
            p.opacity += (p.baseOpacity - p.opacity) * 0.1
          }
        } else {
          p.vx = windX
          p.size += (p.baseSize - p.size) * 0.1
          p.opacity += (p.baseOpacity - p.opacity) * 0.1
        }

        p.x += p.vx
        p.y += p.vy

        if (p.y > canvas.height + 10) {
          p.y = -10
          p.x = Math.random() * canvas.width
          p.windOffset = Math.random() * Math.PI * 2
        }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        const curTheme = themeRef.current
        const color = getParticleColor(p.type, curTheme)

        ctx.save()
        ctx.globalAlpha = p.opacity

        if (p.type === 'leaf') {
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.ellipse(p.x, p.y, p.size * 1.2, p.size * 0.8, Math.sin(p.windOffset) * 0.3, 0, Math.PI * 2)
          ctx.fill()
        } else {
          const rgb = hexToRgb(color)
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()

          // 光のハロー
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5)
          grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.opacity * 0.5})`)
          grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  )
}

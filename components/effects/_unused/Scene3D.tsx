'use client'

import { PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'

import AmbientLightParticles from './AmbientLightParticles'
import CharacterAura from './CharacterAura'
import FloatingLeaves from './FloatingLeaves'
import ParticleSystem from './ParticleSystem'

export default function Scene3D() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* カメラ設定 */}
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />

          {/* 環境光 */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.3} />
          <pointLight position={[-10, -10, -5]} intensity={0.2} color="#ffd700" />

          {/* パーティクルシステム */}
          <ParticleSystem count={300} type="leaves" />
          <ParticleSystem count={150} type="light" />

          {/* 浮遊する葉っぱ */}
          <FloatingLeaves count={25} />

          {/* 環境光パーティクル */}
          <AmbientLightParticles count={150} />

          {/* キャラクター周りのオーラ */}
          <CharacterAura />
        </Suspense>
      </Canvas>
    </div>
  )
}

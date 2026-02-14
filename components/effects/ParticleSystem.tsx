'use client'

import { PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

interface ParticleSystemProps {
  count?: number
  type?: 'leaves' | 'light'
}

export default function ParticleSystem({ count = 500, type = 'leaves' }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)

  // パーティクルの位置と速度を生成
  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // ランダムな初期位置（画面全体に散らばる）
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = Math.random() * 15 - 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      // ランダムな速度
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = Math.random() * 0.01 + 0.005
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02

      // サイズ（葉っぱは大きく、光は小さく）
      sizes[i] = type === 'leaves' ? Math.random() * 0.3 + 0.2 : Math.random() * 0.1 + 0.05
    }

    return { positions, velocities, sizes }
  }, [count, type])

  // アニメーションループ
  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      // 位置を更新
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      // 画面外に出たらリセット
      if (positions[i * 3 + 1] > 10) {
        positions[i * 3] = (Math.random() - 0.5) * 20
        positions[i * 3 + 1] = -5
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      }

      // 左右の境界で反転
      if (Math.abs(positions[i * 3]) > 10) {
        velocities[i * 3] *= -1
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geom
  }, [count])

  return (
    <points ref={pointsRef} geometry={geometry}>
      <PointMaterial
        transparent
        sizeAttenuation={true}
        depthWrite={false}
        color={type === 'leaves' ? '#a8d5ba' : '#ffd700'}
        opacity={type === 'leaves' ? 0.6 : 0.8}
        size={type === 'leaves' ? 0.5 : 0.2}
      />
    </points>
  )
}

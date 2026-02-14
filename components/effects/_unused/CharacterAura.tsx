'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh } from 'three'
import * as THREE from 'three'

export default function CharacterAura() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return

    // 呼吸のようなアニメーション
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    meshRef.current.scale.set(scale, scale, scale)

    // 回転
    meshRef.current.rotation.z += 0.005
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <ringGeometry args={[2, 3, 64]} />
      <meshBasicMaterial color="#ffd700" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  )
}

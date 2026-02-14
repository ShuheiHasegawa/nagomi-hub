'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh } from 'three'
import * as THREE from 'three'

export default function MouseInteraction() {
  const meshRef = useRef<Mesh>(null)
  const { viewport, mouse } = useThree()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return

    // マウス位置に基づいて光の位置を更新
    const x = (state.mouse.x * viewport.width) / 2
    const y = (state.mouse.y * viewport.height) / 2

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x, 0.1)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y, 0.1)
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <circleGeometry args={[2, 32]} />
      <meshBasicMaterial
        color="#ffd700"
        transparent
        opacity={hovered ? 0.3 : 0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

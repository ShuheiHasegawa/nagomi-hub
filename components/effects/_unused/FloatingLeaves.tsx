'use client'

import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { Mesh } from 'three'
import * as THREE from 'three'

interface Leaf {
  position: [number, number, number]
  rotation: [number, number, number]
  rotationSpeed: [number, number, number]
  floatSpeed: number
}

export default function FloatingLeaves({ count = 30 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  const leaves = useMemo<Leaf[]>(() => {
    return Array.from({ length: count }, () => ({
      position: [(Math.random() - 0.5) * 15, Math.random() * 10 - 5, (Math.random() - 0.5) * 8] as [
        number,
        number,
        number,
      ],
      rotation: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ] as [number, number, number],
      rotationSpeed: [
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
      ] as [number, number, number],
      floatSpeed: Math.random() * 0.01 + 0.005,
    }))
  }, [count])

  useFrame((state) => {
    if (!groupRef.current) return

    // 全体をゆっくり回転
    groupRef.current.rotation.y += 0.001

    // 各葉っぱをアニメーション
    groupRef.current.children.forEach((child, i) => {
      const leaf = leaves[i]
      if (leaf) {
        // 浮遊アニメーション
        child.position.y += Math.sin(state.clock.elapsedTime + i) * leaf.floatSpeed
        child.position.x += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.01

        // 回転アニメーション
        child.rotation.x += leaf.rotationSpeed[0]
        child.rotation.y += leaf.rotationSpeed[1]
        child.rotation.z += leaf.rotationSpeed[2]

        // 画面外に出たらリセット
        if (child.position.y > 8) {
          child.position.y = -5
          child.position.x = (Math.random() - 0.5) * 15
        }
      }
    })
  })

  return (
    <group ref={groupRef}>
      {leaves.map((leaf, i) => (
        <mesh key={i} position={leaf.position} rotation={leaf.rotation}>
          <planeGeometry args={[0.3, 0.4]} />
          <meshBasicMaterial
            color="#a8d5ba"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            map={undefined}
          />
        </mesh>
      ))}
    </group>
  )
}

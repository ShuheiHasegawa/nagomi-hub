'use client'

import { PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

export default function AmbientLightParticles({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // 球状に配置
      const radius = Math.random() * 8 + 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // 速度（ゆっくり動く）
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01

      // 色（温かい光）
      const color = new THREE.Color()
      color.setHSL(0.1 + Math.random() * 0.1, 0.5, 0.6 + Math.random() * 0.3)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, velocities, colors }
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    const colorArray = pointsRef.current.geometry.attributes.color.array as Float32Array

    for (let i = 0; i < count; i++) {
      // 位置を更新
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      // 明るさをアニメーション
      const brightness = 0.5 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3
      const baseR = colors[i * 3]
      const baseG = colors[i * 3 + 1]
      const baseB = colors[i * 3 + 2]

      colorArray[i * 3] = baseR * brightness
      colorArray[i * 3 + 1] = baseG * brightness
      colorArray[i * 3 + 2] = baseB * brightness
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.color.needsUpdate = true
  })

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geom
  }, [positions, colors])

  return (
    <points ref={pointsRef} geometry={geometry}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </points>
  )
}

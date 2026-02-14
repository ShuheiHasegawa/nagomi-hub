'use client'

import { motion } from 'framer-motion'

interface FloatingActionButtonProps {
  icon: string
  label: string
  onClick: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  index?: number
}

export default function FloatingActionButton({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  index = 0,
}: FloatingActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'right-6',
    'bottom-left': 'left-6',
    'top-right': 'right-6',
    'top-left': 'left-6',
  }

  const getVerticalPosition = () => {
    const baseOffset = 24 // 24px (bottom-6)
    const buttonHeight = 56 // 14 * 4 = 56px (w-14 h-14)
    const gap = 16 // ボタン間の間隔
    const offset = baseOffset + index * (buttonHeight + gap)

    if (position === 'bottom-right' || position === 'bottom-left') {
      return { bottom: `${offset}px` }
    } else {
      return { top: `${offset}px` }
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fixed ${positionClasses[position]} w-14 h-14 rounded-full glass-strong flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-shadow z-30`}
      style={getVerticalPosition()}
      title={label}
    >
      {icon}
    </motion.button>
  )
}

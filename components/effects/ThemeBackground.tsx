'use client'

import { useTheme } from 'next-themes'

export default function ThemeBackground() {
  const { theme } = useTheme()

  return (
    <div className="absolute inset-0 z-[1] transition-colors duration-300 bg-base-100">
      <div className="absolute inset-0 bg-gradient-to-br from-base-200/10 via-primary/5 to-base-300/10" />
    </div>
  )
}

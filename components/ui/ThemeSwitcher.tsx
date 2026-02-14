'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useRef } from 'react'

import { themes, type Theme } from '@/lib/themes'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-base-200 transition-colors"
        aria-label="テーマを変更"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-base-content"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M6.34 17.66l-1.41 1.41" />
          <path d="M19.07 4.93l-1.41 1.41" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-base-100 rounded-lg shadow-lg border border-base-300 z-[100]">
          <div className="p-2">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors ${
                  theme === themeOption.value ? 'bg-base-200' : ''
                }`}
              >
                <span className="text-xl">{themeOption.icon}</span>
                <span className="text-base-content flex-1 text-left">{themeOption.label}</span>
                {theme === themeOption.value && <span className="text-primary">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
